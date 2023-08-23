import * as Parser from 'acorn-loose/dist/acorn-loose.js';

import * as walk from 'acorn-walk';
import { isEmpty } from '../../utility/utils'

import {
    NUMBER,
    STRING,
    ANY,
    ERROR_TEXTS,
    EXP_FUNCTIONS,
    ADV_QUOTA_EXP_FUNS,
    Identifier,
    BinaryExpression,
    ThisExpression,
    Literal,
    CallExpression,
    MemberExpression,
    Operator,
    UnaryOperator,
    Suffix,
    MemberKeyword,
    SubSelector,
    ARR_NUM,
    ARR_STR,
    BOOLEAN,
    IGNORE,
    AdvQuota
} from './constants';

const ReservedWords = {
    'break': '$reak',
    'case': '$ase',
    'catch': '$atch',
    'class': '$lass',
    'const': '$onst',
    'continue': '$ontinue',
    'debugger': '$ebugger',
    'default': '$efault',
    'delete': '$elete',
    'do': '$o',
    'else': '$lse',
    'export': '$xport',
    'extends': '$xtends',
    'finally': '$inally',
    'for': '$or',
    'function': '$unction',
    'if': '$f',
    'import': '$mport',
    'in': '$n',
    'instanceof': '$nstanceof',
    'new': '$ew',
    'return': '$eturn',
    'super': '$uper',
    'switch': '$witch',
    /* 'this': '$his', */
    'throw': '$hrow',
    'try': '$ry',
    'typeof': '$ypeof',
    'var': '$ar',
    'void': '$oid',
    'while': '$hile',
    'with': '$ith',
    'yield': '$ield',
};


const OperatorMap = {
    'eq': '==',
    'ne': '!=',
    'le': '<=',
    'ge': '>=',
    'lt': '< ',
    'gt': '> ',
    'and': '&& ',
    'or': '||',
};

function objectFlip(obj) {
    const ret = {};
    Object.keys(obj).forEach((key) => {
        ret[obj[key].trim()] = key;
    });
    return ret;
}
const OperatorRevMap = objectFlip(OperatorMap);

const OperatorMapPattern = '\\b(' + Object.keys(OperatorMap).join('|') + ')\\b';

const ReservedWordsRevMap = objectFlip(ReservedWords);

const ReservedWordsPattern = '\\b(' + Object.keys(ReservedWords).join('|') + ')\\b';
const ReservedWordsRevPattern = '^(\\' + Object.keys(ReservedWordsRevMap).join('|\\') + ')$';

const INVALID_ARGUMENT_COUNT = {
    FOUND : 1,
    PROCESSED_NO_ERROR: 2,
    PROCESSED_HAS_ERROR: 3,
};

function isNumeric(n) {
    return ~~n === n;
}

function isValidFunction(name) {
    if (EXP_FUNCTIONS[name] !== undefined && ADV_QUOTA_EXP_FUNS[name] !== undefined) {
        return false;
    } else {
        return true;        
    }
}

function getReturnType(name) {
    if(EXP_FUNCTIONS[name]) {
        return EXP_FUNCTIONS[name].returnType;
    } else {
        ADV_QUOTA_EXP_FUNS[name].returnType;
    }
}

function isValidSubSelector(name) {
    if (name.match(/^(comments|nocomments|sq_)/)) {
        return true;
    }
    return false;
}

function isValidSuffix(name) {
    let isValid = false;
    switch (name) {
        case 'shown': // Any
        case 'code':
        case 'NAOK':
        case 'value':
        case 'valueNAOK':
        case 'relevanceStatus': //Boolean
            isValid = true;
            break;
        default:
            break;
    }
    return isValid;
}

function isValidAdvQuotaSuffix(name, suffixes) {
    var advQuotaSuffixes = Object.keys(suffixes);
    return advQuotaSuffixes.includes(name);
}

/* Functions, operators, suffix, tokens, identifiers, litrals */
export default function evaluateExpression(expr, validIdentifiers, suffixes, identifiersPattern) {
    let keepOrginalExpr = expr;
    class ASTnode {
        constructor(node, error = null) {
            let { type, name, start, end } = node;
            if (name === undefined && type === Literal) {
                name = node.value;
            }

            if (type === CallExpression) {
                name = node.callee.name.replace(/^(fi)$/, 'if');
            } else if (type === Operator) {
                let org = keepOrginalExpr.substring(node.left.end, node.right.start);
                let op = node.operator.trim();
                if (!org.includes(op)) {
                    op = OperatorRevMap[op];
                    let index = org.toLowerCase().indexOf(op);
                    op = org.substring(index, index + op.length);
                }
                let index = org.indexOf(op);
                start = node.left.end + index;
                end = start + op.length;
                name = op;
            } else if (type === UnaryOperator) {
                name = node.operator.trim();
                end = start + name.length;
                type = Operator;
            } else if (type === Identifier) {
                let rw = new RegExp(ReservedWordsRevPattern, 'i');
                name = name.replace(rw, function(matched) {
                    return ReservedWordsRevMap[matched.toLowerCase()];
                });
            }

            this.type = type;
            this.name = name;
            this.start = start;
            this.end = end;
            this.error = error;
        }
    }

    function validateIdentifier(node, ancestors, result, validateReturnType) {
        let name = node.name;

        if (!isEmpty(identifiersPattern) && tokenPattern.test(name)) {
            name = name.replace(tokenPattern, '$1:');
            if (!isValidVariable(name)) {
                result.push(new ASTnode({ ...node, name: name }, ERROR_TEXTS.UNDEFINED_IDENTIFIER));
                return;
            }
        } else {
            if (!isValidVariable(name)) {
                result.push(new ASTnode(node, ERROR_TEXTS.UNDEFINED_IDENTIFIER));
                return;
            }
        }

        let ancestor = ancestors[ancestors.length - 1];
        let returnType = getVariableType(name);
        
        if (ancestor.type !== CallExpression && (returnType === ARR_NUM || returnType === ARR_STR)) {
            //Identifier return type should not be an array;
            result.push(new ASTnode(node, ERROR_TEXTS.INVALID_IDENTIFIER));
            return;
        }
        
        if (validateReturnType !== undefined) {
            let isValidParam = validateReturnType(getVariableType(name));
            if (isValidParam) {
                if (name === 'self' || name === 'this') {
                    result.push(new ASTnode({ ...node, name: name, type: MemberKeyword }));
                } else {
                    result.push(new ASTnode({ ...node, name: name }));
                }
            } else {
                result.push(new ASTnode({ ...node, name: name }, ERROR_TEXTS.INVALID_ARGUMENT_TYPE));
            }
        } else {
            result.push(new ASTnode({ ...node, name: name }));
        }
    }

    function getPropList(node) {
        let props = [];
        let n = node;
        while (n) {
            if (n.property) {
                props.push(n.property);
            } else if (n.type === ThisExpression) {
                props.push({ ...n, name: 'this' });
            } else {
                props.push(n);
            }
            n = n.object;
        }
        props.reverse();
        return props;
    }

    function validateMemberExpression(node, parent, ancestors, result, validateReturnType) {
        let props = getPropList(node);
        
        let identifier = null;
        let suffix = null;

        let index = 0;
        let prop = props[index++];
        let root = prop.name;
        let max = (root === 'that') ? 4 : 3;
        let min = (root === 'that') ? 2 : 1;

        let res = [];
        if( root === 'Responses' || root === 'Users' || root === 'UserAttributes') {
            prop = props[index++];
            var name = props.map(p => p.name).join('.');
            if(!isValidAdvQuotaSuffix(name, suffixes)) {
                result.push(new ASTnode({ ...node, name: name, type: AdvQuota }, ERROR_TEXTS.INVALID_IDENTIFIER));
                return;
            } else {
                result.push(new ASTnode({ ...node, name: name, type: AdvQuota }));
                return;
            }
            
        }
        if (!(root === 'this' || root === 'self' || root === 'that')) {
            identifier = prop;
            if (!isValidVariable(identifier.name)) {
                result.push(new ASTnode({ ...node, name: props.map(p => p.name).join('.'), type: Identifier }, ERROR_TEXTS.UNDEFINED_IDENTIFIER));
                return;
            }
            let returnType = getVariableType(identifier.name);
            if (returnType === ARR_NUM || returnType === ARR_STR) {
                //Identifier return type should not be an array;
                result.push(new ASTnode({ ...node, name: props.map(p => p.name).join('.'), type: Identifier }, ERROR_TEXTS.INVALID_IDENTIFIER));
                return;
            }
        } else if ((root === 'this' || root === 'self' || root === 'that') && props.length <= max && props.length >= min) {
            let memberRoot = prop;
            if (root === 'that') {
                prop = props[index++];
                identifier = prop;
                if (!isValidVariable(`that.${identifier.name}`)) {
                    result.push(new ASTnode({ ...node, name: props.map(p => p.name).join('.'), type: Identifier }, ERROR_TEXTS.UNDEFINED_IDENTIFIER));
                    return;
                }
            } else {
                if (!isValidVariable(root)) {
                    result.push(new ASTnode({ ...node, name: props.map(p => p.name).join('.'), type: Identifier }, ERROR_TEXTS.INVALID_IDENTIFIER));
                    return;
                }
            }

            let ancestor = ancestors[ancestors.length - 1];
            let varName = (identifier && identifier.name) || root;
            let returnType;
            if (root === 'that') {
                returnType = getVariableType(`that.${varName}`);
            } else {
                returnType = getVariableType(varName);
            }

            if (ancestor.type !== CallExpression && (returnType === ARR_NUM || returnType === ARR_STR)) {
                //Identifier return type should not be an array;
                result.push(new ASTnode({ ...node, name: props.map(p => p.name).join('.'), type: Identifier }, ERROR_TEXTS.INVALID_IDENTIFIER));
                return;
            }
            res.push(new ASTnode({ ...memberRoot, type: MemberKeyword }));    
        } else {
            result.push(new ASTnode({ ...node, type: Identifier, name: props.map(p => p.name).join('.') }, ERROR_TEXTS.INVALID_IDENTIFIER));
            return;
        }

        let remaining = props.length - index;
        if (remaining) {
            if (remaining > 2) {
                result.push(new ASTnode({ ...node, type: Identifier, name: props.map(p => p.name).join('.') }, ERROR_TEXTS.INVALID_IDENTIFIER));
                return;
            }
            if (remaining === 2) {
                //Have subselector
                prop = props[index++];
                if (isValidSubSelector(prop.name)) {
                    res.push(new ASTnode({ ...prop, type: SubSelector }));
                } else {
                    res.push(new ASTnode({ ...prop, type: SubSelector }, ERROR_TEXTS.INVALID_SUBSELECTOR));
                }
                
                prop = props[index++];

                if (isValidSuffix(prop.name)) {
                    suffix = prop;
                    res.push(new ASTnode({ ...prop, type: Suffix }));
                } else {
                    res.push(new ASTnode({ ...prop, type: Suffix }, ERROR_TEXTS.INVALID_SUFFIX));
                }

            } else {
                prop = props[index++];

                if (isValidSuffix(prop.name)) {
                    suffix = prop;
                    res.push(new ASTnode({ ...prop, type: Suffix }));
                } else {
                    if (isValidSubSelector(prop.name)) {
                        res.push(new ASTnode({ ...prop, type: SubSelector }));
                    } else  {
                        res.push(new ASTnode({ ...prop, type: Suffix }, ERROR_TEXTS.INVALID_SUFFIX));
                    }
                }
            }
        }
        
        if (validateReturnType !== undefined && identifier) {
            let type;
            if ((root === 'this' || root === 'self' || root === 'that')) {
                let varName = root === 'that' ? `that.${identifier.name}` : root;
                type = getVariableType(varName);
                if (parent.invalidArgumentCount === INVALID_ARGUMENT_COUNT.FOUND) {
                    if (type) {
                        parent.invalidArgumentCount = INVALID_ARGUMENT_COUNT.PROCESSED_NO_ERROR;
                    } else {
                        parent.invalidArgumentCount = INVALID_ARGUMENT_COUNT.PROCESSED_HAS_ERROR;
                    }
                }
            } else {
                type = getVariableType(identifier.name);
                if (suffix) {
                    if (suffix.name === 'relevanceStatus') {
                        type = BOOLEAN;
                    } else if (suffix.name === 'shown') {
                        type = ANY;
                    }
                }
            }

            let isValidParam = validateReturnType(type);
            if (isValidParam) {
                res.push(new ASTnode({ ...identifier, type: Identifier }));
            } else {
                result.push(new ASTnode({ ...node, name: props.map(p => p.name).join('.'), type: Identifier }, ERROR_TEXTS.INVALID_ARGUMENT_TYPE));
                return;
            }
        } else if (identifier) {
            res.push(new ASTnode({ ...identifier, type: Identifier }));
        }
        
        if (res.length) {
            result.push(...res);
        }
    }

    function validateCallExpression(node, ancestors, result) {
        if (!node.callee.name) {
            return;
        }

        let ancestor = ancestors[ancestors.length - 2];
        //get the details of callee function
        let functionName = node.callee.name.replace(/^(fi)$/, 'if');

        if (node.callee.type === Identifier && !isValidFunction(functionName)) {
            result.push(new ASTnode(node, ERROR_TEXTS.INVALID_FUNCTION));
            return;
        }

        let functionDetails = (EXP_FUNCTIONS[functionName] !== undefined ? EXP_FUNCTIONS[functionName] : ADV_QUOTA_EXP_FUNS[functionName]);

        if (node.type === MemberExpression) {
            result.push(new ASTnode(node, ERROR_TEXTS.INVALID_MEMBER_FUNCTION));
            return;
        }

        let paramCount = node.arguments.length;
        let allowedParams = functionDetails.paramsCount[0];
        let isInfinityParamsAllowed = functionDetails.paramsCount[1] && functionDetails.paramsCount[1][0] === 'n';
        let maxFinitParams = allowedParams.length && allowedParams[allowedParams.length - 1];

        if (!(allowedParams.includes(paramCount) || (maxFinitParams < paramCount && isInfinityParamsAllowed))) {
            if (isInfinityParamsAllowed && paramCount > 0) {
                node.invalidArgumentCount = INVALID_ARGUMENT_COUNT.FOUND;
            } else {
                result.push(new ASTnode(node, ERROR_TEXTS.INVALID_ARGUMENTS_COUNT));
            }
        } else if(ancestor.type !== CallExpression) {
            result.push(new ASTnode(node));
        } else if(ancestor.type === CallExpression) {
            //will be checked by parent callexp -> vadidateparameters method
            node.isValidAndNotAddedToList = true;
        }
        validateParameters(functionDetails, node, node.arguments, ancestors, result);
        if (node.invalidArgumentCount && node.invalidArgumentCount === 3) {
            result.push(new ASTnode(node, ERROR_TEXTS.INVALID_ARGUMENTS_COUNT));
        } else if (node.invalidArgumentCount) {
            result.push(new ASTnode(node));
        }
    }

    function checkParamType(functionDetails, index, paramType) {
        if (paramType === IGNORE) {
            return true;
        }
        if (paramType === ARR_NUM || paramType === ARR_STR) {
            let subParamType = paramType === ARR_NUM ? NUMBER : STRING;
            if (functionDetails.paramType['n'] && (functionDetails.paramType['n'] === ANY || functionDetails.paramType['n'] === subParamType)) {
                return true;
            } else {
                return false;
            }
        }
        if (!(functionDetails.paramType[index] === ANY ||
                functionDetails.paramType[index] === paramType ||
                (functionDetails.paramType[index] === undefined &&
                    (functionDetails.paramType['n'] === ANY || functionDetails.paramType['n'] === paramType)))) {
            return false;
        }
        return true;
    }

    function validateParameters(functionDetails, node, parameters, ancestors, result) {
        for (let index = 0; index < parameters.length; index++) {
            const param = parameters[index];
            if (param.type === Identifier) {
                validateIdentifier(param, ancestors, result, checkParamType.bind(this, functionDetails, index + 1));
            } else if (param.type === MemberExpression) {
                validateMemberExpression(param, node, ancestors, result, checkParamType.bind(this, functionDetails, index + 1));
            } else if (param.type === CallExpression) {
                let functionName = param.callee.name.replace(/^(fi)$/, 'if');
                if (isValidFunction(functionName)) {
                    let paramType = getReturnType(functionName);
                    let isValidParam = checkParamType(functionDetails, index + 1, paramType);
                    if (!isValidParam) {
                        result.push(new ASTnode(param, ERROR_TEXTS.INVALID_ARGUMENT_TYPE));
                    } else if (param.isValidAndNotAddedToList) {
                        result.push(new ASTnode(param));
                    }
                }
            } else if (param.type === Literal) {
                let paramType = isNumeric(param.value) ? NUMBER : STRING;
                let isValidParam = checkParamType(functionDetails, index + 1, paramType);
                if (isValidParam) {
                    result.push(new ASTnode(param));
                } else {
                    result.push(new ASTnode(param, ERROR_TEXTS.INVALID_ARGUMENT_TYPE));
                }
            } else if (param.type === BinaryExpression) {
                let paramType = NUMBER;
                let isValidParam = checkParamType(functionDetails, index + 1, paramType);
                if (isValidParam) {
                    result.push(new ASTnode(param));
                } else {
                    result.push(new ASTnode(param, ERROR_TEXTS.INVALID_ARGUMENT_TYPE));
                }
            }
        }
    }

    function isValidVariable(name) {
        return validIdentifiers[name] !== undefined;
    }

    function getVariableType(name) {
        return validIdentifiers[name] && validIdentifiers[name].returnType;
    }

    function createTokenPattern(pattern) {
        return new RegExp(`^(${pattern})\\$`, 'i');
    }

    let result = [];
    let tokenPattern = '';
    if (!isEmpty(identifiersPattern)) {
        tokenPattern = createTokenPattern(identifiersPattern);
        let tokenExp = new RegExp(`\\b(${identifiersPattern}):`, 'gi');
        expr = expr.replace(tokenExp, '$1$');
    }
    expr = expr.replace(/\b(if\()/g, 'fi(');
    
    let op = new RegExp(OperatorMapPattern, 'gi');
    expr = expr.replace(op, function(matched) {
        return OperatorMap[matched.toLowerCase()];
    });

    let rw = new RegExp(ReservedWordsPattern, 'gi');
    expr = expr.replace(rw, function(matched) {
        return ReservedWords[matched.toLowerCase()];
    });
    let ast = Parser.parse(expr);

    try {
        walk.ancestor(ast, {
            Literal(node, ancestors) {
                let ancestor = ancestors[ancestors.length - 2];
                if (ancestor.type === CallExpression) {
                    //it is already handled in callexpression
                    return;
                }
                result.push(new ASTnode(node));
            },
            Identifier(node, ancestors) {
                let ancestor = ancestors[ancestors.length - 2];
                if (ancestor.type === CallExpression || ancestor.type === MemberExpression){
                    //it is already handled in callexpression
                    return;
                }
                validateIdentifier(node, ancestors, result);
            },
            BinaryExpression(node) {
                /* console.log(`Found Left: ${node.left}`);
                console.log(`Found Right: ${node.right}`);
                if (node.left.type === 'Identifier' && node.left.name === '✖' || 
                    node.right.type === 'Identifier' && node.right.name === '✖' ) {
                    console.log('----->', node.right.name);
                } */
                result.push(new ASTnode({ ...node, type: Operator }));
            },
            LogicalExpression(node) {
                result.push(new ASTnode({ ...node, type: Operator }));
            },
            UnaryExpression(node) {
                result.push(new ASTnode({ ...node, type: UnaryOperator }));
            },
            MemberExpression(node, ancestors) {
                let ancestor = ancestors[ancestors.length - 2];
                if (ancestor.type === CallExpression || ancestor.type === MemberExpression) {
                    //it is already handled in callexpression and root member
                    return;
                }
                validateMemberExpression(node, null, ancestors, result);
            },
            CallExpression(node, ancestors) {
                validateCallExpression(node, ancestors, result);
            },
            ThisExpression(node, ancestors) {
                let ancestor = ancestors[ancestors.length - 2];
                if (ancestor.type === CallExpression || ancestor.type === MemberExpression) {
                    //it is already handled in callexpression
                    return;
                }
                validateIdentifier({ ...node, name: 'this', type: Identifier }, ancestors, result);
            },
        });
    } catch (e) {
        console.error(e);
    }
    //console.debug('result --->', result);
    return result;
}
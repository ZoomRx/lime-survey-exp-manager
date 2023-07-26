import {
    EXP_FUNCTIONS,
    CallExpression,
    Suffix,
    Literal,
    Identifier,
    Operator,
    SubSelector,
    ADV_QUOTA_EXP_FUNS,
    AdvQuota,
} from './constants';

// Classes to be added to the parsed takens from expression
const CLASSES = {
    [ CallExpression ]: 'exp-function',
    [ Literal ]: 'exp-literal',
    [ Suffix ]: 'exp-suffix',
    [ Identifier ]: 'exp-variable',
    [ Operator ]: 'exp-operator',
    [ SubSelector ]: 'exp-subselector',
    [ AdvQuota ] : 'adv-quota',
    'error': 'error'
};



// Pop out the required number of elements from a stack
// function popStack(stack, count) {
//     for (; count > 0; count --) {
//         stack.pop();
//     }
// }
// Clear the classes previously added to tokens present in the expression
function clearMarkers(markers) {
    markers.forEach(marker => marker.clear());
}
// Add the currently typed argument for a function in the expression
function updateArgsCount(funObj, commas) {
    if (!EXP_FUNCTIONS[funObj.name] && !ADV_QUOTA_EXP_FUNS[funObj.name]) {
        return;
    }
    let defParams = EXP_FUNCTIONS[funObj.name].params.length - 1,
        seenCommas = funObj.argsIncomplete + commas;
    // To highlight the last param in the case of functions with infinite params
    funObj.argsIncomplete = Math.min(defParams, seenCommas);
}

// Goes through the function and open braces stack
// and updates the function argument count or pop them out based on closed braces and commas
function updateFunctionStack(stack, inbChars) {
    if (!inbChars.length) {
        return;
    }
    for (let index = 0; index < inbChars.length; index++) {
        switch(inbChars[index]) {
            case ',':
                updateArgsCount(stack[stack.length - 1], 1);
                break;
            case '(':
                stack.push('(');
                break;
            case ')':
                // if(openBraces.length) {
                //     openBraces.pop();
                // } else {
                // }
                stack.pop();
                break;
        }
        if (!stack.length) {
            break;
        }
    }
}

// Returns the last top most function which is yet to be completed
function findLastFunction(stack) {
    var top;
    do {
        top = stack.pop();
    } while(top === "(")
    return top;
}
// 1. Add classes to the tokens present
// 2. Return the token which needs description or suggestion to be displayed
export default function ParseAndHighlight(exp, results, codeMirror, options/*, cursorPos*/) {
    var fs = [],
        last = null,
        expressionString = '',
        rhsSuggestionAttr = {
            invalidSuffix: ['value', 'valueNAOK', 'relevanceStatus'],
            validOperators: ['==', '!=', 'eq', 'ne'],
        },
        cursorPos = codeMirror.getCursor(),
        lastIdentifier = null,
        lastSuffix = null,
        stopProcessing = false,
        previousFsLenght = 0;
    clearMarkers(codeMirror.getAllMarks());
    const sortBystart = (results) => results.sort((a, b) => a.start - b.start);
    results = sortBystart(results);
    let markTexts = [];
    for (let index = 0; index < results.length; index++) {
        let current = results[index];
        previousFsLenght = fs.length;
        if (last && !stopProcessing) {
            // Find which function expression the cursor currently is in
            let end = last.end;
            if (last.type === CallExpression) {
                // Move to the end of the function name
                end = last.start + last.name.length;
                // Move to the position after the function's open brace, to effectively ignore it
                end += exp.slice(end, current.start).indexOf('(') + 1;
            }
            let inbChars = exp.slice(end, current.start);
            fs.length && (updateFunctionStack(fs, inbChars));
            // pop the stack for any fully written function
            // popStack(fs, closes);
        }

        let classesToAdd = `${CLASSES[current.type]} ${(current.error ? CLASSES.error : '')}`,
            attributes = {title: current.error || ''},
            stringProcessed = exp.slice(0, current.start),
            lineOffset = stringProcessed.lastIndexOf('\n'),
            lineNumber = (stringProcessed.match(/\n/g) || []).length;
        
        if (lineOffset === -1) {
            lineOffset = 0;
        }
        // Add class to the token 
        if (options.bufferHighlight) {
            markTexts.push({
                from: {
                    line: lineNumber,
                    ch: current.start - lineOffset
                },
                to: {
                    line: lineNumber,
                    ch: current.end - lineOffset
                },
                options: {
                    className: classesToAdd,
                    attributes
                }
            });
        } else {
            codeMirror.markText({
                line: lineNumber,
                ch: current.start - lineOffset
            },
            {
                line: lineNumber,
                ch: current.end - lineOffset
            }, {
                className: classesToAdd,
                attributes
            });
        }
        if (cursorPos.ch < current.start) {
            stopProcessing = true;
            // Handles the case where the user is in the middle of the expression
            // and he has just typed a suffix expression
            if (current.type === Suffix  && current.start === cursorPos.ch + 1) {
                last = current;
            }
            continue;
        }
        if (fs.length < previousFsLenght) {
            expressionString += '_Empty';
        }
        if (current.name !== undefined) {
            let isValidIdentifier = current.type === Identifier && current.name !== "✖";
            let isValidExpression = current.type === Literal || isValidIdentifier;
            let isValidOperator = current.type === Operator && rhsSuggestionAttr.validOperators.includes(current.name);
            let isValidSuffix = current.type === Suffix && !rhsSuggestionAttr.invalidSuffix.includes(current.name);
            let isSupportedExpression = isValidExpression || isValidOperator || isValidSuffix;
            if (isSupportedExpression) {
                expressionString += `_${current.type}`;
            } else if (current.name === "✖") {
                expressionString += '_Suggester';
            } else {
                expressionString += '_Empty';
            }
                                
            if (isValidIdentifier) {
                lastIdentifier = current;
            }
            if (isValidSuffix) {
                lastSuffix = current;
            }
        }
        // Push any newly seen function to the stack
        if (current.type === CallExpression) {
            current.argsIncomplete = 0;
            fs.push(current);
        }
        last = current;
    }
    if (options.bufferHighlight) {
        codeMirror.operation(function () {
            markTexts.forEach(markTextObj => {
                codeMirror.markText(markTextObj.from, markTextObj.to, markTextObj.options);
            })
        });
    }
    if (last) {
        if (canInsertLastIdentifier(expressionString)) {
            last['lastIdentifier'] = lastIdentifier;
            last['isLastSuffixShown'] = lastSuffix && lastSuffix.name === 'shown' && (lastIdentifier.end + 1 === lastSuffix.start);
            let lastFunction = findLastFunction([...fs]);
            // if literal is at the end of call function, show suggestion (lastFunction.end === last.end)
            if (
                !(last.type === Literal)
                || !lastFunction
                || lastFunction.end === last.end
            ) {
                return last;
            }
        }

        // If the last token is Identifier/ variable which is invalid, it is helpful to show suggestions
        // instead of any other function description
        if (last.error && last.type !== CallExpression) {
            return last;
        }
    
        // Find which function expression the cursor currently is in
        let end = last.end;
        if (last.type === CallExpression) {
            end = last.start + last.name.length;
        }
        let inbChars = exp.slice(end);
        // let commas = (inbChars.match(/,/g) || []).length;
        fs.length && (updateFunctionStack(fs, inbChars));
        // pop the stack for the last function if it is fully written
        // popStack(fs, (inbChars.match(/\)/g) || []).length);
    }
    function canInsertLastIdentifier(expression) {
        if (!lastIdentifier) {
            return false;
        }
        let validExpressions = [
            `_${Identifier}_${Operator}`, 
            `_${Identifier}_${Suffix}_${Operator}`,
            `_${Identifier}_${Operator}_Suggester`, 
            `_${Identifier}_${Suffix}_${Operator}_Suggester`,
            `_${Identifier}_${Operator}_${Literal}`, 
            `_${Identifier}_${Suffix}_${Operator}_${Literal}`,
        ]
        return validExpressions.any((validExpression) => expression.endsWith(validExpression));
    }
    return findLastFunction(fs) || last;
}
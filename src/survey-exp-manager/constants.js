export const NUMBER = 'num';
export const ARR_NUM = 'a_num';
export const BOOLEAN = 'bool';
export const STRING = 'str';
export const ARR_STR = 'a_str';
export const ANY = 'any';
export const IGNORE = 'ignore';

export const Identifier = 'Identifier';
export const BinaryExpression = 'BinaryExpression';
export const Literal = 'Literal';
export const CallExpression = 'CallExpression';
export const MemberExpression = 'MemberExpression';
export const Operator = 'Operator';
export const UnaryOperator = 'UnaryOperator';
export const Suffix = 'Suffix';
export const Token = 'Token';
export const ThisExpression = 'ThisExpression';
export const MemberKeyword = 'MemberKeyword';
export const SubSelector = 'SubSelector';
export const AdvQuota = 'AdvQuota';
export const SubSelectorSq = 'SubSelectorSq';
export const SuffixSq = 'SuffixSq';

export const ERROR_TEXTS = {
    INVALID_EXPRESSION: 'Invalid Expression.',
    INVALID_IDENTIFIER: 'Invalid variable.',
    UNDEFINED_IDENTIFIER: 'Undefined variable.',
    INVALID_FUNCTION: 'Undefined function name.',
    INVALID_OPERATOR: 'Invalid operator.',
    INVALID_ARGUMENT_TYPE: 'Invalid argument type.',
    INVALID_ARGUMENTS_COUNT: 'Invalid number of argument(s).',
    INVALID_MEMBER_FUNCTION: 'Member function not supported.',
    INVALID_SUFFIX: 'Invalid suffix.',
    INVALID_SUBSELECTOR: 'Invalid subselector.',
};

export const TOKENS = {
    'USER:ID': {
        description: `User's ID`,
    },
    'USER:EMAIL': {
        description: `User's email`,
    },
    'USER:IS_ANONYMOUS': {
        description: 'Returns boolean(true/false) based on whether the user is anonymous or not',
    },
    'USER:IS_VENDOR_WEB_LOGIN': {
        description: 'Returns boolean(true/false) based on whether the user is web vendor user or not',
    },
    'USER:PROFESSION_TYPE': {
        description: `User's profession type`,
    },
    'TOKEN:IS_WEB': {
        description: 'Returns boolean(true/false) based on whether the user is web user or not',
    },
    'TOKEN:PANEL_SCREENED_IN': {
        description: 'Returns boolean(true/false) based on whether the user has panel screened in or not',
    },
    'TOKEN:WAVE_SCREENED_IN': {
        description: 'Returns boolean(true/false) based on whether the user has wave screened in or not',
    },
    'TOKEN:LOOP_SKIP_QUESTION': {
        description: 'Returns boolean(true/false) based on whether the user is looping in IR survey',
    },
    'TOKEN:WAVE_COMPLETED_COUNT': {
        description: 'Returns the wave completion count',
    },
    'TOKEN:X_BUSINESS_DAYS_FROM_LAST_ATTEMPT': {
        description: 'Returns the number of buisness days between last attempted date and today',
    }
};

export const SUFFIXES = {
    'code': {
        description: 'The selected response code for the question if it is relevant (otherwise blank), or the text value if it is not a coded question',
    },
    'NAOK': {
        description: 'Same as using Qcode. But adding NAOK indicates that the question will have a response',
    },
    'value': {
        description: 'The assessment value for the question if it is relevant (otherwise blank), or the text value if it is not a coded question',
    },
    'valueNAOK': {
        description: 'Same as Qcode.value. But adding NAOK indicates that the question will have a response',
    },
    'shown': {
        description: 'The display value for the question',
    },
    'relevanceStatus': {
        description: 'Whether the question is currently relevant (0 or 1)',
    },
    /** TODO: Following should treat as Subselector */
    'comments': {
        description: 'only subquestions that are comments (e.g., from multiple choice with comment and list with comment)'
    },
    'nocomments': {
        description: 'only subquestions that are not comments'
    },
    'sq_': {
        description: 'sq_X - where X is a row or column identifier. Only subquestions matching pattern X are selected'
    }
};

export const EXP_FUNCTIONS = {
    'abs' : {
        description: 'Absolute value',
        params: [{
            name: 'number',
            desc: 'The value to be converted.',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'acos' : {
        description: 'Arc cosine',
        params: [{
            name: 'x',
            desc: 'Number between -1 and 1',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'addslashes': {
        description: 'Quote string with slashes',
        params: [{
            name: 'string',
            desc: 'The string to be escaped',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': STRING,
        },
        returnType: STRING,
        appendRight: '('
    },
    'asin' : {
        description: 'Returns the arcsine (in radians) of a number',
        params: [{
            name: 'x',
            desc: 'Number between -1 and 1',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'atan' : {
        description: 'Returns the arctangent (in radians) of a number',
        params: [{
            name: 'x',
            desc: 'Number',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'atan2' : {
        description: 'Returns the angle in the plane (in radians) between the positive x-axis and the ray from (0,0) to the point (x,y)',
        params: [{
            name: 'y',
            desc: 'The y coordinate of the point.',
        },{
            name: 'x',
            desc: 'The x coordinate of the point',
        }],
        paramsCount: [
            [1, 2],
        ],
        paramType: {
            '1': NUMBER,
            '2': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'ceil' : {
        description: 'Round fractions up',
        params: [{
            name: 'number',
            desc: 'The value to be converted.',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'checkdate': {
        description: 'Returns true(1) if it is a valid date in gregorian calendar',
        params: [{
            name: 'month',
            desc: 'The month is between 1 and 12',
        }, {
            name: 'day',
            desc: 'The day is within the allowed number of days for the given month. Leap years are taken into consideration.',
        }, {
            name: 'year',
            desc: 'The year is between 1 and 32767 inclusive.',
        }],
        paramsCount: [
            [3],
        ],
        paramType: {
            '1': NUMBER,
            '2': NUMBER,
            '3': NUMBER,
        },
        returnType: BOOLEAN,
        appendRight: '('
    },
    'cos' : {
        description: 'Returns the cosine of the specified angle',
        params: [{
            name: 'x',
            desc: 'The angle in radians for which to return the cosine',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'count': {
        description: 'count the number of answered (non-blank) questions in the list',
        params: [{
            name: 'arg1',
            desc: 'First number or array of numbers to consider when counting',
        }, {
            name: '[arg2,...]',
            additionalName: ' - [optional] repeatable',
            desc: 'Additional numbers to consider when counting',
        },

        ],
        paramsCount: [
            [1],
            ['n'],
        ],
        paramType: {
            '1': ANY,
            'n': ANY,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'countif': {
        description: 'Count the number of answered questions in the list equal to the first argument',
        params: [{
            name: 'matches',
            desc: 'Value that the list need to match against',
        }, {
            name: 'arg1',
            desc: 'First number or array of numbers to consider when counting',
        }, {
            name: '[arg2,...]',
            additionalName: ' - [optional] repeatable',
            desc: 'Additional numbers to consider when counting',
        },

        ],
        paramsCount: [
            [2],
            ['n'],
        ],
        paramType: {
            '1': ANY,
            '2': ANY,
            'n': ANY,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'countifop': {
        description: 'Count the number of answered questions in the list which pass the criteria (arg op value)',
        params: [{
            name: 'operator',
            desc: 'Comparison operator (\'==\', \'!=\', \'>\', \'>=\', \'<\', \'<=\')',
        }, {
            name: 'value',
            desc: 'Value that the list need to match against',
        }, {
            name: 'arg1',
            desc: 'First number or array of numbers to consider when counting',
        }, {
            name: '[arg2,...]',
            additionalName: ' - [optional] repeatable',
            desc: 'Additional numbers to consider when counting',
        }],
        paramsCount: [
            [3],
            ['n'],
        ],
        paramType: {
            '1': STRING,
            '2': ANY,
            '3': ANY,
            'n': ANY,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'date': {
        description: 'Format a local date/time',
        params: [{
            name: 'format',
            desc: 'The format of the outputted date string.',
        }, {
            name: 'timestamp',
            additionalName: '- [optional]',
            desc: 'The optional timestamp parameter is an integer Unix timestamp that defaults to the current local time if a timestamp is not given. In other words, it defaults to the value of time().',
        }],
        paramsCount: [
            [1, 2],
        ],
        paramType: {
            '1': STRING,
            '2': NUMBER,
        },
        returnType: STRING,
        appendRight: '('
    },
    'exp' : {
        description: 'Calculates the exponent of e',
        params: [{
            name: 'number',
            desc: 'The value to be exponent.',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'fixnum' : {
        description: 'Display numbers with comma as decimal separator, if needed',
        params: [{
            name: 'number',
            desc: 'The value to be converted.',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': NUMBER,
        },
        returnType: STRING,
        appendRight: '('
    },
    'floor' : {
        description: 'Round fractions down',
        params: [{
            name: 'number',
            desc: 'The value to be converted.',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'htmlspecialchars': {
        description: 'Convert special characters to HTML entities (always uses ENT_QUOTES and UTF-8)',
        params: [{
            name: 'string',
            desc: 'The string being converted.',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': STRING,
        },
        returnType: STRING,
        appendRight: '('
    },
    'htmlspecialchars_decode': {
        description: 'Convert special HTML entities back to characters (always uses ENT_QUOTES and UTF-8)',
        params: [{
            name: 'string',
            desc: 'The string to decode.',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': STRING,
        },
        returnType: STRING,
        appendRight: '('
    },
    'gmdate': {
        description: 'Format a GMT date/time',
        params: [{
            name: 'format',
            desc: 'The format of the outputted date string.',
        }, {
            name: 'timestamp',
            additionalName: '- [optional]',
            desc: 'The optional timestamp parameter is an integer Unix timestamp that defaults to the current local time if a timestamp is not given. In other words, it defaults to the value of time().',
        }],
        paramsCount: [
            [1, 2],
        ],
        paramType: {
            '1': STRING,
            '2': NUMBER,
        },
        returnType: STRING,
        appendRight: '('
    },
    'htmlentities': {
        description: 'Convert all applicable characters to HTML entities (always uses ENT_QUOTES and UTF-8)',
        params: [{
            name: 'string',
            desc: 'The input string.',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': STRING,
        },
        returnType: STRING,
        appendRight: '('
    },
    'html_entity_decode': {
        description: 'Convert all HTML entities to their applicable characters (always uses ENT_QUOTES and UTF-8)',
        params: [{
            name: 'string',
            desc: 'The input string.',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': STRING,
        },
        returnType: STRING,
        appendRight: '('
    },
    'idate': {
        description: 'Format a local date/time and return integer',
        params: [{
            name: 'format',
            desc: 'The format of the output date string.',
        }, {
            name: 'timestamp',
            additionalName: '- [optional]',
            desc: 'The optional timestamp parameter is an integer Unix timestamp that defaults to the current local time if a timestamp is not given. In other words, it defaults to the value of time().',
        }],
        paramsCount: [
            [1, 2],
        ],
        paramType: {
            '1': STRING,
            '2': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'if': {
        description: 'Excel-style if(test,result_if_true,result_if_false)',
        params: [{
            name: 'test',
            desc: 'Boolean expression to test',
        }, {
            name: 'exp1',
            desc: 'Expression to execute if the test expression is true',
        }, {
            name: 'exp2',
            desc: 'Expression to execute if the test expression is false',
        }],
        paramsCount: [
            [3],
        ],
        paramType: {
            '1': ANY,
            '2': ANY,
            '3': ANY,
        },
        returnType: ANY,
        appendRight: '('
    },
    'implode': {
        description: 'Join array elements with a string using delimiter.',
        params: [{
            name: 'glue',
            desc: 'Delimiter that you want to glue your string with',
        }, {
            name: 'arg1',
            desc: 'First value or array of values to be concatenated',
        }, {
            name: '[arg2,...]',
            additionalName: ' - [optional] repeatable',
            desc: 'Additional values to be concatenated',
        }],
        paramsCount: [
            [2],
            ['n'],
        ],
        paramType: {
            '1': STRING,
            '2': ANY,
            'n': ANY,
        },
        returnType: STRING,
        appendRight: '('
    },
    'intval': {
        description: 'Returns the integer value of var',
        params: [{
            name: 'var',
            desc: 'The value being converted to an integer.',
        }, {
            name: 'base',
            additionalName: '- [optional]',
            desc: 'The optional base value is 10',
        }],
        paramsCount: [
            [1, 2],
        ],
        paramType: {
            '1': ANY,
            '2': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'is_empty': {
        description: 'Determine whether a variable is considered to be empty',
        params: [{
            name: 'var',
            desc: 'The value to be checked.',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': ANY,
        },
        returnType: BOOLEAN,
        appendRight: '('
    },
    'is_float': {
        description: 'Finds whether the type of a variable is float',
        params: [{
            name: 'var',
            desc: 'The value to be evaluated.',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': ANY,
        },
        returnType: BOOLEAN,
        appendRight: '('
    },
    'is_int': {
        description: 'Finds whether the type of a variable is integer',
        params: [{
            name: 'var',
            desc: 'The value to be evaluated.',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': ANY,
        },
        returnType: BOOLEAN,
        appendRight: '('
    },
    'is_nan': {
        description: 'Finds whether a value is not a number',
        params: [{
            name: 'var',
            desc: 'The value to be evaluated.',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': ANY,
        },
        returnType: BOOLEAN,
        appendRight: '('
    },
    'is_null': {
        description: 'Finds whether the variable is NULL',
        params: [{
            name: 'var',
            desc: 'The value to be evaluated.',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': ANY,
        },
        returnType: BOOLEAN,
        appendRight: '('
    },
    'is_numeric': {
        description: 'Finds whether a variable is a number or a numeric string',
        params: [{
            name: 'var',
            desc: 'The value to be evaluated.',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': ANY,
        },
        returnType: BOOLEAN,
        appendRight: '('
    },
    'is_string': {
        description: 'Find whether the type of a variable is string',
        params: [{
            name: 'var',
            desc: 'The value to be evaluated.',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': ANY,
        },
        returnType: BOOLEAN,
        appendRight: '('
    },
    'join': {
        description: 'Join elements as a new string',
        params: [{
            name: 'arg1',
            desc: 'First value or array of values to be concatenated',
        }, {
            name: '[arg2,...]',
            additionalName: ' - [optional] repeatable',
            desc: 'Additional values to be concatenated',
        }],
        paramsCount: [
            [1],
            ['n'],
        ],
        paramType: {
            '1': ANY,
            'n': ANY,
        },
        returnType: STRING,
        appendRight: '('
    },
    'list': {
        description: 'Join elements as a new string with ", " as delimiter',
        params: [{
            name: 'arg1',
            desc: 'First value or array of values to be concatenated',
        }, {
            name: 'arg2',
            desc: 'Second value or array of values to be concatenated',
        }, {
            name: '[arg3,...]',
            additionalName: ' - [optional] repeatable',
            desc: 'Additional values to be concatenated',
        }],
        paramsCount: [
            [2],
            ['n'],
        ],
        paramType: {
            '1': ANY,
            '2': ANY,
            'n': ANY,
        },
        returnType: STRING,
        appendRight: '('
    },
    'log': {
        description: 'The logarithm of number to base, if given, or the natural logarithm.',
        params: [{
            name: 'number',
            desc: 'The value to calculate logarithm for',
        }, {
            name: 'base',
            additionalName: ' - [optional]',
            desc: 'The logarithm base to use. Defaults to e',
        }],
        paramsCount: [
            [1, 2],
        ],
        paramType: {
            '1': NUMBER,
            '2': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'ltrim': {
        description: 'Strip whitespace (or other characters) from the beginning of a string',
        params: [{
            name: 'string',
            desc: 'The input string',
        }, {
            name: 'charlist',
            additionalName: ' - [optional]',
            desc: 'Specify the characters you want to strip. Simply list all characters that you want to be stripped. With .. you can specify a range of characters.',
        }],
        paramsCount: [
            [1, 2],
        ],
        paramType: {
            '1': STRING,
            '2': STRING,
            'n': STRING,
        },
        returnType: STRING,
        appendRight: '('
    },
    'max': {
        description: 'Find highest value',
        params: [{
            name: 'arg1',
            desc: 'First value',
        }, {
            name: '[arg2,...]',
            additionalName: ' - [optional] repeatable',
            desc: 'Additional values',
        }],
        paramsCount: [
            [2],
            ['n']
        ],
        paramType: {
            '1': NUMBER,
            '2': NUMBER,
            'n': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'min': {
        description: 'Find lowest value',
        params: [{
            name: 'arg1',
            desc: 'First value',
        }, {
            name: '[arg2,...]',
            additionalName: ' - [optional] repeatable',
            desc: 'Additional values',
        }],
        paramsCount: [
            [2],
            ['n']
        ],
        paramType: {
            '1': NUMBER,
            '2': NUMBER,
            'n': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'mktime': {
        description: 'Get UNIX timestamp for a date (each of the 6 arguments are optional)',
        params: [{
            name: 'hour',
            additionalName: '- [optional]',
            desc: 'The number of the hour relative to the start of the day determined by month, day and year. Negative values reference the hour before midnight of the day in question. Values greater than 23 reference the appropriate hour in the following day(s).',
        }, {
            name: 'minute',
            additionalName: '- [optional]',
            desc: 'The number of the minute relative to the start of the hour. Negative values reference the minute in the previous hour. Values greater than 59 reference the appropriate minute in the following hour(s).',
        }, {
            name: 'second',
            additionalName: '- [optional]',
            desc: 'The number of seconds relative to the start of the minute. Negative values reference the second in the previous minute. Values greater than 59 reference the appropriate second in the following minute(s).',
        }, {
            name: 'month',
            additionalName: '- [optional]',
            desc: 'The number of the month relative to the end of the previous year. Values 1 to 12 reference the normal calendar months of the year in question.',
        }, {
            name: 'day',
            additionalName: '- [optional]',
            desc: 'The number of the day relative to the end of the previous month. Values 1 to 28, 29, 30 or 31 (depending upon the month) reference the normal days in the relevant month.',
        }, {
            name: 'year',
            additionalName: '- [optional]',
            desc: 'The number of the year, may be a two or four digit value, with values between 0-69 mapping to 2000-2069 and 70-100 to 1970-2000.',
        } ],
        paramsCount: [
            [0, 1, 2, 3, 4, 5, 6],
        ],
        paramType: {
            '1': NUMBER,
            '2': NUMBER,
            '3': NUMBER,
            '4': NUMBER,
            '5': NUMBER,
            '6': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'nl2br': {
        description: 'Inserts HTML line breaks before all newlines in a string',
        params: [{
            name: 'string',
            desc: 'The input string.',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': STRING,
        },
        returnType: STRING,
        appendRight: '('
    },
    'number_format': {
        description: 'Format a number with grouped thousands',
        params: [{
            name: 'number',
            desc: 'The number being formatted.',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': NUMBER,
        },
        returnType: STRING,
        appendRight: '('
    },
    'pi': {
        description: 'Get the value of pi',
        params: [],
        paramsCount: [
            [0],
        ],
        paramType: {},
        returnType: NUMBER,
        appendRight: '('
    },
    'pow': {
        description: 'Exponential expression',
        params: [{
            name: 'base',
            desc: 'The base number',
        }, {
            name: 'exponent',
            desc: 'The exponent used to raise the base',
        }],
        paramsCount: [
            [2]
        ],
        paramType: {
            '1': NUMBER,
            '2': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'quoted_printable_decode': {
        description: 'Convert a quoted-printable string to an 8 bit string',
        params: [{
            name: 'string',
            desc: 'The input string.',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': STRING,
        },
        returnType: STRING,
        appendRight: '('
    },
    'quoted_printable_encode': {
        description: 'Convert a 8 bit string to a quoted-printable string',
        params: [{
            name: 'string',
            desc: 'The input string.',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': STRING,
        },
        returnType: STRING,
        appendRight: '('
    },
    'quotemeta': {
        description: 'Quote meta characters',
        params: [{
            name: 'string',
            desc: 'The input string.',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': STRING,
        },
        returnType: STRING,
        appendRight: '('
    },
    'rand': {
        description: 'Generate a random integer',
        params: [{
            name: 'min',
            additionalName: '- [optional]',
            desc: 'The lowest value to return',
        }, {
            name: 'max',
            additionalName: '- [optional]',
            desc: 'The highest value to return',
        }],
        paramsCount: [
            [0, 2],
        ],
        paramType: {
            '1': NUMBER,
            '2': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'regexMatch': {
        description: 'Compare a string to a regular expression pattern',
        params: [{
            name: 'pattern',
            desc: 'The regular expression pattern to match',
        }, {
            name: 'input',
            desc: 'The input string',
        }],
        paramsCount: [
            [2],
        ],
        paramType: {
            '1': STRING,
            '2': STRING,
        },
        returnType: BOOLEAN,
        appendRight: '('
    },
    'round': {
        description: 'Rounds a number to an optional precision',
        params: [{
            name: 'val',
            desc: 'The value to round',
        }, {
            name: 'precision',
            additionalName: '- [optional]',
            desc: 'The optional number of decimal digits to round to. Default to 0.',
        }],
        paramsCount: [
            [1, 2],
        ],
        paramType: {
            '1': NUMBER,
            '2': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'rtrim': {
        description: 'Strip whitespace (or other characters) from the end of a string',
        params: [{
            name: 'string',
            desc: 'The input string',
        }, {
            name: 'charlist',
            additionalName: ' - [optional]',
            desc: 'Specify the characters you want to strip. Simply list all characters that you want to be stripped. With .. you can specify a range of characters.',
        }],
        paramsCount: [
            [1, 2],
        ],
        paramType: {
            '1': STRING,
            '2': STRING,
        },
        returnType: STRING,
        appendRight: '('
    },
    'sin' : {
        description: 'Returns the sine of a number',
        params: [{
            name: 'x',
            desc: 'A number (given in radians).',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'sprintf': {
        description: 'Return a formatted string',
        params: [{
            name: 'format',
            desc: 'The format string is composed of zero or more directives: ordinary characters (excluding %) that are copied directly to the result and conversion specifications, each of which results in fetching its own parameter.',
        }, {
            name: 'arg1',
            desc: 'First value to replaced',
        }, {
            name: '[arg2,...]',
            additionalName: ' - [optional] repeatable',
            desc: 'Additional values to be replaced',
        }],
        paramsCount: [
            [2],
            ['n'],
        ],
        paramType: {
            '1': STRING,
            '2': ANY,
            'n': ANY,
        },
        returnType: STRING,
        appendRight: '('
    },
    'sqrt' : {
        description: 'Returns the  square root of a number',
        params: [{
            name: 'number',
            desc: 'The value to be converted.',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'stddev': {
        description: 'Calculate the Sample Standard Deviation for the list of numbers',
        params: [{
            name: 'arg1',
            desc: 'First number or array of numbers to add together',
        }, {
            name: '[arg2,...]',
            additionalName: ' - [optional] repeatable',
            desc: 'Additional numbers to add',
        }],
        paramsCount: [
            [2],
            ['n'],
        ],
        paramType: {
            '1': NUMBER,
            '2': NUMBER,
            'n': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'str_pad': {
        description: 'Return a formatted string',
        params: [{
            name: 'input',
            desc: 'The input string',
        }, {
            name: 'pad_length',
            desc: 'If the value of pad_length is negative, less than, or equal to the length of the input string, no padding takes place, and input will be returned.',
        }, {
            name: 'pad_string',
            additionalName: ' - [optional]',
            desc: 'Pad with the specified characters. Defaults to whitespace.',
        },

        ],
        paramsCount: [
            [2, 3],
        ],
        paramType: {
            '1': STRING,
            '2': NUMBER,
            '3': STRING,
        },
        returnType: STRING,
        appendRight: '('
    },
    'str_repeat': {
        description: 'Repeat a string',
        params: [{
            name: 'input',
            desc: 'The input string',
        }, {
            name: 'multiplier',
            desc: 'Number of time the input string should be repeated.',
        }],
        paramsCount: [
            [2],
        ],
        paramType: {
            '1': STRING,
            '2': NUMBER,
        },
        returnType: STRING,
        appendRight: '('
    },
    'str_replace': {
        description: 'Replace all occurrences of the search string with the replacement string',
        params: [{
            name: 'search',
            desc: 'The value being searched for, otherwise known as the needle. ',
        }, {
            name: 'replace',
            desc: 'The replacement value that replaces found search values.',
        }, {
            name: 'subject',
            desc: 'The string being searched and replaced on, otherwise known as the haystack.',
        },

        ],
        paramsCount: [
            [3],
        ],
        paramType: {
            '1': ANY,
            '2': STRING,
            '3': STRING,
        },
        returnType: STRING,
        appendRight: '('
    },
    'strcasecmp': {
        description: 'Binary safe case-insensitive string comparison',
        params: [{
            name: 'str1',
            desc: 'The first string',
        }, {
            name: 'str2',
            desc: 'The second string',
        } ],
        paramsCount: [
            [2],
        ],
        paramType: {
            '1': STRING,
            '2': STRING,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'strcmp': {
        description: 'Binary safe string comparison',
        params: [{
            name: 'str1',
            desc: 'The first string',
        }, {
            name: 'str2',
            desc: 'The second string',
        } ],
        paramsCount: [
            [2],
        ],
        paramType: {
            '1': STRING,
            '2': STRING,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'strip_tags': {
        description: 'Strip HTML and PHP tags from a string',
        params: [{
            name: 'str',
            desc: 'The input string',
        }, {
            name: 'allowable_tags',
            additionalName: '- [optional]',
            desc: 'You can use the optional second parameter to specify tags which should not be stripped.',
        } ],
        paramsCount: [
            [1, 2],
        ],
        paramType: {
            '1': STRING,
            '2': STRING,
        },
        returnType: STRING,
        appendRight: '('
    },
    'strpos': {
        description: 'Find position of first occurrence of a unicode string (starting by 0, return false if not found)',
        params: [{
            name: 'haystack',
            desc: 'The input string',
        }, {
            name: 'needle',
            desc: 'The search string. Note that the needle may be a string of one or more characters.',
        }, {
            name: 'offset',
            additionalName: '- [optional]',
            desc: 'If specified, search will start this number of characters counted from the beginning of the string. Defaults to 0',
        } ],
        paramsCount: [
            [2, 3],
        ],
        paramType: {
            '1': STRING,
            '2': STRING,
            '3': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'stripos': {
        description: 'Find position of first occurrence of a case-insensitive unicode string (starting by 0, return false if not found)',
        params: [{
            name: 'haystack',
            desc: 'The input string',
        }, {
            name: 'needle',
            desc: 'The search string. Note that the needle may be a string of one or more characters.',
        }, {
            name: 'offset',
            additionalName: '- [optional]',
            desc: 'If specified, search will start this number of characters counted from the beginning of the string. Defaults to 0',
        } ],
        paramsCount: [
            [2, 3],
        ],
        paramType: {
            '1': STRING,
            '2': STRING,
            '3': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'stripslashes': {
        description: 'Un-quotes a quoted string',
        params: [{
            name: 'str',
            desc: 'The input string',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': STRING,
        },
        returnType: STRING,
        appendRight: '('
    },
    'strstr': {
        description: 'Find first occurrence of a string',
        params: [{
            name: 'haystack',
            desc: 'The input string',
        }, {
            name: 'needle',
            desc: 'The search string. Note that the needle may be a string of one or more characters.',
        }, {
            name: 'before_needle',
            additionalName: '- [optional]',
            desc: 'If TRUE, stristr() returns the part of the haystack before the first occurrence of the needle (excluding needle).',
        } ],
        paramsCount: [
            [2, 3],
        ],
        paramType: {
            '1': STRING,
            '2': STRING,
            '3': BOOLEAN,
        },
        returnType: STRING,
        appendRight: '('
    },
    'stristr': {
        description: 'Find first occurrence of a string (case-sensitive)',
        params: [{
            name: 'haystack',
            desc: 'The input string',
        }, {
            name: 'needle',
            desc: 'The search string. Note that the needle may be a string of one or more characters.',
        }, {
            name: 'before_needle',
            additionalName: '- [optional]',
            desc: 'If TRUE, stristr() returns the part of the haystack before the first occurrence of the needle (excluding needle).',
        } ],
        paramsCount: [
            [2, 3],
        ],
        paramType: {
            '1': STRING,
            '2': STRING,
            '3': BOOLEAN,
        },
        returnType: STRING,
        appendRight: '('
    },
    'strlen': {
        description: 'Get string length',
        params: [{
            name: 'str',
            desc: 'The input string',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': STRING,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'strrev': {
        description: 'Reverse a string',
        params: [{
            name: 'str',
            desc: 'The input string',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': STRING,
        },
        returnType: STRING,
        appendRight: '('
    },
    'strtolower': {
        description: 'Make string to lowercase',
        params: [{
            name: 'str',
            desc: 'The input string',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': STRING,
        },
        returnType: STRING,
        appendRight: '('
    },
    'strtotime': {
        description: 'Convert a date/time string to unix timestamp',
        params: [{
            name: 'str',
            desc: 'The input string',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': STRING,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'strtoupper': {
        description: 'Make a string uppercase',
        params: [{
            name: 'str',
            desc: 'The input string',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': STRING,
        },
        returnType: STRING,
        appendRight: '('
    },
    'substr': {
        description: 'Return part of a string',
        params: [{
            name: 'input',
            desc: 'The input string',
        }, {
            name: 'start',
            desc: 'If start is non-negative, the returned string will start at the corresponding position in string, counting from zero.',
        }, {
            name: 'length',
            additionalName: '- [optional]',
            desc: 'If length is given and is positive, the string returned will contain at most length characters beginning from start (depending on the length of string).<br/><br/>If length is given and is negative, then that many characters will be omitted from the end of string',
        } ],
        paramsCount: [
            [2, 3],
        ],
        paramType: {
            '1': STRING,
            '2': NUMBER,
            '3': NUMBER,
        },
        returnType: STRING,
        appendRight: '('
    },
    'sum': {
        params: [{
            name: 'arg1',
            desc: 'First number or array of numbers to add together',
        }, {
            name: '[arg2,...]',
            additionalName: ' - [optional] repeatable',
            desc: 'Additional numbers to add',
        }],
        description: 'Returns the sum of a series of numbers',
        paramsCount: [
            [2],
            ['n'],
        ],
        paramType: {
            '1': NUMBER,
            '2': NUMBER,
            'n': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'sumifop': {
        description: 'Sum the values of answered questions in the list which pass the criteria (arg op value)',
        params: [{
            name: 'operator',
            desc: 'Comparison operator (\'==\', \'!=\', \'>\', \'>=\', \'<\', \'<=\')',
        }, {
            name: 'value',
            desc: 'Value that the list need to match against',
        }, {
            name: 'arg1',
            desc: 'First number or array of numbers to consider when counting',
        }, {
            name: '[arg2,...]',
            additionalName: ' - [optional] repeatable',
            desc: 'Additional numbers to consider when counting',
        },

        ],
        paramsCount: [
            [3],
            ['n'],
        ],
        paramType: {
            '1': STRING,
            '2': ANY,
            '3': ANY,
            'n': ANY,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'tan' : {
        description: 'Returns the tangent of a number',
        params: [{
            name: 'number',
            desc: 'The value to be converted.',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': NUMBER,
        },
        returnType: NUMBER,
        appendRight: '('
    },
    'time': {
        description: 'Return current UNIX timestamp',
        params: [],
        paramsCount: [
            [0],
        ],
        paramType: {},
        returnType: NUMBER,
        appendRight: '('
    },
    'trim': {
        description: 'Strip whitespace (or other characters) from the beginning and end of a string',
        params: [{
            name: 'string',
            desc: 'The input string',
        }, {
            name: 'charlist',
            additionalName: ' - [optional]',
            desc: 'Specify the characters you want to strip. Simply list all characters that you want to be stripped. With .. you can specify a range of characters.',
        }],
        paramsCount: [
            [1, 2],
        ],
        paramType: {
            '1': STRING,
            '2': STRING,
        },
        returnType: STRING,
        appendRight: '('
    },
    'ucwords': {
        description: 'Uppercase the first character of each word in a string',
        params: [{
            name: 'str',
            desc: 'The input string',
        }],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': STRING,
        },
        returnType: STRING,
        appendRight: '('
    },
    'unique': {
        description: 'Returns true if all non-empty responses are unique',
        params: [{
            name: 'arg1',
            desc: 'First value or array of values to be checked',
        }, {
            name: '[arg2,...]',
            additionalName: ' - [optional] repeatable',
            desc: 'Additional values to be checked',
        }],
        paramsCount: [
            [1],
            ['n'],
        ],
        paramType: {
            '1': ANY,
            'n': ANY,
        },
        returnType: BOOLEAN,
        appendRight: '('
    },
};


export const ADV_QUOTA_EXP_FUNS = {
    'COUNT': {
        description: 'count the number of completes for advanced quota',
        params: [{
            name: 'Response/Field Name',
            desc: 'The criteria based on which the completes are calculated',
        }
        ],
        paramsCount: [
            [1],
        ],
        paramType: {
            '1': ANY,
        },
        returnType: NUMBER,
        appendRight: '('
    }
        
};

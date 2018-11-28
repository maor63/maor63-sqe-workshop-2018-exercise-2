
let evalFunctions = {
    MemberExpression: evalMemberExpression,
    Literal: evalLiteral,
    CallExpression: evalCallExpression,
    BinaryExpression: evalBinaryExpression,
    Identifier: evalIdentifier,
    UnaryExpression: evalUnaryExpression,
    LogicalExpression: evalBinaryExpression,
    UpdateExpression: evalUpdateExpression,
    ArrayExpression: evalArrayExpression,
    AssignmentExpression: parseAssignmentExpression,

};

function evalMemberExpression(expression) {
    let member = evalExpression(expression.object);
    let property = evalExpression(expression.property);
    return member + '[' + property + ']';
}

function evalLiteral(expression) {
    return expression.raw;
}

function evalElementList(elements) {
    let args = [];
    for (let i = 0; i < elements.length; i++) {
        args.push(evalExpression(elements[i]));
    }
    return args;
}

function evalCallExpression(expression) {
    let callee = evalExpression(expression.callee);
    let args = evalElementList(expression.arguments);
    return callee + '({})'.format(args.join(','));
}

function evalArrayExpression(expression) {
    let args = evalElementList(expression.elements);
    return '[{}]'.format(args.join(','));
}

function formatExpressionForBinary(expression) {
    if (expression.split(' ').length > 1)
        expression = '({})'.format(expression);
    return expression;
}

function evalBinaryExpression(expression, varMap) {
    let left = evalExpression(expression.left, varMap, true);
    let right = evalExpression(expression.right, varMap, true);
    if (right === '0')
        return left;
    else if(left === '0')
        return right;
    if (expression.operator !== '+') {
        left = formatExpressionForBinary(left);
        right = formatExpressionForBinary(right);
    }
    return '{} {} {}'.format(left, expression.operator, right);
}

function parseAssignmentExpression(parsedCode, varMap) {

    let left = evalExpression(parsedCode.left, {});
    let right = evalExpression(parsedCode.right, varMap);
    // console.log("left: " + left + " right: " + right);
    varMap[left] = right;
    // console.log('parse if condition:' + JSON.stringify(varMap));
    return '{} {} {}'.format(left, parsedCode.operator, right);
}

function evalIdentifier(expression, varMap = {}) {
    // console.log('parse if condition:' + JSON.stringify(varMap));
    if (expression.name in varMap) {
        expression.name = varMap[expression.name];
    }
    return expression.name;
}

function evalUnaryExpression(expression) {
    return '{}{}'.format(expression.operator, evalExpression(expression.argument));
}

function evalUpdateExpression(expression) {
    return '{}{}'.format(evalExpression(expression.argument), expression.operator);
}

export function evalExpression(expression, varMap, inBinaryExpression = false) {
    if (expression !== null && expression.type in evalFunctions)
        return evalFunctions[expression.type](expression, varMap, inBinaryExpression);
    else
        return '';
}
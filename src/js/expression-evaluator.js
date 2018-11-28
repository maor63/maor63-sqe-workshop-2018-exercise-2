
let evalFunctions = {
    MemberExpression: evalMemberExpression,
    Literal: evalLiteral,
    BinaryExpression: evalBinaryExpression,
    Identifier: evalIdentifier,
    LogicalExpression: evalBinaryExpression,
    ArrayExpression: evalArrayExpression,
    AssignmentExpression: parseAssignmentExpression,

};

function isArrayVar(member) {
    return member.indexOf('[') !== -1;
}

function evalMemberExpression(expression, varMap) {
    let member = evalExpression(expression.object, varMap);
    let property = evalExpression(expression.property, varMap);
    if(isArrayVar(member)) {
        let array = eval(member);
        return '{}'.format(array[property]);
    }
    else
        return member + '[' + property + ']';
}

function evalLiteral(expression) {
    return expression.raw;
}

function evalElementList(elements, varMap) {
    let args = [];
    for (let i = 0; i < elements.length; i++) {
        args.push(evalExpression(elements[i], varMap));
    }
    return args;
}

function evalArrayExpression(expression, varMap) {
    let args = evalElementList(expression.elements, varMap);
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
    if(isArrayVar(left)){
        let arrayVar = left.split('[')[0];
        let index = left.split('[')[1].split(']')[0];
        if(arrayVar in varMap) {
            let array = eval(varMap[arrayVar]);
            array[index] = eval(right);
            left = arrayVar;
            right = '[{}]'.format(array);
        }
    }
    varMap[left] = right;
    return '{} {} {}'.format(left, parsedCode.operator, right);
}

function evalIdentifier(expression, varMap = {}) {
    if (expression.name in varMap)
        expression.name = varMap[expression.name];
    return expression.name;
}

export function evalExpression(expression, varMap) {
    if (expression !== null && expression.type in evalFunctions)
        return evalFunctions[expression.type](expression, varMap);
    else
        return '';
}
import {evalExpression} from './expression-evaluator';
import {convertStringToParsedCode} from './code-analyzer';

let parseFunctions = {
    BlockStatement: parseBlockStatement,
    Program: parseBlockStatement,
    VariableDeclaration: parseVariableDeclaration,
    VariableDeclarator: parseVariableDeclarator,
    ExpressionStatement: parseExpressionStatement,
    FunctionDeclaration: parseFunctionDeclaration,
    WhileStatement: parseWhileStatement,
    IfStatement: parseIfStatement,
    ReturnStatement: parseReturnStatement,
};

function parseVariableDeclaration(parsedCode, varMap) {
    parsedCode.declarations = parseStatementList(parsedCode.declarations, varMap);
    return null;
}

function parseVariableDeclarator(parsedCode, varMap) {
    // let index = parsedCode.loc.start.line;
    let name = evalExpression(parsedCode.id, varMap);
    let value = evalExpression(parsedCode.init, varMap);
    if(value !== '')
        varMap[name] = value;
    return parsedCode;
}

function parseExpressionStatement(parsedCode, varMap, inputVector) {
    let codeString = evalExpression(parsedCode.expression, varMap, inputVector);
    let tokens = codeString.split(' ');
    if (tokens.length > 1 && tokens[0] in inputVector)
        parsedCode.expression = convertStringToParsedCode(codeString);
    else
        parsedCode.expression = undefined;
    return parsedCode;
}

function parseFunctionDeclaration(parsedCode, varMap, inputVector) {
    // for (let i = 0; i < parsedCode.params.length; i++) {
    //     let param = evalExpression(parsedCode.params[i]);
    //     varMap[param] = param;
    // }
    parsedCode.body = parseStatement(parsedCode.body, varMap, inputVector);
    return parsedCode;
}

function parseBlockStatement(parsedCode, varMap, inputVector) {
    let varMapCopy = JSON.parse(JSON.stringify(varMap));
    parsedCode.body = parseStatementList(parsedCode.body, varMapCopy, inputVector);
    // console.log('input vector:' + JSON.stringify(inputVector));
    // for (let v in inputVector) {
    //     if (v in varMapCopy) {
    //         varMap[v] = varMapCopy[v];
    //     }
    // }
    return parsedCode;
}

function notLocal(statement) {
    if (statement.type === 'VariableDeclaration')
        return false;
    if (statement.type === 'ExpressionStatement' && statement.expression === undefined) {
        console.log('good expression');
        return false;
    }
    return true;
}

function parseStatementList(statementList, varMap, inputVector) {
    let filteredStatements = [];
    for (let i = 0; i < statementList.length; i++) {
        statementList[i] = parseStatement(statementList[i], varMap, inputVector);
        if (statementList[i] !== null && notLocal(statementList[i]))
            filteredStatements.push(statementList[i]);
    }
    return filteredStatements;
}

function parseWhileStatement(parsedCode, varMap, inputVector) {
    parsedCode.test = convertStringToParsedCode(evalExpression(parsedCode.test, varMap));
    parsedCode.body = parseStatement(parsedCode.body, varMap, inputVector);
    return parsedCode;
}

function parseIfStatement(parsedCode, varMap, inputVector) {
    // let index = parsedCode.loc.start.line;
    let condition = evalExpression(parsedCode.test, varMap, false);
    parsedCode.test = convertStringToParsedCode(condition);

    // let outputRows = '';
    parsedCode.consequent = parseStatement(parsedCode.consequent, varMap, inputVector);
    parsedCode.alternate = parseStatement(parsedCode.alternate, varMap, inputVector);
    return parsedCode;
}

function parseReturnStatement(parsedCode, varMap, inputVector) {
    parsedCode.argument = convertStringToParsedCode(evalExpression(parsedCode.argument, varMap, inputVector));
    return parsedCode;
}

export function parseStatement(parsedCode, varMap, inputVector) {
    if (parsedCode !== null && parsedCode.type in parseFunctions) {
        parsedCode = parseFunctions[parsedCode.type](parsedCode, varMap, inputVector);
        return parsedCode;
    }
    else
        return parsedCode;
}

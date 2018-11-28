import {evalExpression} from './expression-evaluator';
import {convertStringToParsedCode} from './code-analyzer';
import $ from 'jquery';

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
    varMap[name] = value;
    return parsedCode;
}

function parseExpressionStatement(parsedCode, varMap) {
    // let index = parsedCode.loc.start.line;
    // let outputRows = '';
    // if (inIfStatement)
    //     outputRows += createTableRow(parsedCode.loc.start.line - 1, 'else statement', '', '', '');
    parsedCode.expression = convertStringToParsedCode(evalExpression(parsedCode.expression, varMap));
    return parsedCode;
}

function parseFunctionDeclaration(parsedCode, varMap) {
    // for (let i = 0; i < parsedCode.params.length; i++) {
    //     parsedCode.params[i] = evalExpression(parsedCode.params[i]);
    // }
    parsedCode.body = parseStatement(parsedCode.body, varMap);
    return parsedCode;
}

function parseBlockStatement(parsedCode, varMap) {
    let VarMapCopy = JSON.parse(JSON.stringify(varMap));
    parsedCode.body = parseStatementList(parsedCode.body, VarMapCopy);
    return parsedCode;
}

function notLocal(statement) {
    return statement.type !== 'VariableDeclaration' && statement.type !== 'ExpressionStatement';
}

function parseStatementList(statementList, varMap) {
    let filteredStatemets = [];
    for (let i = 0; i < statementList.length; i++) {
        statementList[i] = parseStatement(statementList[i], varMap);
        if (statementList[i] !== null && notLocal(statementList[i]))
            filteredStatemets.push(statementList[i]);
    }
    return filteredStatemets;
}

function parseWhileStatement(parsedCode, varMap) {
    parsedCode.test = convertStringToParsedCode(evalExpression(parsedCode.test, varMap));
    parsedCode.body = parseStatement(parsedCode.body, varMap);
    return parsedCode;
}

function parseIfStatement(parsedCode, varMap) {
    // let index = parsedCode.loc.start.line;
    let condition = evalExpression(parsedCode.test, varMap, false);
    parsedCode.test = convertStringToParsedCode(condition);

    // let outputRows = '';
    parsedCode.consequent = parseStatement(parsedCode.consequent, varMap);
    parsedCode.alternate = parseStatement(parsedCode.alternate, varMap);
    return parsedCode;
}

function parseReturnStatement(parsedCode, varMap) {
    parsedCode.argument = convertStringToParsedCode(evalExpression(parsedCode.argument, varMap));
    return parsedCode;
}

export function parseStatement(parsedCode, varMap) {
    if (parsedCode !== null && parsedCode.type in parseFunctions) {
        parsedCode = parseFunctions[parsedCode.type](parsedCode, varMap);
        return parsedCode;
    }
    else
        return parsedCode;
}

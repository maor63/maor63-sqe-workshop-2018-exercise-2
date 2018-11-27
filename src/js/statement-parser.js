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
    BreakStatement: parseBreakStatement,
    ContinueStatement: parseContinueStatement,
};

function parseVariableDeclaration(parsedCode, varMap) {
    parsedCode.declarations = parseStatementList(parsedCode.declarations, varMap);
    return null;
}

function parseVariableDeclarator(parsedCode, varMap) {
    // let index = parsedCode.loc.start.line;
    let name = evalExpression(parsedCode.id);
    let value = evalExpression(parsedCode.init);
    varMap[name] = value;
    return parsedCode;
}

function parseExpressionStatement(parsedCode, inIfStatement) {
    let index = parsedCode.loc.start.line;
    let outputRows = '';
    if (inIfStatement)
        outputRows += createTableRow(parsedCode.loc.start.line - 1, 'else statement', '', '', '');
    return outputRows + createTableRow(index, convertTypeToName(parsedCode.expression.type), '', '', evalExpression(parsedCode.expression));
}

function parseFunctionDeclaration(parsedCode, varMap) {
    // for (let i = 0; i < parsedCode.params.length; i++) {
    //     parsedCode.params[i] = evalExpression(parsedCode.params[i]);
    // }
    parsedCode.body = parseStatement(parsedCode.body, varMap);
    return parsedCode;
}

function parseBlockStatement(parsedCode, varMap) {
    parsedCode.body = parseStatementList(parsedCode.body, varMap);
    return parsedCode;
}

function parseStatementList(statementList, varMap) {
    let filteredStatemets = [];
    for (let i = 0; i < statementList.length; i++) {
        statementList[i] = parseStatement(statementList[i], varMap);
        if (statementList[i] !== null && statementList[i].type !== 'VariableDeclaration')
            filteredStatemets.push(statementList[i]);
    }
    return filteredStatemets;
}

function baseLoopParse(parsedCode, varMap) {
    // let index = parsedCode.loc.start.line;
    // let outputRows = createTableRow(index, convertTypeToName(parsedCode.type), '', condition, '');
    parsedCode.body = parseStatement(parsedCode.body, varMap);
    return parsedCode;
}

function parseWhileStatement(parsedCode, varMap) {
    // parsedCode.test = evalExpression(parsedCode.test, varMap);
    parsedCode = baseLoopParse(parsedCode, varMap);
    return parsedCode;
}

function parseIfStatement(parsedCode, varMap) {
    // let index = parsedCode.loc.start.line;
    let condition = evalExpression(parsedCode.test, varMap, false);
    parsedCode.test = convertStringToParsedCode(condition);
    console.log('parse if condition:' + condition);
    // let outputRows = '';
    parsedCode.consequent = parseStatement(parsedCode.consequent, varMap);
    parsedCode.alternate = parseStatement(parsedCode.alternate, varMap);
    return parsedCode;
}

function parseReturnStatement(parsedCode) {
    // let index = parsedCode.loc.start.line;
    // let value = evalExpression(parsedCode.argument);
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

function parseBreakStatement(parsedCode) {
    // let index = parsedCode.loc.start.line;
    return parsedCode;
}

function parseContinueStatement(parsedCode) {
    let index = parsedCode.loc.start.line;
    return createTableRow(index, 'continue statement', '', '', '');
}
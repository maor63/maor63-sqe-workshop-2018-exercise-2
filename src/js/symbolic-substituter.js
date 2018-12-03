import {convertStringToParsedCode, evalCode, parseCode} from './code-analyzer';
import {substituteStatement} from './statement-substituter';
import {evalExpression} from './expression-evaluator';

function substitute_symbols(inputCode, inputVector = {}) {
    let parsed = parseCode(inputCode);
    substituteStatement(parsed, {}, inputVector);
    return evalCode(parsed);
}

export function evaluate_code_conditions(inputCode, inputVector = {}) {
    let parsed = parseCode(inputCode);
    let conditions = [];
    let varMap = {};
    substituteStatement(parsed, varMap, inputVector, conditions);
    let res = [];
    let inputAndGlobalMap = Object.assign(inputVector, varMap);
    for (let i = 0; i < conditions.length; i++) {
        let conditionString = evalExpression(convertStringToParsedCode(conditions[i][0]), inputAndGlobalMap);
        res.push([eval(conditionString), conditions[i][1]]);
    }
    return res;
}

export function parse_arguments(argumentsString) {
    let inputVector = {};
    let startArray = argumentsString.indexOf('[');
    let endOfArg = argumentsString.indexOf(',');
    while(endOfArg !== -1){
        if(!(endOfArg < startArray || startArray === -1)){
            let endArray = argumentsString.indexOf(']', startArray);
            endOfArg = endArray + 1;
        }
        let arg = argumentsString.slice(0, endOfArg).trim();
        let argParts = arg.split('=');
        inputVector[argParts[0].trim()] = eval(argParts[1]);
        argumentsString = argumentsString.slice(endOfArg + 1);
        startArray = argumentsString.indexOf('[');
        endOfArg = argumentsString.indexOf(',');
    }
    let argParts = argumentsString.split('=');
    inputVector[argParts[0].trim()] = eval(argParts[1]);
    return inputVector;
}

function isPredicate(parsedCodeLine) {
    return parsedCodeLine.includes('if') || parsedCodeLine.includes('while') || parsedCodeLine.includes('else');
}

export function markPredicates(parsedCodeLines, markRows) {
    for (let i = 0, markRowIndex = 0; i < parsedCodeLines.length; i++) {
        if (isPredicate(parsedCodeLines[i])) {
            let color = markRows[markRowIndex][0] ? 'green' : 'red';
            parsedCodeLines[i] = '<mark class="{}">{}</mark>'.format(color, parsedCodeLines[i]);
            markRowIndex++;
        }
    }
}

export {substitute_symbols};
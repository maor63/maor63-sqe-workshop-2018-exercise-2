import {evalCode, parseCode} from './code-analyzer';
import {substituteStatement} from './statement-substituter';
import {evalExpression} from './expression-evaluator';
import {convertStringToParsedCode} from './code-analyzer';

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
    for(let i = 0; i < conditions.length; i++){
        let inputAndGlobalMap = Object.assign(inputVector, varMap);
        let conditionString = evalExpression(convertStringToParsedCode(conditions[i][0]), inputAndGlobalMap);
        res.push([eval(conditionString), conditions[i][1]]);
    }
    return res;
}



export {substitute_symbols};
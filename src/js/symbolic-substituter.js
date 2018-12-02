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
    substituteStatement(parsed, {}, inputVector, conditions);
    let res = [];
    // console.log('input vector'+ JSON.stringify(inputVector));
    for(let i =0; i < conditions.length; i++){
        // console.log(conditions[i][0]);
        console.log(evalExpression(convertStringToParsedCode(conditions[i][0]), inputVector));
        let conditionString = evalExpression(convertStringToParsedCode(conditions[i][0]), inputVector);
        res.push([eval(conditionString), conditions[i][1]]);
    }
    return res;
}



export {substitute_symbols};
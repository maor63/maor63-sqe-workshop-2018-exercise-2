import {evalCode, parseCode} from './code-analyzer';
import {parseStatement} from './statement-parser';

function substitute_symbols(inputCode, inputVector = {}) {
    var parsed = parseCode(inputCode);
    parsed = parseStatement(parsed, {}, inputVector);
    return evalCode(parsed);
}



export {substitute_symbols};
import {evalCode, parseCode} from './code-analyzer';
import {parseStatement} from './statement-parser';

function substitute_symbols(inputCode, inputVector={}) {
    var parsed = parseCode(inputCode);
    parsed = parseStatement(parsed, inputVector);
    return evalCode(parsed);
}

String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] !== 'undefined' ? args[i++] : '';
    });
};

export {substitute_symbols};
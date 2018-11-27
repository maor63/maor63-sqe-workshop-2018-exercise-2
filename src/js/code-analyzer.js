import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

function parseCode(codeToParse){
    return esprima.parseScript(codeToParse);
}

function evalCode (codeToEval){
    return escodegen.generate(codeToEval);
}

function convertStringToParsedCode(codeString) {
    let parsed = parseCode(codeString);
    return parsed.body[0].expression;
}

export {parseCode, evalCode, convertStringToParsedCode};

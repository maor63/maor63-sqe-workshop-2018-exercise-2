import $ from 'jquery';
import {substitute_symbols, evaluate_code_conditions,parse_arguments} from './symbolic-substituter';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let inputArgs = $('#inputVector').val();
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = substitute_symbols(codeToParse);
        let inputVector = parse_arguments(inputArgs);
        let markRows = evaluate_code_conditions(codeToParse, inputVector);
        let parsedCodeLines = parsedCode.split('\n');
        let markRowIndex = 0;
        for(let i = 0; i < parsedCodeLines.length; i++){
            if(parsedCodeLines[i].includes('if') || parsedCodeLines[i].includes('while')|| parsedCodeLines[i].includes('else')){
                if(markRows[markRowIndex][0]) {
                    parsedCodeLines[i] = '<mark class="green">{}</mark>'.format(parsedCodeLines[i]);
                }
                else
                    parsedCodeLines[i] = '<mark class="red">{}</mark>'.format(parsedCodeLines[i]);
                markRowIndex++;
            }
        }
        $('#codeParseResults').html('<div><p>{}</p></div>'.format(parsedCodeLines.join('<p></p>')));
    });
});

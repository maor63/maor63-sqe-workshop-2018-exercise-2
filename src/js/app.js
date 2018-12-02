import $ from 'jquery';
import {substitute_symbols, evaluate_code_conditions} from './symbolic-substituter';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = substitute_symbols(codeToParse);
        let markRows = evaluate_code_conditions(codeToParse, {x:1, y:3, z:4});
        let parsedCodeLines = parsedCode.split('\n');
        let markRowIndex = 0;
        for(let i = 0; i < parsedCodeLines.length; i++){
            if(parsedCodeLines[i].includes('if') || parsedCodeLines[i].includes('while')){
                if(markRows[markRowIndex]) {
                    parsedCodeLines[i] = '<mark class="green">{}</mark>'.format(parsedCodeLines[i]);
                }
                else
                    parsedCodeLines[i] = '<mark class="red">{}</mark>'.format(parsedCodeLines[i]);
            }
        }
        $('#codeParseResults').html('<div><p>{}</p></div>'.format(parsedCodeLines.join('<p></p>')));
    });
});

import $ from 'jquery';
import {evaluate_code_conditions, markPredicates, parse_arguments, substitute_symbols} from './symbolic-substituter';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let inputArgs = $('#inputVector').val();
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = substitute_symbols(codeToParse);
        let inputVector = parse_arguments(inputArgs);
        let markRows = evaluate_code_conditions(codeToParse, inputVector);
        let parsedCodeLines = parsedCode.split('\n');
        markPredicates(parsedCodeLines, markRows);
        $('#codeParseResults').html('<div><p>{}</p></div>'.format(parsedCodeLines.join('<p></p>')));
    });
});

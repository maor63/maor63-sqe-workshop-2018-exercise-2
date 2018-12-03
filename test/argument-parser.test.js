import assert from 'assert';
import {parse_arguments, markPredicates, evaluate_code_conditions} from '../src/js/symbolic-substituter';

describe('The argument parser tests', () => {
    it('is parse empty argument string', () => {
        assert.equal(
            JSON.stringify(parse_arguments(
                ''
            )),
            JSON.stringify({})
        );
    });

    it('is parse int argument', () => {
        assert.equal(
            JSON.stringify(parse_arguments(
                'x=1'
            )),
            JSON.stringify({x: 1})
        );
    });

    it('is parse string argument', () => {
        assert.equal(
            JSON.stringify(parse_arguments(
                'x=\'hi\''
            )),
            JSON.stringify({x: 'hi'})
        );
    });

    it('is parse float argument', () => {
        assert.equal(
            JSON.stringify(parse_arguments(
                'x=0.1'
            )),
            JSON.stringify({x: 0.1})
        );
    });

    it('is parse array argument', () => {
        assert.equal(
            JSON.stringify(parse_arguments(
                'x=[1,3,2]'
            )),
            JSON.stringify({x: [1, 3, 2]})
        );
    });

    it('is parse multiple arguments', () => {
        assert.equal(
            JSON.stringify(parse_arguments(
                'x=[1,3,2], y=\'hi\', z=0.4'
            )),
            JSON.stringify({x: [1, 3, 2], y: 'hi', z: 0.4})
        );
    });

    it('mark predicates correctly', () => {
        let codeToParse = `function foo(x, y, z){
                                if (x + 1 + y < z) {                
                                    return x + y + z + 5;
                                } else if (x + 1 + y < z * 2) {     
                                    return x + y + z + x + 5; 
                                } else {
                                    return x + y + z + z + 5;
                                }
                            }
                            `;
        let markRows = evaluate_code_conditions(codeToParse, {x: 1, y: 2, z: 3});
        let parsedCodeLines = codeToParse.split('\n');
        markPredicates(parsedCodeLines, markRows);
        assert.equal(JSON.stringify(parsedCodeLines),
            JSON.stringify([
                'function foo(x, y, z){',
                '<mark class="red">                                if (x + 1 + y < z) {                </mark>',
                '                                    return x + y + z + 5;',
                '<mark class="green">                                } else if (x + 1 + y < z * 2) {     </mark>',
                '                                    return x + y + z + x + 5; ',
                '<mark class="red">                                } else {</mark>',
                '                                    return x + y + z + z + 5;',
                '                                }',
                '                            }',
                '                            '
            ]));
    });
});
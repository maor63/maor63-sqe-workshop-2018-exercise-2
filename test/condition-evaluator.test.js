import assert from 'assert';
import {evaluate_code_conditions, substitute_symbols} from '../src/js/symbolic-substituter';
import {evalCode, parseCode} from '../src/js/code-analyzer';

describe('The condition evaluator tests', () => {
    it('is eval 1 true if condition', () => {
        assert.equal(
            JSON.stringify(evaluate_code_conditions(
                `function foo(a){
                    if(3 > 2){}
                }`
            )),
            JSON.stringify([[true, 2]])
        );
    });
    it('is eval 1 false if condition', () => {
        assert.equal(
            JSON.stringify(evaluate_code_conditions(
                `function foo(a){
                    if(3 < 2){}
                }`
            )),
            JSON.stringify([[false, 2]])
        );
    });

    it('is eval 1 false if condition with input vector', () => {
        assert.equal(
            JSON.stringify(evaluate_code_conditions(
                `function foo(a){
                    if(a < 2){}
                }`
                , {a: 3})),
            JSON.stringify([[false, 2]])
        );
    });

    it('is eval 1 false if condition with input vector', () => {
        assert.equal(
            JSON.stringify(evaluate_code_conditions(
                `function foo(a){
                    if(a > 2){}
                }`
                , {a: 3})),
            JSON.stringify([[true, 2]])
        );
    });

    it('is eval 2 true and 1 false if condition with input vector', () => {
        assert.equal(
            JSON.stringify(evaluate_code_conditions(
                `function foo(a){
                    if(a > 2){}
                    if(a < 2) {}
                    if(a == 3){}
                }`
                , {a: 3})),
            JSON.stringify([[true, 2], [false, 3], [true, 4]])
        );
    });

    it('is eval if with else condition with input vector', () => {
        assert.equal(
            JSON.stringify(evaluate_code_conditions(
                `function foo(a){
                    if(a > 2){}
                    else{}
                }`
                , {a: 3})),
            JSON.stringify([[true, 2], [false, 3]])
        );
    });

    it('is eval if with else and else if condition with input vector', () => {
        assert.equal(
            JSON.stringify(evaluate_code_conditions(
                `function foo(a){
                    if(a > 2){}
                    else if(a== 2){}
                    else {}
                }`
                , {a: 1})),
            JSON.stringify([[false, 2], [false, 3], [true, 4]])
        );
    });

    it('is eval while with with input vector', () => {
        assert.equal(
            JSON.stringify(evaluate_code_conditions(
                `function foo(a){
                    while(a > 2){}
                }`
                , {a: 1})),
            JSON.stringify([[false, 2]])
        );
    });

    it('is eval while with with input vector of global var', () => {
        assert.equal(
            JSON.stringify(evaluate_code_conditions(
                `let a = 1;
                function foo(){
                    while(a > 2){}
                }`
                , {})),
            JSON.stringify([[false, 3]])
        );
    });

    it('is eval while with with input vector of global array var', () => {
        assert.equal(
            JSON.stringify(evaluate_code_conditions(
                `let a = [1];
                function foo(){
                    while(a[0] > 2){}
                }`
                , {})),
            JSON.stringify([[false, 3]])
        );
    });

    it('is parse very complicated', () => {
        assert.equal(
            JSON.stringify(evaluate_code_conditions(`
            function foo(x, y, z){
                let a = x + 1;
                let b = a + y;
                let c = 0;
                
                if (b < z) { 
                    c = c + 5;
                    return x + y + z + c;
                } else if (b < z * 2) { 
                    c = c + x + 5;
                    return x + y + z + c;
                } else { 
                    c = c + z + 5;
                    return x + y + z + c;
                }
            }
            `, {x: 1, y: 2, z: 3})),
            JSON.stringify([[false,7],[true,10],[false,13]])
        );
    });
});


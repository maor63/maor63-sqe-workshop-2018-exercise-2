import assert from 'assert';
import {substitute_symbols, evaluate_code_conditions} from '../src/js/symbolic-substituter';
import {evalCode, parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
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
                ,{a: 3})),
            JSON.stringify([[false, 2]])
        );
    });

    it('is eval 1 false if condition with input vector', () => {
        assert.equal(
            JSON.stringify(evaluate_code_conditions(
                `function foo(a){
                    if(a > 2){}
                }`
                ,{a: 3})),
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
                ,{a: 3})),
            JSON.stringify([[true, 2],[false, 3],[true, 4]])
        );
    });

    it('is eval if with else condition with input vector', () => {
        assert.equal(
            JSON.stringify(evaluate_code_conditions(
                `function foo(a){
                    if(a > 2){}
                    else{}
                }`
                ,{a: 3})),
            JSON.stringify([[true, 2],[false, 3]])
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
                ,{a: 1})),
            JSON.stringify([[false, 2],[false, 3],[true, 4]])
        );
    });

    it('is eval while with with input vector', () => {
        assert.equal(
            JSON.stringify(evaluate_code_conditions(
                `function foo(a){
                    while(a > 2){}
                }`
                ,{a: 1})),
            JSON.stringify([[false, 2]])
        );
    });
});
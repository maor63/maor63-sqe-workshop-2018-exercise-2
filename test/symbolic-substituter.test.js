import assert from 'assert';
import {substitute_symbols} from '../src/js/symbolic-substituter';
import {parseCode, evalCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is not delete rows if no local vars defined', () => {
        assert.equal(
            substitute_symbols(
                `function foo(a){
            }`
            ),
            evalCode(parseCode(`function foo(a){
            }`))
        );
    });

    it('is delete 1 row of local var', () => {
        assert.equal(
            substitute_symbols(`
            function foo(a){
                let b = 0;
            }
            `),
            evalCode(parseCode(`
            function foo(a){
            }
            `))
        );
    });

    it('is delete 3 row of local var', () => {
        assert.equal(
            substitute_symbols(`
            function foo(a){
                let b = 0;
                let c = 0;
                let d = 0;
            }
            `),
            evalCode(parseCode(`
            function foo(a){
            }
            `))
        );
    });

    it('is delete 3 row of local var with if statement', () => {
        assert.equal(
            substitute_symbols(`
            function foo(a){
                let b = 0;
                let c = 0;
                let d = 0;
                if(1 > 2){}
            }
            `),
            evalCode(parseCode(`
            function foo(a){
            if(1 > 2){}
            }
            `))
        );
    });
    it('is delete 3 row of local var with if statement and return', () => {
        assert.equal(
            substitute_symbols(`
            function foo(a){
                let b = 0;
                let c = 0;
                let d = 0;
                if(1 > 2){
                return 1;}
            }
            `),
            evalCode(parseCode(`
            function foo(a){
            if(1 > 2){
                return 1;}
            }
            `))
        );
    });
    it('is delete 3 row of local var with while statement', () => {
        assert.equal(
            substitute_symbols(`
            function foo(a){
                let b = 0;
                let c = 0;
                let d = 0;
                while(1 > 2){
                }
            }
            `),
            evalCode(parseCode(`
            function foo(a){
            while(1 > 2){
                }
            }
            `))
        );
    });
    it('is delete 3 row of local var with while statement and break', () => {
        assert.equal(
            substitute_symbols(`
            function foo(a){
                let b = 0;
                let c = 0;
                let d = 0;
                while(1 > 2){
                break;
                }
            }
            `),
            evalCode(parseCode(`
            function foo(a){
            while(1 > 2){
            break;
                }
            }
            `))
        );
    });

    it('is delete 3 row of local var with if statement and substitute 1 var', () => {
        assert.equal(
            substitute_symbols(`
            function foo(a){
                let b = 1;
                let c = 0;
                let d = 0;
                if(b > 2){}
            }
            `),
            evalCode(parseCode(`
            function foo(a){
            if(1 > 2){}
            }
            `))
        );
    });

    it('is delete 3 row of local var with if statement and substitute 1 var unsing input vector', () => {
        assert.equal(
            substitute_symbols(`
            function foo(a){
                let b = a;
                let c = 0;
                let d = 0;
                if(b > 2){}
            }
            `, {a: 1}),
            evalCode(parseCode(`
            function foo(a){
            if(1 > 2){}
            }
            `))
        );
    });
    it('is delete 3 row of local var with if statement and substitute 1 var unsing input vector 3 swaps', () => {
        assert.equal(
            substitute_symbols(`
            function foo(a){
                let b = a;
                let c = b;
                let d = c;
                if(d > 2){}
            }
            `),
            evalCode(parseCode(`
            function foo(a){
            if(a > 2){}
            }
            `))
        );
    });
});
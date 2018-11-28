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

    it('is delete 1 row of local var and 1 of assignment', () => {
        assert.equal(
            substitute_symbols(`
            function foo(a){
                let b = 2;
                b = b + 2;
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

    it('is delete 3 row of local var with if statement and substitute 1 var unsing input vector 3 swaps one not trivial', () => {
        assert.equal(
            substitute_symbols(`
            function foo(a){
                let b = a;
                let c = b + 1;
                let d = c;
                if(d > 2){}
            }
            `),
            evalCode(parseCode(`
            function foo(a){
            if(a + 1 > 2){}
            }
            `))
        );
    });

    it('is delete 3 row of local var with if statement and substitute 1 var unsing input vector 2 swaps and assignment', () => {
        assert.equal(
            substitute_symbols(`
            function foo(a){
                let b = a;
                let c = b + 1;
                c = c + 3;
                if(c > 2){}
            }
            `),
            evalCode(parseCode(`
            function foo(a){
            if(a + 1 + 3> 2){}
            }
            `))
        );
    });

    it('is parse correctly while', () => {
        assert.equal(
            substitute_symbols(`
            function foo(a){
                let b = a;
                let c = b + 1;
                c = c + 3;
                while(c > 2){}
            }
            `),
            evalCode(parseCode(`
            function foo(a){
            while(a + 1 + 3> 2){}
            }
            `))
        );
    });

    it('is parse correctly while with return', () => {
        assert.equal(
            substitute_symbols(`
            function foo(a){
                let b = a;
                let c = b + 1;
                c = c + 3;
                while(c > 2){}
                return b;
            }
            `),
            evalCode(parseCode(`
            function foo(a){
            while(a + 1 + 3> 2){}
            return a;
            }
            `))
        );
    });

    it('is parse complicated example 1 if', () => {
        assert.equal(
            substitute_symbols(`
            function foo(x, y, z){
                let a = x + 1;
                let b = a + y;
                let c = 0;
                
                if (b < z) {
                    c = c + 5;
                    return x + y + z + c;
                } 
            }
            `),
            evalCode(parseCode(`
            function foo(x, y, z){
                if (x + 1 + y < z) {
                    return x + y + z + 5;
                } 
            }
            `))
        );
    });

    it('is parse complicated example 1 if and if else', () => {
        assert.equal(
            substitute_symbols(`
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
            `),
            evalCode(parseCode(`
            function foo(x, y, z){
                if (x + 1 + y < z) {
                    return x + y + z + 5;
                } else if (x + 1 + y < z * 2) {
                    return x + y + z + x + 5;
                } else {
                    return x + y + z + z + 5;
                }
            }

            `))
        );
    });
});
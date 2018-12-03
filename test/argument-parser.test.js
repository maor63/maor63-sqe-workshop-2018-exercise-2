import assert from 'assert';
import {parse_arguments} from '../src/js/symbolic-substituter';

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
            JSON.stringify({x: [1,3,2]})
        );
    });

    it('is parse multiple arguments', () => {
        assert.equal(
            JSON.stringify(parse_arguments(
                'x=[1,3,2], y=\'hi\', z=0.4'
            )),
            JSON.stringify({x: [1,3,2], y:'hi', z:0.4})
        );
    });
});
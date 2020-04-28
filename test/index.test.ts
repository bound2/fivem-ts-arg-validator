/* eslint-disable  @typescript-eslint/no-explicit-any */
import 'mocha';
import { expect } from 'chai';

import { validate, required, size, RequiredArgumentError, SizeConstraintError } from '../src/index';

class SizeTest {

    @validate
    public async testNumber(@size(0, 1000) arg1: number): Promise<number> {
        return arg1;
    }

    @validate
    public async testString(@size(1, 16) arg1: string): Promise<number> {
        return arg1.length;
    }

    @validate
    public async testArray(@size(3, 10) arg1: Array<any>): Promise<number> {
        return arg1.length;
    }
}

class RequiredTest {

    @validate
    public async test(@required arg1: string, @required arg2: number): Promise<string> {
        return `${arg1}-${arg2}`;
    }
}

describe('required decorator',
    () => {
        const r = new RequiredTest();
        it('present arguments', async () => {
            await r.test("bird", 30)
                .then((result) => expect(result).to.equal("bird-30"))
                .catch((err) => Promise.reject(err));
        });
        it('undefined arugments', async () => {
            await r.test(undefined, 30)
                .then(() => Promise.reject(new Error("Expected promise to fail with exception")))
                .catch((err) => expect(err.message).to.equal("required-arg.missing"));

            await r.test("bird", undefined)
                .then(() => Promise.reject(new Error("Expected promise to fail with exception")))
                .catch((err) => expect(err.message).to.equal("required-arg.missing"));

            await r.test(undefined, undefined)
                .then(() => Promise.reject(new Error("Expected promise to fail with exception")))
                .catch((err) => expect(err.message).to.equal("required-arg.missing"));
        });
        it('null arguments', async () => {
            await r.test(null, 30)
                .then(() => Promise.reject(new Error("Expected promise to fail with exception")))
                .catch((err) => expect(err.message).to.equal("required-arg.missing"));

            await r.test("bird", null)
                .then(() => Promise.reject(new Error("Expected promise to fail with exception")))
                .catch((err) => expect(err.message).to.equal("required-arg.missing"));

            await r.test(null, null)
                .then(() => Promise.reject(new Error("Expected promise to fail with exception")))
                .catch((err) => expect(err.message).to.equal("required-arg.missing"));
        });
    }
);

describe('number size decorator',
    () => {
        const s = new SizeTest();
        it('in bounds', async () => {
            await s.testNumber(500)
                .then((result) => expect(result).to.equal(500))
                .catch((err) => Promise.reject(err));
        });
        it('minimum value', async () => {
            await s.testNumber(0)
                .then((result) => expect(result).to.equal(0))
                .catch((err) => Promise.reject(err));
        });
        it('maximum value', async () => {
            await s.testNumber(1000)
                .then((result) => expect(result).to.equal(1000))
                .catch((err) => Promise.reject(err));
        });
        it('below lower bounds', async () => {
            await s.testNumber(-1)
                .then(() => Promise.reject(new Error("Expected promise to fail with exception")))
                .catch((err) => expect(err.message).to.equal("arg-size.out-of-bounds"));
        });
        it('above upper bounds', async () => {
            await s.testNumber(1001)
                .then(() => Promise.reject(new Error("Expected promise to fail with exception")))
                .catch((err) => expect(err.message).to.equal("arg-size.out-of-bounds"));
        });
    }
);

describe('string size decorator',
    () => {
        const s = new SizeTest();
        const stringProvider = (length: number): string => [...Array(length)].map(() => Math.random().toString(36)[2]).join('');
        it('in bounds', async () => {
            await s.testString(stringProvider(8))
                .then((result) => expect(result).to.equal(8))
                .catch((err) => Promise.reject(err));
        });
        it('minimum value', async () => {
            await s.testString(stringProvider(1))
                .then((result) => expect(result).to.equal(1))
                .catch((err) => Promise.reject(err));
        });
        it('maximum value', async () => {
            await s.testString(stringProvider(16))
                .then((result) => expect(result).to.equal(16))
                .catch((err) => Promise.reject(err));
        });
        it('below lower bounds', async () => {
            await s.testString("")
                .then(() => Promise.reject(new Error("Expected promise to fail with exception")))
                .catch((err) => expect(err.message).to.equal("arg-size.out-of-bounds"));
        });
        it('above upper bounds', async () => {
            await s.testString(stringProvider(17))
                .then(() => Promise.reject(new Error("Expected promise to fail with exception")))
                .catch((err) => expect(err.message).to.equal("arg-size.out-of-bounds"));
        });
    }
);

describe('array size decorator',
    () => {
        const s = new SizeTest();
        const arrayProvider = (length: number): Array<any> => new Array(length);
        it('in bounds', async () => {
            await s.testArray(arrayProvider(5))
                .then((result) => expect(result).to.equal(5))
                .catch((err) => Promise.reject(err));
        });
        it('minimum value', async () => {
            await s.testArray(arrayProvider(3))
                .then((result) => expect(result).to.equal(3))
                .catch((err) => Promise.reject(err));
        });
        it('maximum value', async () => {
            await s.testArray(arrayProvider(10))
                .then((result) => expect(result).to.equal(10))
                .catch((err) => Promise.reject(err));
        });
        it('below lower bounds', async () => {
            await s.testArray(arrayProvider(2))
                .then(() => Promise.reject(new Error("Expected promise to fail with exception")))
                .catch((err) => expect(err.message).to.equal("arg-size.out-of-bounds"));
        });
        it('above upper bounds', async () => {
            await s.testArray(arrayProvider(11))
                .then(() => Promise.reject(new Error("Expected promise to fail with exception")))
                .catch((err) => expect(err.message).to.equal("arg-size.out-of-bounds"));
        });
    }
);

describe('validation errors',
    () => {
        it('required arugment error', () => {
            expect(new RequiredArgumentError()).to.instanceof(Error);
            expect(new RequiredArgumentError()).to.instanceof(RequiredArgumentError);
            expect(new RequiredArgumentError().message).to.equal("required-arg.missing");
        });
        it('size constraint error', () => {
            expect(new SizeConstraintError()).to.instanceof(Error);
            expect(new SizeConstraintError()).to.instanceof(SizeConstraintError);
            expect(new SizeConstraintError().message).to.equal("arg-size.out-of-bounds");
        });
    }
);
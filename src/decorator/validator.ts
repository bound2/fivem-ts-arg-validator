/* eslint-disable  @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { RequiredArgumentError } from '../error/RequiredArgument.error';
import { SizeConstraintError } from '../error/SizeConstraint.error';

const requiredMetadataKey = Symbol('required');
const sizeMetadataKey = Symbol('size');

export function required(target: any, propertyKey: string | symbol, parameterIndex: number): void {
    const existingRequiredParameters: Array<number> = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);

    Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
}

interface Size {
    min: number;
    max: number;
    index: number;
}

export function size(min: number, max: number) {
    return (target: any, propertyKey: string | symbol, parameterIndex: number): void => {
        const existingSizeParameters: Array<Size> = Reflect.getOwnMetadata(sizeMetadataKey, target, propertyKey) || [];
        const size: Size = {
            min: min,
            max: max,
            index: parameterIndex,
        };
        existingSizeParameters.push(size);

        Reflect.defineMetadata(sizeMetadataKey, existingSizeParameters, target, propertyKey);
    };
}

export function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<(...params: Array<any>) => Promise<any>>): TypedPropertyDescriptor<any> {
    const method = descriptor.value;

    descriptor.value = async function (...args: Array<any>): Promise<any> {
        const requiredParameters: Array<number> = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
        if (requiredParameters) {
            for (const parameterIndex of requiredParameters) {
                if (parameterIndex >= args.length || !args[parameterIndex]) {
                    // TODO add custom errors which provide detailed error msg e.g. function name, arg idx
                    return Promise.reject(new RequiredArgumentError());
                }
            }
        }
        const sizedParameters: Array<Size> = Reflect.getOwnMetadata(sizeMetadataKey, target, propertyName);
        if (sizedParameters) {
            for (const s of sizedParameters) {
                const value = args[s.index];
                if (typeof value === 'number' && (s.min > value || s.max < value)) {
                    // TODO add custom errors which provide detailed error msg e.g. function name, arg idx, min size, max size, actual size
                    return Promise.reject(new SizeConstraintError());
                } else if (typeof value === 'string' && (s.min > value.length || s.max < value.length)) {
                    return Promise.reject(new SizeConstraintError());
                } else if (Array.isArray(value) && (s.min > value.length || s.max < value.length)) {
                    return Promise.reject(new SizeConstraintError());
                }
            }
        }

        return method.apply(this, args);
    };

    return descriptor;
}

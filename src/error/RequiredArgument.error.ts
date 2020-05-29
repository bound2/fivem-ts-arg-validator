export class RequiredArgumentError extends Error {
    private static readonly MESSAGE: string = 'required-arg.missing';

    constructor() {
        super(RequiredArgumentError.MESSAGE);
        Object.setPrototypeOf(this, RequiredArgumentError.prototype);
    }
}
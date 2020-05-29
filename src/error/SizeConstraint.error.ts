export class SizeConstraintError extends Error {
    private static readonly MESSAGE: string = 'arg-size.out-of-bounds';

    constructor() {
        super(SizeConstraintError.MESSAGE);
        Object.setPrototypeOf(this, SizeConstraintError.prototype);
    }
}
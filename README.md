# fivem-ts-arg-validator
TypeScript helper library to perform input validation on function arguments with decorators.

### Usage
Add dependency to your project with `yarn add fivem-ts-arg-validator`.

### Code example
```typescript
import { required, size, validate } from 'fivem-ts-arg-validator';

class ValidationExample {

    @validate
    public async integerType(@required @size(0, Number.MAX_VALUE) n: number): Promise<void> {
        // requires argument `n` to be from 0 to 2,147,483,647 (included)
    }

    @validate
    public async stringType(@required @size(5, 16) s: string): Promise<void> {
        // requires argument `s` to be from 5 to 16 symbols of length (included)
    }

    @validate
    public async arrayType(@size(1, 5) a: Array<any>): Promise<void> {
        // requires arugment `a` to have from 1 to 5 elements (included) or be null since required is omitted
    }
}

const validation = new ValidationExample();
validation.integerType(5);
validation.stringType("Lorem ipsum");
validation.arrayType(["element"]);
```
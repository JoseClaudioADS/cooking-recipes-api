/**
 *
 */
export class UnauthorizedError extends Error {
    constructor() {
        super("Unauthorized");

        // https://edg.foo/blog/better-errors-ts#a-more-helpful-error-class
        Object.defineProperty(this, "name", { value: new.target.name });
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

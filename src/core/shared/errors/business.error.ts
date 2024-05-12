/**
 *
 */
export class BusinessError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);

    // https://edg.foo/blog/better-errors-ts#a-more-helpful-error-class
    Object.defineProperty(this, "name", { value: new.target.name });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

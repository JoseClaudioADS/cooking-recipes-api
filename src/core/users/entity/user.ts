/**
 *
 */
export class User {

    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly profile: string,
        public readonly email: string
    ) {}
}
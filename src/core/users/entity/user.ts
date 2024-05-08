/**
 *
 */
export class User {

    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly bio: string | null,
        public readonly email: string
    ) {}
}

/**
 *
 */
export class MagicLink {

    constructor(
        public readonly token: string,
        public readonly userId: number,
        public readonly createdAt: Date
    ) {}
}

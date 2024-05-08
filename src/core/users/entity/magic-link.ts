/**
 *
 */
export class MagicLink {

    constructor(
        public readonly token: number,
        public readonly userId: number,
        public readonly createdAt: Date
    ) {}
}

import { User } from "../../users/entity/user";

/**
 *
 */
export class MagicLink {

    constructor(
        public readonly token: string,
        public readonly user: User,
        public readonly createdAt: Date
    ) {}
}

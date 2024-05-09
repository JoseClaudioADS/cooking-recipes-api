import { Photo } from "../../photos/entity/photo";
import { User } from "../../users/entity/user";
import { Ingredient } from "./ingredient";

/**
 *
 */
export class Recipe {

    constructor(
        public readonly title: string,
        public readonly description: string | null,
        public readonly preparationTime: number,
        public readonly ingredients: Ingredient[],
        public readonly photo: Photo,
        public readonly user: User,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {}
}

import { BusinessError } from "../../shared/errors/business.error";

/**
 *
 */
export class UserByEmailNotFoundError extends BusinessError {

  constructor(email: string) {
    super(`User with email ${email} not found.`, "USER_NOT_FOUND");
  }
}

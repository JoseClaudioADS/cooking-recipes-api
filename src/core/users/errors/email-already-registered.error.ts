import { BusinessError } from "../../shared/errors/business.error";

/**
 *
 */
export class EmailAlreadyRegisteredError extends BusinessError {

  constructor(email: string) {
    super(`Email ${email} already registered.`, "EMAIL_ALREADY_REGISTERED");
  }
}

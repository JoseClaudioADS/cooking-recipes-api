// src/types/express/index.d.ts

import { AuthUser } from "../../core/shared/entity/auth-user";

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface Request {
      user?: AuthUser;
    }
  }
}

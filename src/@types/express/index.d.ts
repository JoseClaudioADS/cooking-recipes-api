// src/types/express/index.d.ts

type User = {
  id: number;
  name: string;
  email: string;
}

// to make the file a module and avoid the TypeScript error
export { };

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

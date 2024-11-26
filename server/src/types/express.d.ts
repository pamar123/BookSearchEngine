declare namespace Express {
    interface Request {
      token?: string;
      user?: {
        _id: string;
        email: string;
        username: string;
      } | null;
    }
  }
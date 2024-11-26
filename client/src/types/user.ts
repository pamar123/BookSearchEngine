export interface Book {
    bookId: string;
    authors: string[];
    description: string;
    title: string;
    image?: string;
    link?: string;
  }
  
  export interface User {
    _id: string;
    username: string;
    email: string;
    savedBooks: Book[];
    bookCount: number;
  }
  
  export interface LoginInput {
    email: string;
    password: string;
  }
  
  export interface AuthData {
    login: {
      token: string;
      user: User;
    }
  }
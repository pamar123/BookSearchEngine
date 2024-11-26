export interface Book {
    bookId: string;
    authors: string[];
    title: string;
    description: string;
    image?: string;
    link?: string;
  }
  
  export interface User {
    _id: string;
    username: string;
    email: string;
    bookCount: number;
    savedBooks: Book[];
  }
  
  export interface AuthData {
    token: string;
    user: User;
  }
declare module 'mime' {
    export function getType(path: string): string | null;
    export function getExtension(mime: string): string | null;
  }
  
  declare module 'send' {
    function send(req: any, path: string, options?: any): any;
    export = send;
  }
  
  declare module 'range-parser' {
    function rangeParser(size: number, str: string, options?: any): any[];
    export = rangeParser;
  }
  
  declare module 'http-errors' {
    function createError(status?: number, message?: string): Error;
    export = createError;
  }
interface HandlerPost {
  responseGet(status: number, responseText: string): void;
  responsePost(status: number, response: string): void;
  responseDelete(status: number, response: string, datos: any): void;
  responsePut(status: number, response: string, datos: any): void;
}

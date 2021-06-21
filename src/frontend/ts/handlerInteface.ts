interface HandlerHttpEvents {
  responseGet(status: number, responseText: string): void;
  responsePost(status: number, response: string): void;
  responseDelete(status: number, response: string): void;
  responsePut(status: number, response: string): void;
}

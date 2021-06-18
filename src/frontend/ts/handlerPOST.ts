interface HandlerPost{
  responseGet(status: number, responseText: string);

  responsePost(status: number, response: string):void;
}

interface HandlerPost{
  responseGet(status: number, responseText: string):void;

  responsePost(status: number, response: string):void;
}

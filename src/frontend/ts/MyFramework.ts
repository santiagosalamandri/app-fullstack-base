class MyFramework {
  public getElementById(id: string): HTMLElement {
    return document.getElementById(id);
  }

  public requestPOST(url: string, response: HandlerHttpEvents, datos: any) {
    let xlm: XMLHttpRequest = new XMLHttpRequest();

    xlm.onreadystatechange = () => {
      if (xlm.readyState == 4) {
        response.responsePost(xlm.status, xlm.responseText);
      }
    }
    xlm.open("POST", url, true);
    xlm.setRequestHeader("Content-Type", "application/json");
    xlm.send(JSON.stringify(datos));
  }
  /**
   * requestGET
   */
  public requestGET(url: string, response: HandlerHttpEvents) {
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        console.log("xhr.status: " + xhr.status);
        response.responseGet(xhr.status, xhr.responseText);
      }
    }
    xhr.open("GET", url, true)
    xhr.send();
    console.log("Ya hice el request!!")
  }
  public requestDELETE(url: string, response: HandlerHttpEvents) {
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        console.log("xhr.status: " + xhr.status);
        response.responseDelete(xhr.status, xhr.responseText);
      }
    }
    xhr.open("DELETE", url, true)
    xhr.send();
    console.log("Ya hice el request!!")
  }
  public requestPUT(url: string, response: HandlerHttpEvents, datos: any) {
    let xlm: XMLHttpRequest = new XMLHttpRequest();

    xlm.onreadystatechange = () => {
      if (xlm.readyState == 4) {
        response.responsePut(xlm.status, xlm.responseText);
      }
    }
    xlm.open("PUT", url, true);
    xlm.setRequestHeader("Content-Type", "application/json");
    xlm.send(JSON.stringify(datos));
  }
}
class Main implements EventListenerObject, HandlerPost {
    public myFramework: MyFramework;
    public main(): void {
        console.log("Se ejecuto el metodo main!!!");
        this.myFramework = new MyFramework();

    }
    public mostrarLista() {
        let listaUsr: Array<User> = new Array<User>();

        let usr1 = new User(1, "matias", "mramos@asda.com", true);
        let usr2 = new User(2, "Jose", "jose@asda.com", false);
        let usr3 = new User(3, "Pedro", "perdro@asda.com", false);

        usr1.setIsLogged(false);
        listaUsr.push(usr1);
        listaUsr.push(usr2);
        listaUsr.push(usr3);

        for (let obj in listaUsr) {
            listaUsr[obj].printInfo();
        }
    }
    public listDevices(devices: Array<Device> ){
        for (let disp of devices) {

            let listaDisp = this.myFramework.getElementById("listaDisp");
            listaDisp.innerHTML += `<li class="collection-item avatar">
            <img src="./static/images/lightbulb.png" alt="" class="circle">
            <span class="nombreDisp">${disp.name}</span>
            <p>${disp.description}
            </p>
            <a href="#!" class="secondary-content">
                <div class="switch">
                    <label >
                      Off
                      <input id="disp_${disp.id}" type="checkbox">
                      <span class="lever"></span>
                      On
                    </label>
                  </div>
            </a>
          </li>`;


        }
    }
    public handleEvent(ev: Event) {

         alert("Se hizo click!");


        let objetoClick: HTMLElement = <HTMLElement>ev.target;

        if (objetoClick.textContent == "Listar") {

           this.myFramework.requestGET("http://localhost:8000/devices", this);

        } else {
            let checkBox: HTMLInputElement = <HTMLInputElement>ev.target;
            alert(checkBox.id + " - " + checkBox.checked);

            let datos = { "id": checkBox.id, "status": checkBox.checked }
            this.myFramework.requestPOST("http://localhost:8000/devices", this, datos);

        }
    }

    responsePost(status: number, response: string) {
        alert(response);
    }
    responseGet(status: number, response: string){
        if (status == 200) {
            console.log("Llego la respuesta!!!!");
            console.log(response);

            let listaDis: Array<Device> = JSON.parse(response);

            this.listDevices(listaDis);                        

            for (let disp of listaDis) {
                let checkDisp = this.myFramework.getElementById("disp_" + disp.id);
                checkDisp.addEventListener("click", this);
            }
        } else {
            alert("error!!")
        }
    }

}
window.addEventListener("load", () => {
    let miObjMain: Main = new Main();
    miObjMain.main();
    let boton: HTMLElement = miObjMain.myFramework.getElementById("boton");
    boton.textContent = "Listar";
    boton.addEventListener("click", miObjMain);

    miObjMain.myFramework.requestGET("http://localhost:8000/devices", miObjMain);
});





class Main implements EventListenerObject, HandlerPost {
    public myFramework: MyFramework;
    public myDevices: Array<Device>;
    public main(): void {
        console.log("Se ejecuto el metodo main!!!");
        this.myFramework = new MyFramework();

    }
    public listDevices(devices: Array<Device>) {
        for (let disp of devices) {

            let listaDisp = this.myFramework.getElementById("listaDisp");
            listaDisp.innerHTML += `<div class="col">
            <div class="card blue-grey darken-1" >
                <div class="card-content white-text" >
                    <span class=card-title> ${disp.name} </span>
                        <p> ${disp.description}.</p>
                        <div class="switch">
                        <label>
                          Off
                          <input id="disp_${disp.id}" type="checkbox">
                          <span class="lever"></span>
                          On
                        </label>
                      </div>
                        </div>
               
                <div class="card-action">
                <a id=edit_${disp.id} class="waves-effect waves-light btn">Editar</a>
                <a id=del_${disp.id} class="waves-effect waves-light btn">Eliminar</a>
                            </div>
                            </div>
                            </div>`;
        }
    }
    public handleEvent(ev: Event) {

        //alert("Se hizo click!");


        let objetoClick: HTMLElement = <HTMLElement>ev.target;
        switch (objetoClick.textContent) {
            case "Listar":
                this.myFramework.requestGET("http://localhost:8000/devices", this);
                break;
            case "Editar":
                //TODO: Abrir modal
                console.log("editar "+objetoClick.id);
                break;
            case "Eliminar":
                console.log("eliminar "+objetoClick.id);
                //TODO:enviar delete
                break;
            default:    //Checkbox clicked
                let checkBox: HTMLInputElement = <HTMLInputElement>ev.target;
            console.log(checkBox.id + " - " + checkBox.checked);

            let datos = { "id": checkBox.id, "status": checkBox.checked }
            this.myFramework.requestPOST("http://localhost:8000/devices", this, datos);
                break;
        }
    }

    responsePost(status: number, response: string) {
        //TODO: utilizar el response para actualizar la lista
        //alert(response);
        console.log("Response POST: " + response);
    }
    responseGet(status: number, response: string) {
        if (status == 200) {
            //console.log("Llego la respuesta: "+response);

            let listaDis: Array<Device> = JSON.parse(response);
            this.listDevices(listaDis);
            for (let disp of listaDis) {
                let checkDisp = this.myFramework.getElementById("disp_" + disp.id);
                checkDisp.addEventListener("click", this);
                let checkEdit = this.myFramework.getElementById("edit_" + disp.id);
                checkEdit.addEventListener("click", this);
                let checkDel = this.myFramework.getElementById("del_" + disp.id);
                checkDel.addEventListener("click", this);
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

    const elem = miObjMain.myFramework.getElementById('modal');
    const instance = this.M.Modal.init(elem, { dismissible: false });

});
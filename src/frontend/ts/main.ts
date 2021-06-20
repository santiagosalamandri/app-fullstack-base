class Main implements EventListenerObject, HandlerPost {
    public myFramework: MyFramework;
    public myDevices: Array<Device>;
    public deviceChanged: Device;
    public main(): void {
        console.log("Se ejecuto el metodo main!!!");
        this.myFramework = new MyFramework();

    }
    public getDeviceById(id: number): Device {
        for (let device of this.myDevices) {
            if (device.id == id) {
                console.log("Found device: ", device.name);
                return device
            }
        }
        console.log("NOT FOUND!");
        return null; //Not found
    }
    public removeDeviceById(id: number) {
        console.log("ANTES DE BORRAR: ");
        this.printDevices();
        this.myDevices.splice(id - 1, 1);

        console.log("DESPUES DE BORRAR: ");
        this.printDevices();

    }
    public printDevices() {
        for (let device of this.myDevices) {
            console.log(device.id + " :" + device.name + " Desc:" + device.description)
        }
    }
    public listDevices(devices: Array<Device>) {
        let showSwitch = "";
        let showSlider = "";

        for (let disp of devices) {
            console.log(disp.type);
            if (disp.type == 0) {
                showSwitch = "block";
                showSlider = "none";
            }
            else {
                showSwitch = "none";
                showSlider = "block";
            }
            let listaDisp = this.myFramework.getElementById("listaDisp");
            listaDisp.innerHTML += `<div class="col">
                                        <div class="card blue-grey darken-1" >
                                            <div class="card-content white-text" >
                                                <span class=card-title> ${disp.name} </span>
                                                    <p> ${disp.description}.</p>
                                                    <div class="switch" style="display:${showSwitch}">
                                                        <label>
                                                        Off
                                                        <input id="disp_${disp.id}" type="checkbox">
                                                        <span class="lever"></span>
                                                        On
                                                        </label>
                                                    </div>
                                                    <p class="range-field" style="display:${showSlider}" >
                                                        <input type="range" id="range_${disp.id}" min="0" max="100" />
                                                    </p>
                                            </div>
                                            <div class="card-action">
                                                <a id=edit_${disp.id} class="waves-effect waves-light btn " href="#modal">Editar</a>
                                                <a id=del_${disp.id} class="waves-effect waves-light btn" href=#modal">Eliminar</a>
                                            </div>
                                        </div>
                                    </div>`;
        }
    }
    public populateForm(id: number) {
        let device = this.getDeviceById(id);

        const nameId = this.myFramework.getElementById('formName');
        let name: HTMLInputElement = <HTMLInputElement>nameId;
        //console.log( "name.value "+ name.value);

        name.value = device.name;
        //console.log( "name.value "+ name.value);

        const formId = this.myFramework.getElementById('formDescription');
        let desc: HTMLInputElement = <HTMLInputElement>formId;
        desc.value = device.description;

        if (device.type == 0) {
            const typeOnOffId = this.myFramework.getElementById('typeOnOff');
            let typeOnOff: HTMLInputElement = <HTMLInputElement>typeOnOffId;
            typeOnOff.checked = true;
        }
        else {
            const typeDimId = this.myFramework.getElementById('typeDim');
            let typeDim: HTMLInputElement = <HTMLInputElement>typeDimId;
            typeDim.checked = true;
        }

        const elem = this.myFramework.getElementById('modal');
        let instance = window.M.Modal.getInstance(elem);
        instance.open();

    }
    public getValuesFromForm() {
        const nameId = this.myFramework.getElementById('formName');
        let name: HTMLInputElement = <HTMLInputElement>nameId;
        //this.deviceChanged.name=name.value;

        console.log("NAME: " + name.value);
        const formId = this.myFramework.getElementById('formDescription');
        let desc: HTMLInputElement = <HTMLInputElement>formId;
        //this.deviceChanged.description=desc.value;
        console.log("DESC: " + desc.value);

        const typeOnOffId = this.myFramework.getElementById('typeOnOff');
        let typeOnOff: HTMLInputElement = <HTMLInputElement>typeOnOffId;
        //this.deviceChanged.type=typeOnOff.checked;
        console.log("TYPE onOff: " + typeOnOff.checked);
  
        const typeDimId = this.myFramework.getElementById('typeDim');
        let typeDim: HTMLInputElement = <HTMLInputElement>typeDimId;
        //this.deviceChanged.type=typeOnOff.checked;
        console.log("TYPE dimm: " + typeDim.checked);

        //let device:Device =new Device;
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
                let str = objetoClick.id.replace("edit_", "");
                //console.log("editar " +str);
                this.populateForm(parseInt(str));
                break;
            case "Eliminar":
                //console.log("eliminar " + objetoClick.id);
                let strId = objetoClick.id.replace("del_", "");
                this.removeDeviceById(parseInt(strId));
                //let id = { "id": objetoClick.id }
                //this.printDevices();
                //this.myFramework.requestDELETE("http://localhost:8000/devices", this, id);
                //TODO:enviar delete
                break;
            case "Confirmar":
                console.log("se apreto Confirmar");
                this.getValuesFromForm();
                //TODO: Enviar cambios
                break;
            case "Descartar":
                console.log("se apreto Descartar");
                //TODO: Restaura modal
                break;
            default:    //Checkbox clicked
                let checkBox: HTMLInputElement = <HTMLInputElement>objetoClick;
                var res = objetoClick.id.substring(0, 6);
                let datos = {};
                if(res == "range_"){
                    datos = { "id": checkBox.id, "status": checkBox.value }
                }
                else{
                    let value = checkBox.checked ? 100 : 0;
                    datos = { "id": checkBox.id, "status": value }
                }
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

            //let listaDis: Array<Device> = JSON.parse(response);
            this.myDevices = JSON.parse(response);
            this.listDevices(this.myDevices);
            for (let disp of this.myDevices) {
                let checkDisp = this.myFramework.getElementById("disp_" + disp.id);
                checkDisp.addEventListener("click", this);
                let rangeSwitch = this.myFramework.getElementById("range_" + disp.id);
                rangeSwitch.addEventListener("click", this);
                let checkEdit = this.myFramework.getElementById("edit_" + disp.id);
                checkEdit.addEventListener("click", this);
                let checkDel = this.myFramework.getElementById("del_" + disp.id);
                checkDel.addEventListener("click", this);
            }
        } else {
            alert("error!!")
        }
    }
    responseDelete(status: number, response: string) {
        console.log("response from Delete");
    }
    responsePut(status: number, response: string) {
        console.log("response from Put");
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

    let confirmarId = miObjMain.myFramework.getElementById("confirmarId");
    confirmarId.addEventListener("click", miObjMain);
    let descartarId = miObjMain.myFramework.getElementById("descartarId");
    descartarId.addEventListener("click", miObjMain);
});
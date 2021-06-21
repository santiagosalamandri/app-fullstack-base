class Main implements EventListenerObject, HandlerPost {
    public myFramework: MyFramework;
    public myDevices: Array<Device>;
    public deviceChanged: Device;
    public lastIdClicked: number;
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
    public removeDeviceById(id: number): Array<Device> {
        console.log("ANTES DE BORRAR: ");
        //this.printDevices();
        let newArray: Array<Device> = this.myDevices.filter(item => item.id != id);

        console.log("DESPUES DE BORRAR: ");
        //this.printDevices();
        return newArray;

    }
    public printDevices() {
        for (let device of this.myDevices) {
            console.log(device.id + " :" + device.name + " Desc:" + device.description + " Status:" + device.status + " State:" + device.state)
        }
    }
    public listDevices(devices: Array<Device>) {
        let showSwitch = "";
        let showSlider = "";
        let listaDisp = this.myFramework.getElementById("listaDisp");
        listaDisp.innerHTML = "";

        for (let disp of devices) {
            console.log("state: " + JSON.stringify(disp.status));
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
                                                        <input id="disp_${disp.id}" type="checkbox"  >
                                                        <span class="lever"></span>
                                                        On
                                                        </label>
                                                    </div>
                                                    <div class="range-field" style="display:${showSlider}" >
                                                        <input type="range" id="range_${disp.id}"  min="0" max="100" />
                                                        </div>      
                                            </div>
                                            <div class="card-action">
                                                <a id=edit_${disp.id} class="waves-effect waves-light btn " href="#modal">Editar</a>
                                                <a id=del_${disp.id} class="waves-effect waves-light btn" href=#modal">Eliminar</a>
                                            </div>
                                        </div>
                                    </div>`;
        }
    }
    public updateDeviceStatus(response: string): void {
        let deviceUpdated = JSON.parse(response);
        let datos = this.myDevices.filter(item => item.id == deviceUpdated.id);
        if (datos.length > 0) {
            datos[0].name = deviceUpdated.name;
            datos[0].description = deviceUpdated.description;
            datos[0].type = deviceUpdated.type;
            datos[0].state = deviceUpdated.state;
            datos[0].status = deviceUpdated.status;
            //console.log("ACTUALIZADO DATOS: "+JSON.stringify(datos[0]));
        }
        else {   //nuevo dispositivo
            this.myDevices.push(deviceUpdated);
        }
        this.responseGet(200, JSON.stringify(this.myDevices));
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

        let type = typeOnOff.checked ? 0 : 1;

        return { "id": this.lastIdClicked, "name": name.value, "description": desc.value, "type": type };

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
                console.log("editar " + str);
                this.lastIdClicked = parseInt(str);
                this.populateForm(parseInt(str));
                //let device={s:"s"};
                //this.myFramework.requestPut(`http://localhost:8000/devices/${strId}`, this,device);

                break;
            case "Eliminar":
                //console.log("eliminar " + objetoClick.id);
                let strId = objetoClick.id.replace("del_", "");
                //this.removeDeviceById(parseInt(strId));
                //let id = { "id": objetoClick.id }
                //this.printDevices();
                this.myFramework.requestDELETE(`http://localhost:8000/devices/${strId}`, this);
                //TODO:enviar delete
                break;
            case "Confirmar":
                //console.log("se apreto Confirmar");
                if (this.lastIdClicked != 0) {
                    this.myFramework.requestPUT(`http://localhost:8000/devices/${this.lastIdClicked}`, this, this.getValuesFromForm());
                } else {
                    this.myFramework.requestPOST(`http://localhost:8000/devices/`, this, this.getValuesFromForm());
                }
                this.lastIdClicked;
                //console.log(JSON.stringify(this.getValuesFromForm()));
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
                let idDevice = "";
                if (res == "range_") {
                    idDevice = checkBox.id.replace("range_", "");
                    datos = { "status": checkBox.value }
                }
                else {
                    idDevice = checkBox.id.replace("disp_", "");
                    let value = checkBox.checked ? 1 : 0;
                    datos = { "state": value };
                }
                console.log("enviando datos de " + checkBox.id + " " + JSON.stringify(datos));
                let id = parseInt(idDevice);
                this.myFramework.requestPOST(`http://localhost:8000/devices/${id}`, this, datos);
                break;
        }
    }

    responsePost(status: number, response: string) {
        //TODO: utilizar el response para actualizar la lista
        //alert(response);
        console.log("Response POST: " + response);
        if (status == 200) {
            this.updateDeviceStatus(response);
        }
        else {
            alert("Request fallida");
        }
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
                if (disp.type == 1) {
                    let update = <HTMLInputElement>this.myFramework.getElementById("range_" + disp.id);
                    update.value = disp.status.toString();
                }
                else {
                    let update = <HTMLInputElement>this.myFramework.getElementById("disp_" + disp.id);
                    console.log("cambiando swtich");
                    update.checked = disp.state;

                }
            }
        }
        else {
            alert("Request fallida");
        }

    }
    responseDelete(status: number, response: string) {
        console.log("response from Delete " + status);
        if (status == 200) {
            console.log(response);
            let id = JSON.parse(response);
            console.log(this.removeDeviceById(id.id));
            this.responseGet(200, JSON.stringify(this.removeDeviceById(id.id)));
        }
        else {
            alert("Request fallida");
        }

    }
    responsePut(status: number, response: string) {
        console.log("response from Put " + response);
        if (status == 200) {
            this.updateDeviceStatus(response);
        }
        else {
            alert("Request fallida");
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
    miObjMain.lastIdClicked = 0;

    let confirmarId = miObjMain.myFramework.getElementById("confirmarId");
    confirmarId.addEventListener("click", miObjMain);
    let descartarId = miObjMain.myFramework.getElementById("descartarId");
    descartarId.addEventListener("click", miObjMain);
});
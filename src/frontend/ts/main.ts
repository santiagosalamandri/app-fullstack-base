const BASE_URL = "http://localhost:8000/devices/";

class Main implements EventListenerObject, HandlerHttpEvents {
    public myFramework: MyFramework;
    public myDevices: Array<Device>;
    public deviceChanged: Device;
    public lastIdClicked: number;
    public main(): void {
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
        let newArray: Array<Device> = this.myDevices.filter(item => item.id != id);
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
        }
        else {   //nuevo dispositivo
            this.myDevices.push(deviceUpdated);
        }
        this.responseGet(200, JSON.stringify(this.myDevices));
    }
    public populateForm(id: number) {
        let device = this.getDeviceById(id);

        const headerId = this.myFramework.getElementById('headerDisp');
        headerId.innerText = "Editar dispositivo";

        const nameId = this.myFramework.getElementById('formName');
        let name: HTMLInputElement = <HTMLInputElement>nameId;
        name.value = device.name;

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

        const formId = this.myFramework.getElementById('formDescription');
        let desc: HTMLInputElement = <HTMLInputElement>formId;

        const typeOnOffId = this.myFramework.getElementById('typeOnOff');
        let typeOnOff: HTMLInputElement = <HTMLInputElement>typeOnOffId;

        const typeDimId = this.myFramework.getElementById('typeDim');
        let typeDim: HTMLInputElement = <HTMLInputElement>typeDimId;

        let type = typeOnOff.checked ? 0 : 1;

        return { "id": this.lastIdClicked, "name": name.value, "description": desc.value, "type": type };
    }
    public actualizarModal() {
        const headerId = this.myFramework.getElementById('headerDisp');
        headerId.innerText = "Nuevo dispositivo";

        const formNameId = this.myFramework.getElementById('formName');
        let formName: HTMLInputElement = <HTMLInputElement>formNameId;
        formName.value = "";

        const formId = this.myFramework.getElementById('formDescription');
        let formDesc: HTMLInputElement = <HTMLInputElement>formId;
        formDesc.value = "";

        const typeOnOffId = this.myFramework.getElementById('typeOnOff');
        let typeOnOff: HTMLInputElement = <HTMLInputElement>typeOnOffId;
        typeOnOff.checked = true;
    }
    public handleEvent(ev: Event) {

        let objetoClick: HTMLElement = <HTMLElement>ev.target;
        switch (objetoClick.textContent) {
            case "Editar":
                let str = objetoClick.id.replace("edit_", "");
                this.lastIdClicked = parseInt(str);
                this.populateForm(parseInt(str));
                break;
            case "Eliminar":
                let strId = objetoClick.id.replace("del_", "");
                this.myFramework.requestDELETE(`${BASE_URL}${strId}`, this);
                break;
            case "Confirmar":
                if (this.lastIdClicked != 0) {
                    this.myFramework.requestPUT(`${BASE_URL}${this.lastIdClicked}`, this, this.getValuesFromForm());
                } else {
                    this.myFramework.requestPOST(`${BASE_URL}`, this, this.getValuesFromForm());
                }
                this.lastIdClicked;
                this.actualizarModal();
                break;
            case "Descartar":
                this.actualizarModal();
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
                let id = parseInt(idDevice);
                this.myFramework.requestPOST(`${BASE_URL}${id}`, this, datos);
                break;
        }
    }

    responsePost(status: number, response: string) {
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
                    update.checked = disp.state;

                }
            }
        }
        else {
            alert("Request fallida");
        }

    }
    responseDelete(status: number, response: string) {
        if (status == 200) {
            let id = JSON.parse(response);
            this.responseGet(200, JSON.stringify(this.removeDeviceById(id.id)));
        }
        else {
            alert("Request fallida");
        }

    }
    responsePut(status: number, response: string) {
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
    //Traigo los datos de dispositivos cuando la pagina termino de cargar
    miObjMain.myFramework.requestGET(`${BASE_URL}`, miObjMain);
    
    miObjMain.lastIdClicked = 0;

    //Registro modal y sus botones
    const elem = miObjMain.myFramework.getElementById('modal');
    const instance = this.M.Modal.init(elem, { dismissible: false });
    let confirmarId = miObjMain.myFramework.getElementById("confirmarId");
    confirmarId.addEventListener("click", miObjMain);
    let descartarId = miObjMain.myFramework.getElementById("descartarId");
    descartarId.addEventListener("click", miObjMain);
});
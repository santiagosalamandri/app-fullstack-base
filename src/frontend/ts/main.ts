class Main{
    public myFramework: MyFramework;
    public main(): void {
        console.log("Se ejecuto el metodo main!!!");
        this.myFramework = new MyFramework();
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

    
}
window.onload = function ejecutar() {
    let miObjMain: Main = new Main();
    miObjMain.main();
    let boton = miObjMain.myFramework.getElementById("boton");
    boton.textContent="Nuevo texto"
};





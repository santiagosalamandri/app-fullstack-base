class User{
  private id: number;
  private name: string;
  private email: string;
  private isLogged: boolean;

  constructor(id:number,name:string,email:string,isLogged:boolean) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.isLogged = isLogged;
    
  }
  
  public printInfo(): void{
    console.log(this.name + " - " + this.isLogged);
  }
  
  public setIsLogged(isLogged: boolean): void{
    this.isLogged = isLogged;
  }

  public getIsLogged():boolean {
    return this.isLogged;
  }
}
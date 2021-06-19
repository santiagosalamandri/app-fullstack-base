class Device {

  private _id: number;
  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
    this._id = value;
  }
  private _name: string;
  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
  private _description: string;
  public get description(): string {
    return this._description;
  }
  public set description(value: string) {
    this._description = value;
  }
  private _state: boolean;
  public get state(): boolean {
    return this._state;
  }
  public set state(value: boolean) {
    this._state = value;
  }
  private _type: number;
  public get type(): number {
    return this._type;
  }
  public set type(value: number) {
    this._type = value;
  }
}
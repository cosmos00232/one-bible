export default class Book {
  public id!: string;

  public name!: string;

  public length!: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static plainToClass(json: any): Book {
    const instance = new Book();
    instance.id = json.id;
    instance.name = json.name;
    instance.length = json.length;
    return instance;
  }
}

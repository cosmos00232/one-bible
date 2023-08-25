export default class History {
  public count: number = 0;

  public read_at: string = new Date().toISOString();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static plainToClass(json: any): History {
    const instance = new History();
    instance.count = json.count;
    instance.read_at = json.read_at;
    return instance;
  }
}

export default class History {
  public count: number = 0;

  public read_at: number = new Date().getTime();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static plainToClass(json: any): History {
    const instance = new History();
    instance.count = json.count;
    instance.read_at = json.read_at;
    return instance;
  }
}

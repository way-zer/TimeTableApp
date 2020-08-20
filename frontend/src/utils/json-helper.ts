import {isArray} from 'util';

export type Like<T> = {
  [P in keyof T]?: T[P] | Like<T[P]>;
};

export interface SerializableObject<T> {
  beforeJson?(T): T;

  afterParse?(T);

  new(): T;
}

export class JsonHelper {
  public static jsonStringify<T>(c: SerializableObject<T>, obj: T | T[]): string {
    if (c.beforeJson) {
      if (isArray(obj)) {
        obj = (obj as T[]).map(c.beforeJson);
      } else {
        obj = c.beforeJson(obj);
      }
    }
    return JSON.stringify(obj);
  }

  public static parseArray<T>(c: SerializableObject<T>, jsonArray: Like<T>[] | string): T[] {
    if (typeof jsonArray === 'string') {
      jsonArray = JSON.parse(jsonArray);
    }
    return (jsonArray as Like<T>[]).map(value => this.parseObject(c, value));
  }

  public static parseObject<T>(c: SerializableObject<T>, jsonObj: Like<T> | string): T {
    if (typeof jsonObj === 'string') {
      jsonObj = JSON.parse(jsonObj);
    }
    const obj = new c();
    const o = Object.assign(obj, jsonObj);
    if (c.afterParse) {
      c.afterParse(obj);
    }
    return o;
  }
}

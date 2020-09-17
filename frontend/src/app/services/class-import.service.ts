import {Injectable} from '@angular/core';
import {Class} from './types/Class';
import {BUPTParser} from './class-import-adapters/BUPT';
import {BUPTOLDParser} from './class-import-adapters/BUPT_OLD';
import {BehaviorSubject} from 'rxjs';

export interface ClassImportAdapter {
  uniqueName: string;
  name: string;
  maxDay: number;
  timeTable: string[];

  /**
   * @param dom Normally is Node body
   * @throws Error Any Exception
   */
  parse(dom: HTMLElement): Class[];
}

const Adapters: ClassImportAdapter[] = [
  new BUPTParser(),
  new BUPTOLDParser(),
];

@Injectable({
  providedIn: 'root'
})
export class ClassImportService {

  constructor() {
  }
  public readonly adapters = Adapters;
  public get defaultAdopter() {return this.adapters[0]; }
  public readonly adapter = new BehaviorSubject(this.defaultAdopter);

  public changeAdapter(name: string) {
    if (this.adapter.value.uniqueName === name) { return; }
    const ne = this.adapters.find(value => value.uniqueName === name);
    if (ne) { this.adapter.next(ne); }
  }
  /**
   * @param dom Normally is Node body
   * @return message
   */
  public inputClasses(dom: HTMLElement, callback: (res: Class[]) => void ): string {
    try {
      const next = this.adapter.value.parse(dom);
      if (!next.length) {
        // noinspection ExceptionCaughtLocallyJS
        throw Error('Empty ClassList');
      }
      callback(next);
    } catch (e) {
      console.error(dom, e);
      return 'Input fail!' + e;
    }
    return 'Input successful';
  }
}

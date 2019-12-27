import {Injectable} from '@angular/core';
import {Class} from './types/Class';
import BUPT from './class-import-adapters/BUPT';

export interface ClassImportAdapter {
  name: string;
  maxDay: number;
  timeTable: string[];

  /**
   * @param dom Normally is Node body
   * @throws Error Any Exception
   */
  parse(dom: HTMLElement): Class[];
}

@Injectable({
  providedIn: 'root'
})
export class ClassImportService {

  constructor() {
  }

  public readonly defaultAdopter = new BUPT();

  public getAdopter(name: string): Promise<ClassImportAdapter> {
    return import('./class-import-adapters/BUPT').then(c => new c.default());
  }
}

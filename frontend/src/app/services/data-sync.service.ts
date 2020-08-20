import {Injectable, NgZone} from '@angular/core';

import * as AV from 'leancloud-storage';
import {padNumber} from '../../utils/functions';

@Injectable({
  providedIn: 'root'
})
export class DataSyncService {

  constructor(private zone: NgZone) {

  }

  public upload(type: string, data: object): Promise<string> {
    return AV.Cloud.run('upload', {type, data})
      .then(value => (padNumber(value, 6)))
      .catch(reason => reason.toString());
  }

  public download(type: string, code: string, callBack: ((object) => string | void)): Promise<string> {
    return AV.Cloud.run('getData', {type, code: +code}).then(value1 => {
      return this.zone.run(callBack, null, [value1]) || '同步成功';
    }).catch(reason => {
      return '同步出错:' + reason;
    });
  }
}

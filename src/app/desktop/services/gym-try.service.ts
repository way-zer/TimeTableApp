import {Injectable} from '@angular/core';
import {AES, enc} from 'crypto-js';
import {HttpClient} from '@angular/common/http';
import * as qs from 'qs';
import {Observable} from 'rxjs';

// const URL_ORDER = 'https://[2001:da8:215:4072:250:56ff:febe:569f]/newOrder.php'
const URL_ORDER = 'https://gym.yiban.bupt.link/newOrder.php';

// const URL_ORDER = 'https://postman-echo.com/post';


@Injectable({
  providedIn: 'root'
})
export class GymTryService {
  constructor(private http: HttpClient) {
  }

  private static encryptAES(data: string, key: string, iv: string) {
    const encrypted = AES.encrypt(data, enc.Utf8.parse(key), {
      iv: enc.Utf8.parse(iv)
    });
    return enc.Base64.stringify(encrypted.ciphertext);
  }

  private static genBlob(ekey: string, date: string, time: number, timeMill: number = (new Date()).getTime()): string {
    const raw = JSON.stringify({
      date,
      time,
      timemill: timeMill,
    });
    let oraw = '';
    for (let i = 0; i < raw.length; i++) {
      oraw += raw[i] + raw[raw.length - 1 - i];
    }
    ekey += ekey;
    return this.encryptAES(oraw, ekey.substring(0, 16), ekey.substring(2, 18));
  }

  public getRequest(SESS_ID: string, ekey: string, date: string, timeSolt: number) {
    return this.http.post(URL_ORDER, qs.stringify({blob: GymTryService.genBlob(ekey, date, timeSolt)}), {
      headers: {
        // 'UNSAFE_User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
        //   'Chrome/77.0.3865.75 Safari/537.36',
        UNSAFE_Origin: 'https://gym.yiban.bupt.link',
        UNSAFE_Referer: 'https://gym.yiban.bupt.link/new.php?time=' + timeSolt + '&date=' + date,
        UNSAFE_Cookie: 'PHPSESSID=' + SESS_ID,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Accept: '*/*',
        // 'UNSAFE_Host': 'gym.yiban.bupt.link',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }) as Observable<number>;
  }
}

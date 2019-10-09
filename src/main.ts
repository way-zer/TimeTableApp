import 'hammerjs';
import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {registerLocaleData} from '@angular/common';
import localeZh from '@angular/common/locales/zh';

if (environment.production) {
  enableProdMode();
}

registerLocaleData(localeZh, 'zh');
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

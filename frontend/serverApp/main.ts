import { enableProdMode } from '@angular/core';

import { environment } from '../src/environments/environment';

if (environment.production) {
  enableProdMode();
}

export { AppModule } from './app.module';

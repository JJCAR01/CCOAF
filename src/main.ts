import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment.development';
import { enableProdMode } from '@angular/core';


if (environment.production) {
    enableProdMode();
  }
  
  platformBrowserDynamic().bootstrapModule(AppModule)
    .then(() => console.log('Bootstrap success'))
    .catch(err => console.error(err));
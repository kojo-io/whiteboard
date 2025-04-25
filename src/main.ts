import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true
})
  .catch(err => console.error(err));

// Provide a minimal AMD loader for Monaco
(window as any).define = (window as any).define || {};
(window as any).require = (window as any).require || {
  toUrl: (p: string) => p,
};




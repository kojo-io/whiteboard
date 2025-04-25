// monaco-loader.service.ts
import { Injectable } from '@angular/core';

declare const monaco: any;


@Injectable({
  providedIn: 'root'
})
export class MonacoLoaderService {
  private loaded = false;

  public load(): Promise<void> {
    if (this.loaded) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      const onGotAmdLoader = () => {
        (window as any).require.config({
          paths: { vs: 'assets/vs' }
        });

        (window as any).require(['vs/editor/editor.main'], () => {
          this.loaded = true;
          resolve();
        });
      };

      if (!(window as any).require) {
        const loaderScript = document.createElement('script');
        loaderScript.type = 'text/javascript';
        loaderScript.src = 'assets/vs/loader.js';
        loaderScript.addEventListener('load', onGotAmdLoader);
        document.body.appendChild(loaderScript);
      } else {
        onGotAmdLoader();
      }
    });
  }
}

import {Injectable} from '@angular/core';
import {debounceTime, Subject, timer} from "rxjs";
import {NotificationInfo} from "./notification-info";
import {ComponentService} from "../component.service";

@Injectable()
export class NotificationService {
  $alert = new Subject<NotificationInfo>();
  alerts: NotificationInfo[] = [];
  removedAlert: NotificationInfo | undefined;
  clear = false;
  constructor() {
    this.$alert.subscribe({
      next: value => {
        this.alerts.unshift(value);
        if(value.duration) {
          timer(value.duration).subscribe({
            next: _ => {
              const findAlert = this.alerts.find(u => u == value);
              if (findAlert) {
                this.clearAlertItem(value);
              }
            }
          })
        }
      }
    })
  }

  notify(options: NotificationInfo) {
    options.id = ComponentService.uuid();
    if (!options.duration) {
      options.duration = 5000;
    }
    this.$alert.next(options);
  }

  clearAlertItem(alert: any) {
    this.clear = true;
    this.removedAlert = alert;
    timer(200).subscribe({
      next: _ => {
        this.alerts.splice(this.alerts.findIndex(u => u === alert), 1);
        this.clear = false;
      }
    })
  }
}



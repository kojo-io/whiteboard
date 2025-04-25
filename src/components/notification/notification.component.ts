import {Component, inject} from '@angular/core';
import {NotificationService} from "./notification.service";

@Component({
  selector: 'sc-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  service = inject(NotificationService);
}

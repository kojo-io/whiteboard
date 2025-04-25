import {Component, inject, ViewChild} from '@angular/core';
import {ModalService} from "../../../components/modal/modal.service";
import {ModalRef} from "../../../components/modal/modal-ref";
import {NotificationService} from "../../../components/notification/notification.service";
import {TestModalComponent} from "../test-modal/test-modal.component";
import {DrawerService} from "../../../components/drawer/drawer.service";
import {DrawerRef} from "../../../components/drawer/drawer-ref";

@Component({
  selector: 'app-button-component',
  templateUrl: './button-component.component.html',
  styleUrl: './button-component.component.css'
})
export class ButtonComponentComponent {
  myModal!: ModalRef;
  myDrawer!: DrawerRef;
  modalService = inject(ModalService);
  drawerService = inject(DrawerService);
  notificationService = inject(NotificationService);
  selected = 1;

  @ViewChild('formModal', { static: false }) formModal!: any;

  openModal = () => {
    this.myModal = this.modalService.open({
      content: this.formModal,
      width: 'custom'
    })
  }

  openLargeModal = () => {
    this.myModal = this.modalService.open({
      content: this.formModal,
      height: '80%',
      size: "large"
    })
  }

  openFullModal = () => {
    this.myModal = this.modalService.open({
      content: TestModalComponent,
      size: "fullscreen",
    });

    this.myModal.afterOpened$.subscribe({
      next: () => {
        alert('opened');
      }
    })
  }

  openDrawerModal = () => {
    this.myDrawer = this.drawerService.open({
      content: this.formModal,
      position: "right",
      backdropClose: true,
      width: '500px',
    });

    this.myDrawer.afterOpened$.subscribe({
      next: () => {

      }
    })
  }

  sendInfoNotification = () => {
    this.notificationService.notify({message: "As pointed out in the comments, if you want to avoid mutating your original array, you can use concat, which concatenates two or more arrays together. You can use this to functionally push a single element onto the front or back of an existing array; to do so, you need to turn the new element into a single element array.", type: 'info'})
  }

  sendSuccessNotification = () => {
    this.notificationService.notify({message: "Hello there! Success", type: 'success'})
  }

  sendDangerNotification = () => {
    this.notificationService.notify({message: "Hello there! Danger", type: 'danger'})
  }

  sendWarningNotification = () => {
    this.notificationService.notify({message: "Hello there! Warning", type: 'warning'})
  }
}

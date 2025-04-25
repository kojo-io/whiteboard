import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from './tab.component';
import { TabItemComponent } from './tab-item/tab-item.component';

@NgModule({
  declarations: [
    TabComponent,
    TabItemComponent
  ],
  exports: [
    TabComponent,
    TabItemComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TabModule { }

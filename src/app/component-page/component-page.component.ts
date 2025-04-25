import {Component, OnInit} from '@angular/core';
import {Menu} from "../../models/menu";

@Component({
  selector: 'app-component-page',
  templateUrl: './component-page.component.html',
  styleUrl: './component-page.component.css'
})
export class ComponentPageComponent implements OnInit {
  public menus: Array<Menu> = [
    {
      path: '/tabs',
      title: 'Tabs',
      icon: 'space_dashboard',
      expanded: false,
      children: []
    }
  ];

  collapse = true;

  collapseSide() {
    this.collapse = !this.collapse;
  }

  expandMenu(item: Menu, menu: Menu[]) {
    menu.forEach(u => {
      if (u != item) {
        u.expanded = false
      }
    });
    item.expanded = !item.expanded;
  }

  ngOnInit(): void {
    const getCurrentParent = this.menus.find((u: Menu) => u.path.includes(window.location.hash.split('#')[1].split('/')[1]));
    if (getCurrentParent && getCurrentParent.children.length > 0) {
      this.expandMenu(getCurrentParent, this.menus);
    }
  }
}

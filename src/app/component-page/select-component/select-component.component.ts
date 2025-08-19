import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { timer } from 'rxjs';

@Component({
  selector: 'app-select-component',
  templateUrl: './select-component.component.html',
  styleUrl: './select-component.component.css'
})
export class SelectComponentComponent implements OnInit {

  form = new FormGroup({
    select: new FormControl<number | null>(null),
    select2: new FormControl<number | null>(null)
  })

  data: any[] = [];
  selected = 0;
  displaySelected: any;

  selected2 = 4;

  finalList: any[] = [];

  newList: any[] = [
    {
      label: 'User ansnsns s sjsjsjs',
      value: 1
    },
    {
      label: 'Adminnsjsjsjs s ssjsjs',
      value: 2
    }
  ];

  list: any[] = [

  ]

  generateRandomRecord = () => {
    const names = ['John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Brown', 'Chris Davis'];
    const emails = ['gmail.com', 'yahoo.com', 'hotmail.com'];
    const phonePrefixes = ['020', '030', '054', '053', '024', '026', '027', '055', '023'];

    // Randomly select a name
    const name = names[Math.floor(Math.random() * names.length)];

    // Generate a random email
    const email = `${name.split(' ')[0].toLowerCase()}${Math.floor(Math.random() * 100)}@${emails[Math.floor(Math.random() * emails.length)]}`;

    // Generate a random phone number
    const phone = `${phonePrefixes[Math.floor(Math.random() * phonePrefixes.length)]}${Math.floor(1000000 + Math.random() * 9000000)}`;

    return { name, email, phone };
  };

  filter(item: any) {
    if (item) {
      this.list = this.finalList.filter(d => d.title.toLowerCase().includes(item.toLowerCase()));
    } else {
      this.list = this.finalList;
    }
  }

  ngOnInit(): void {
    this.form.patchValue({ select: 0, select2: 1});

    this.form.controls.select2.valueChanges.subscribe({
      next: (val) => {
        console.log('vv',val);
      }
    })
    this.finalList = this.list;
    this.getSelected(this.selected);
    for (let i = 0; i < 100; i++) {
      this.data = [...this.data, this.generateRandomRecord()];
    }

    timer(5000).subscribe({
      next: _ => {
        this.list = [
          {
            id: 0,
            icon: 'ri-arrow-left-up-fill',
            title: 'Zero'
          },
          {
            id: 1,
            icon: 'ri-corner-down-right-fill',
            title: 'One'
          },
          {
            id: 2,
            icon: 'ri-expand-width-fill',
            title: 'Two'
          },
          {
            id: 3,
            icon: 'ri-scroll-to-bottom-line',
            title: 'Three'
          },
          {
            id: 4,
            icon: 'ri-scroll-to-bottom-line',
            title: 'Three'
          },
          {
            id: 5,
            icon: 'ri-scroll-to-bottom-line',
            title: 'Three'
          },
          {
            id: 6,
            icon: 'ri-scroll-to-bottom-line',
            title: 'Three'
          }
        ]
      }
    })
  }

  getSelected(item: any) {
    this.displaySelected = this.list.find(d => d.id === item);
    console.log(item, this.displaySelected);
  }

  getDispSelected(item: any) {
    console.log(item);
  }
}

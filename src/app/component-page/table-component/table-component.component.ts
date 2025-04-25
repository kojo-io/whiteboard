import {Component, OnInit} from '@angular/core';
import {timer} from "rxjs";

@Component({
  selector: 'app-table-component',
  templateUrl: './table-component.component.html',
  styleUrl: './table-component.component.css'
})
export class TableComponentComponent implements OnInit {
  data: any[] = [];


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

  ngOnInit(): void {
    timer(5000).subscribe({
      next: _ => {
        for (let i = 0; i < 100; i++) {
          this.data = [...this.data, this.generateRandomRecord()];
        }
        console.log(this.data)
      }
    });
  }

}

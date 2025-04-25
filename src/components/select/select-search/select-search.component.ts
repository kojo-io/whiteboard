import {Component, EventEmitter, inject, Inject, OnInit, Output} from '@angular/core';
import {SelectService} from "../select.service";
import {distinctUntilChanged} from "rxjs";

@Component({
  selector: 'sc-select-search',
  templateUrl: './select-search.component.html',
  styleUrl: './select-search.component.css',
})
export class SelectSearchComponent implements OnInit{
  @Output() onChange = new EventEmitter();
  @Inject(SelectService) private service = inject(SelectService);
  searchData: any;

  filter(searchValue: string) {
    this.onChange.emit(searchValue);
  }

  ngOnInit(): void {
    this.service.clearSearch
      .pipe(distinctUntilChanged())
      .subscribe({
      next: (value) => {
        if (value) {
          this.searchData = '';
          this.onChange.emit(this.searchData);
          this.service.clearSearch.next(false);
        }
      }
    });
  }
}

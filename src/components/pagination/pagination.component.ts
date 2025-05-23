import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'sc-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() showPageLinks: boolean = true;
  @Input() showPageOptions: boolean = true;
  @Input() showCurrentPageInfo: boolean = false;
  @Input() currentPageInfoTemplate?: string;

  @Input() currentPageSize = 10;
  @Input() currentPage = 1;
  @Input() totalPages = 0;
  @Input() totalRecords = 0;

  @Input() first = 0;
  @Input() last = 0;
  @Input() pageSizeOptions: number[] = [10, 20, 30, 40, 50];

  @Output() onPageNumberChange = new EventEmitter<number>();
  @Output() onPageSizeChange = new EventEmitter<number>();

  private _pageIndex: number[] = [];
  displayPageIndex: number[] = [];
  pageReport = '';

  private cd = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.initializePagination(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['totalRecords'] ||
      changes['currentPage'] ||
      changes['currentPageSize']
    ) {
      this.initializePagination();
    }
  }

  initializePagination(emitInitial = false): void {
    this.calcPagination();
    if (emitInitial) {
      this.onPageNumberChange.emit(this.currentPage);
      this.onPageSizeChange.emit(this.currentPageSize);
    }
    this.cd.detectChanges();
  }

  nextPage = () => {
    if (this.totalPages > this.currentPage) {
      this.currentPage += 1;
      this.emitPageChange();
    }
  };

  previousPage = () => {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      this.emitPageChange();
    }
  };

  sizeChange = (event: number) => {
    this.currentPageSize = event;
    this.currentPage = 1;
    this.emitPageChange();
  };

  selectPage = (page: number) => {
    this.currentPage = page;
    this.emitPageChange();
  };

  emitPageChange(): void {
    this.calcPagination();
    this.onPageNumberChange.emit(this.currentPage);
    this.onPageSizeChange.emit(this.currentPageSize);
    this.cd.detectChanges();
  }

  private calcPagination(): void {
    this.totalPages = Math.ceil(this.totalRecords / this.currentPageSize);

    if (this.totalRecords > 0) {
      this.first = (this.currentPage - 1) * this.currentPageSize + 1;
      this.last = Math.min(this.totalRecords, this.currentPage * this.currentPageSize);
    } else {
      this.first = 0;
      this.last = 0;
    }

    // Page index generation
    this._pageIndex = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    // Dynamic slicing for compact page index display
    if (this.totalPages > 5) {
      if (this.currentPage <= 3) {
        this.displayPageIndex = this._pageIndex.slice(0, 5);
      } else if (this.currentPage + 2 >= this.totalPages) {
        this.displayPageIndex = this._pageIndex.slice(-5);
      } else {
        const start = this.currentPage - 3;
        this.displayPageIndex = this._pageIndex.slice(start, start + 5);
      }
    } else {
      this.displayPageIndex = this._pageIndex;
    }

    // Current page info report
    if (this.currentPageInfoTemplate) {
      this.pageReport = this.currentPageInfoTemplate.replace(
        /{first}|{last}|{totalRecords}|{currentPage}|{currentPageSize}|{totalPages}/g,
        (match) => {
          switch (match) {
            case '{first}': return `${this.first}`;
            case '{last}': return `${this.last}`;
            case '{totalRecords}': return `${this.totalRecords}`;
            case '{totalPages}': return `${this.totalPages}`;
            case '{currentPage}': return `${this.currentPage}`;
            case '{currentPageSize}': return `${this.currentPageSize}`;
            default: return match;
          }
        }
      );
    }
  }
}

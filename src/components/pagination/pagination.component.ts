import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input, OnChanges, OnInit,
  Output, SimpleChanges
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
  @Input() currentPageSize = 10
  @Input() currentPage = 1;
  @Input() totalPages = 0;
  @Input() totalRecords = 0;
  @Input() first = 0;
  @Input() last = 0;
  @Input() pageSizeOptions: number[] = [10, 20, 30, 40, 50];
  @Output() onPageNumberChange = new EventEmitter();
  @Output() onPageSizeChange = new EventEmitter();

  private _pageIndex: any[] = [];
  displayPageIndex: any[] = [];
  pageReport = '';

  private cd= inject(ChangeDetectorRef);

  nextPage = () => {
    if (this.totalPages > this.currentPage) {
      this.currentPage += 1;
      this.calcPagination();
      this.cd.detectChanges();
      this.onPageNumberChange.emit(this.currentPage)
    }
  }

  previousPage = () => {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      this.calcPagination();
      this.cd.detectChanges();
      this.onPageNumberChange.emit(this.currentPage)
    }
  }

  sizeChange = (event: number) => {
    this.currentPageSize = event;
    this.calcPagination();
    this.cd.detectChanges();
    this.onPageSizeChange.emit(this.currentPageSize);
  }

  selectPage = (event: number) => {
    this.currentPage = event;
    this.calcPagination();
    this.cd.detectChanges();
    this.onPageNumberChange.emit(this.currentPage)
  }

  private calcPagination = () => {
    this.totalPages = Math.ceil(this.totalRecords / this.currentPageSize);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    if (this.totalRecords > 0) {
      if (this.currentPage === 1) {
        this.first = 1;
        this.last = this.currentPageSize > this.totalRecords ? this.totalRecords : this.currentPageSize;
      } else {
        this.first = (this.currentPage * this.currentPageSize) - this.currentPageSize + 1;
        const endCount  = (this.first + this.currentPageSize) - 1;
        this.last = endCount > this.totalRecords ? this.totalRecords : endCount;
      }
    } else {
      this.first = 0;
      this.last = 0;
    }

    this._pageIndex = [];
    for (let i = 0; i < this.totalPages; i++) {
      this._pageIndex.push(i+1);
    }

    if (this.totalPages > 5) {
      if (this.currentPage < 5) {
        this.displayPageIndex = this._pageIndex.slice(0,5);
      } else {
        const finalPageNumber = this.currentPage+2;
        if (finalPageNumber > this.totalPages) {
          this.displayPageIndex = this._pageIndex.slice(this._pageIndex.length - 5, this.totalPages);
        } else {
          this.displayPageIndex = this._pageIndex.slice(finalPageNumber - 5, finalPageNumber);
        }
      }
    } else {
      this.displayPageIndex = this._pageIndex;
    }

    if (this.currentPageInfoTemplate) {
      this.pageReport = this.currentPageInfoTemplate;
      this.pageReport = this.pageReport?.replace(/{first}|{last}|{totalRecords}|{currentPage}|{currentPageSize}|{totalPages}/g, (match) => {
        switch (match) {
          case '{first}':
            return `${this.first}`;
          case '{last}':
            return `${this.last}`;
          case '{totalRecords}':
            return `${this.totalRecords}`;
          case '{totalPages}':
            return `${this.totalPages}`;
          case '{currentPage}':
            return `${this.currentPage}`;
          case '{currentPageSize}':
            return `${this.currentPageSize}`;
          default:
            return match;
        }
      });
    }
  }

  ngOnInit(): void {
    this.currentPage = 1;
    this.calcPagination();
    this.cd.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.calcPagination();
    this.cd.detectChanges();
  }
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'sc-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() currentPage = 1;
  @Input() currentPageSize = 10;
  @Input() pageSizeOptions: number[] = [10, 20, 30, 40];
  @Input() showPagination = true;
  @Input() externalPagination = false;
  @Input() paginationPosition: 'top' | 'bottom' = 'bottom';

  mainData: any[] = [];
  totalPages = 0;
  first = 0;
  last = 0;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['currentPage'] || changes['currentPageSize']) {
      this.updatePagination();
    }
  }

  updatePagination(): void {
    if (this.data?.length) {
      this.totalPages = Math.ceil(this.data.length / this.currentPageSize);
      const start = (this.currentPage - 1) * this.currentPageSize;
      const end = start + this.currentPageSize;
      this.mainData = this.data.slice(start, end);
      this.first = start + 1;
      this.last = Math.min(end, this.data.length);
    } else {
      this.mainData = [];
      this.first = this.last = this.totalPages = 0;
    }
    this.cd.markForCheck();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  onPageSizeChange(size: number): void {
    this.currentPageSize = size;
    this.currentPage = 1; // Reset to first page
    this.updatePagination();
  }

  sort(field: string, order: 'asc' | 'dsc' = 'asc'): void {
    const comparator = (a: any, b: any) => this.compareValues(a, b, field, order);
    this.data.sort(comparator);
    this.updatePagination();
  }

  sortNumber(field: string, order: 'asc' | 'dsc' = 'asc'): void {
    const comparator = (a: any, b: any) => this.compareValues(a, b, field, order, true);
    this.data.sort(comparator);
    this.updatePagination();
  }

  private compareValues(a: any, b: any, field: string, order: 'asc' | 'dsc', isNumeric = false): number {
    const aValue = this.getValue(a, field);
    const bValue = this.getValue(b, field);

    if (isNumeric) {
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    } else {
      return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
  }

  private getValue(item: any, field: string): any {
    return field.split('.').reduce((acc, key) => acc?.[key], item);
  }
}

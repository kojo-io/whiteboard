import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { PaginationComponent } from "../pagination/pagination.component";

@Component({
  selector: 'sc-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit, OnChanges {
  @ViewChild('tablePaginate', { static: false }) paginate?: PaginationComponent;

  @Input() data: any[] = [];
  @Input() fullScreen = false;
  @Input() usePagination = false;
  @Input() border = false;
  @Input() rounded = false;
  @Input() shadow = false;
  @Input() showPageLinks = true;
  @Input() showPageOptions = true;
  @Input() showCurrentPageInfo = false;
  @Input() currentPageInfoTemplate?: string;
  @Input() pageSizeOptions: number[] = [10, 20, 30, 40, 50];
  @Input() paginationPosition: 'top-left' | 'top-right' | 'top-center' | 'bottom-center' | 'bottom-left' | 'bottom-right' = 'top-right';
  @Input() currentPage = 1;
  @Input() currentPageSize = 10;
  @Input() totalPages = 0;

  cd = inject(ChangeDetectorRef);
  mainData: any[] = [];
  first = 0;
  last = 0;

  ngOnInit(): void {
    this.calcPagination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.calcPagination();
  }

  calcPagination(): void {
    if (this.usePagination && this.paginate) {
      const { first, last, currentPageSize } = this.paginate;
      this.first = first === 0 ? 1 : first;
      this.last = last > currentPageSize ? last + 1 : currentPageSize;

      this.mainData = this.data.slice(this.first - 1, this.last);
    } else {
      this.mainData = [...this.data];
      this.first = 1;
      this.last = this.mainData.length;
    }
    this.cd.detectChanges();
  }

  pageNumberChangeEvent(event: number): void {
    this.currentPage = event;
    this.calcPagination();
  }

  pageSizeChangeEvent(event: number): void {
    this.currentPageSize = event;
    this.calcPagination();
  }

  sort(field: string, order: 'asc' | 'dsc' = 'asc'): void {
    const comparator = (a: any, b: any) => this.compareValues(a, b, field, order);
    this.data.sort(comparator);
    this.calcPagination();
  }

  sortNumber(field: string, order: 'asc' | 'dsc' = 'asc'): void {
    const comparator = (a: any, b: any) => this.compareValues(a, b, field, order, true);
    this.data.sort(comparator);
    this.calcPagination();
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

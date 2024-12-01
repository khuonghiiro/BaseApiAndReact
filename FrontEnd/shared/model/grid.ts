import { ReactNode } from 'react';
export interface IGridViewHeaderProps {
  className?: string;
  ActionBar?: any;
  AdvanceFilter?: any;
  keySearch?: string;
  handleChange?: (event: any, data: any) => void;
  isWrapper?: boolean;
  placeholder?: string;
  isNotQuickSearch?: boolean;
  isNoneQuickSearch?: boolean;
  isNotTextAdvanceFilter?: boolean;
  textHeader?: ReactNode;
  children?: any;
  meta?: any;
  isNotFixAdvanceFilter?: boolean;
}
export interface IGridViewProps {
  title?: string;
  handleChange?: (data: any) => void;
  loading?: boolean;
  children?: ReactNode;
}
export interface IPaginationProps {
  page: number;
  page_size: number;
  total: number;
  pageSizeOptions: any[];
  handleChange: (data: any) => void;
}
export interface ITableProps {
  services?: any;
  className?: string; // thay đổi class của table
  data: any[]; // data danh sách của table
  sort?: any;
  keyExtractor: (data: any) => number | string; // key của data
  noSelected?: boolean;
  //option của pagination
  page: any;
  page_size: any;
  total: any;
  pageSizeOptions?: any[];
  handleChange?: (data: any) => void;
  children?: any;
  mutate?: any;
}
export interface IColumnProps {
  className?: string; // thay đổi class của column    
  title: string; // title của column
  body?: (data: any) => any; // body của column
  sortKey?: string; // key để sort
  children?: any;
  style?: any;
  filterName?: string; // thay đổi class của column
  typeColumn?: any;
  filterOption?: any;
  isShowFilter?: any;
  editLine?: any;
  dataOld?: any;
  hidden?: boolean;
}
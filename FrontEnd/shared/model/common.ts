import { ReactNode } from "react";
export interface Meta {
  page?: number;
  page_size?: number;
  sort?: any;
  filter?: any;
  search?: string;
}
export interface IFormProps {
  show: boolean;
  action: string;
  id?: any | null;
  onClose: (isRefresh: boolean) => void;
}
export interface IFormPropExtends {
  show: boolean;
  action: string;
  id?: any | null;
  customId?: any | null;
  onClose: (isRefresh: boolean) => void;
  onSetTab: (isSetTab: number) => void;
}
export interface IModal {
  size: string;
  show: boolean;
  loading: boolean;
  children?: ReactNode;
}
export interface IFormSelectProps {
  id?: string;
  name?: string;
  className?: string;
  inlineSearchInput?: boolean;
  size?: string;
  keepTreeOnSearch?: boolean;
  keepChildrenOnSearch?: boolean;
  isValid?: boolean;
  isInvalid?: boolean;
  value?: any;
  onChange?: any;
  onBlur?: any;
  mode?: "multiSelect" | "simpleSelect" | "radioSelect" | "hierarchical";
  data?: any[];
  placeholder?: string;
}

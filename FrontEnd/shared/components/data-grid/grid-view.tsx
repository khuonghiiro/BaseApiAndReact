'use client'
import { useContext, ReactNode, useState, createContext } from "react";
import { findByType } from "../../../lib/find-by-type";
import { Loading } from "../LoadingComponent";
import { Table } from "./table";
import { GridHeader } from "./grid-header";
import { IGridViewProps } from "../../model";
export const GridView = ({
  handleChange,
  title,
  loading = false,
  children,
}: IGridViewProps) => {
  const contextValue = useContext(GridViewContext);
  const [isAdvSearchOpen, setIsAdvSearchOpen] = useState(false);

  const handleToggleAdvBtn = () => {
    setIsAdvSearchOpen(!isAdvSearchOpen);
  };
  const renderTable = () => {
    // eslint-disable-next-line react/prop-types

    // First we try to find the Title sub-component among the children of Article
    const table = findByType(children, Table);

    // If we don’t find any we return null
    if (!table) {
      return null;
    }
    // Else we return the children of the Title sub-component as wanted
    return table;
  };
  const renderHeader = () => {
    // eslint-disable-next-line react/prop-types
    // First we try to find the Title sub-component among the children of Article
    const header = findByType(children, GridHeader);
    // If we don’t find any we return null
    if (!header) {
      return null;
    }
    // Else we return the children of the Title sub-component as wanted
    return header;
  };
  return (
    <>
      {
        title && <div className="flex text-base font-bold text-turquoise-400 my-2 uppercase">{title}</div>
      }

      <GridViewContext.Provider value={{ gridViewHandleChange: handleChange }}>
        <div className="relative bg-white overflow-x-auto shadow-xl sm:rounded-lg">
          {renderHeader()}
          {renderTable()}
          <Loading loading={loading} />
        </div>
      </GridViewContext.Provider>
    </>
  );
};

GridView.Table = Table;
GridView.Header = GridHeader;

export const GridViewContext = createContext({});

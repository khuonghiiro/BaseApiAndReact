"use client";
import React, { useState, useRef, Children, useContext } from "react";
// import { useState, useRef, Children, useContext, React } from "react";
import { Pagination } from "./grid-pagination";
import { GridViewContext } from "./grid-view";
import { defaultGrid } from "../../../public/app-setting";
import { IColumnProps, ITableProps } from "../../model";
import { IoMdArrowDropup } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import ToggleVisibility from "./toggleVisibility";
import { toast } from "react-toastify";
import Select2 from "react-select";
import { NumberSchema } from "yup";
// import EditableLabel from "react-inline-editing";//react-inline-editing

export const Column = ({
  className,
  title,
  body,
  sortKey,
  children,
  isShowFilter,
  typeColumn,
  filterName,
  filterOption,
  editLine,
  dataOld,
  hidden = false,
}: IColumnProps) => {
  return <> </>;
};

export const Table = ({
  className,
  data,
  sort,
  keyExtractor,
  noSelected,
  page,
  page_size,
  total,
  pageSizeOptions = defaultGrid.pageSizeOptions,
  handleChange,
  children,
  services,
  mutate,
}: ITableProps) => {
  const contextValue = useContext(GridViewContext);
  const [Sort, setSort] = useState(sort || {});
  const [selected, setSelected] = useState<any[]>([]);
  const tbodyRef = useRef<HTMLTableSectionElement>(null);
  const [editSelect, setEditSelect] = useState<any>();
  const [editBoolean, setEditBoolean] = useState(false);

  const handleCheckAll = (checked: any, contextValue: any) => {
    let select = selected;
    const textinputs =
      tbodyRef.current != null
        ? tbodyRef.current.querySelectorAll(
          ".grid-selected input[type=checkbox]"
        )
        : null;
    let inputCanXL = [].filter.call(
      textinputs,
      function (el: HTMLInputElement) {
        return el.checked !== checked;
      }
    );
    inputCanXL.forEach((item: any) => {
      item.checked = checked;
      if (checked) {
        select[item.value] = checked;
      } else {
        delete select[item.value];
      }
    });
    setSelected(select);
    processHanleChange("changeSelected", { selected: selected }, contextValue);
  };
  const handleCheckItem = (key: any, checked: any, contextValue: any) => {
    let select = selected;
    if (checked) {
      select[key] = checked;
      setSelected(select);
      processHanleChange(
        "changeSelected",
        { selected: selected },
        contextValue
      );
    } else {
      delete select[key];
      setSelected(select);
      processHanleChange(
        "changeSelected",
        { selected: selected },
        contextValue
      );
    }
  };

  const handleSort = (sortKey: any, contextValue: any) => {
    const nsort: any[] = [];
    let typeSort = Sort[sortKey];
    if (typeSort) {
      typeSort = typeSort === "asc" ? "desc" : "asc";
    } else {
      typeSort = "asc";
    }
    nsort[sortKey] = typeSort;
    setSort(nsort);
    processHanleChange("changeSort", { sort: nsort }, contextValue);
  };

  const processHanleChange = (event: any, data: any, contextValue: any) => {
    if (handleChange) {
      handleChange({ event: event, data: data });
    }
    if (contextValue && contextValue.gridViewHandleChange) {
      contextValue.gridViewHandleChange({ event: event, data: data });
    }
  };
  const onResetColum = (column: any) => {
    processHanleChange("resetColumn", { filter: column }, contextValue);
  };

  const onBlurEditData = async (e: any, old: any) => {
    let id = e.target.attributes.columntitle?.nodeValue;
    let values = {
      id: e.target.attributes.columntitle?.nodeValue,
      column: e.target.attributes.filterName?.nodeValue,
      value: e.target.innerText,
    };
    if (id && old.props.children != e.target.innerText) {
      try {
        await services.updateField(id, values);
        toast.success("Cập nhật thành công");
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
    }
  };

  const onClickEditSelect = (e: any, value: any) => {
    setEditSelect(value);
  };

  const onClickEditBoolean = (e: any, value: any) => {
    setEditBoolean(value);
  };

  const hanlechangeBoolean = async (e: any, value: any) => {
    let id = editBoolean;
    let values = {
      id: editBoolean,
      column: e.target.name,
      value: e.target.checked,
    };
    if (id) {
      try {
        await services.updateField(id, values);
        await mutate();
        toast.success("Cập nhật thành công");
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
      setEditBoolean(false);
    }
  };

  const hanlechangeSelect = async (
    e: any,
    value: any,
    columnName: any,
    rowId: any
  ) => {
    let id = rowId;
    let values = {
      id: rowId,
      column: columnName,
      value: e.value,
    };
    if (id) {
      try {
        await services.updateField(id, values);
        await mutate();
        toast.success("Cập nhật thành công");
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
      setEditSelect(null);
    }
  };

  return (
    <>
      <table
        className={[
          "text-sm text-left text-black dark:text-gray-400 mx-2 table-striped table-hover w-[-webkit-fill-available]",
          className,
        ].join(" ")}
      >
        <thead className="text-xs text-white uppercase bg-header-grid">
          <tr>
            {!noSelected && (
              <th
                scope="col"
                className="p-4 border text-center border-slate-300"
              >
                <div className="flex items-center grid-selected">
                  <input
                    id={`checkbox-all-search`}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onChange={(ev) => {
                      handleCheckAll(ev.currentTarget.checked, contextValue);
                    }}
                  />
                  <label htmlFor={`checkbox-all-search}`} className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
            )}
            {Children.map(children, (child, key) => {
              // eslint-disable-next-line no-unused-vars
              if (child.type.name === Column.name) {
                const {
                  title,
                  className,
                  sortKey,
                  style,
                  typeColumn,
                  filterName,
                  filterOption,
                  isShowFilter,
                  hidden,
                } = child.props;

                return !hidden ? (
                  <th
                    key={key}
                    scope="col"
                    className={[
                      "px-3 py-1 border text-center border-slate-300",
                      className,
                    ].join(" ")}
                    style={style}
                  >
                    <div
                      className={`flex items-center ${Sort[sortKey]} item-hover component-container`} style={{ justifyContent: 'space-between' }}
                    >
                      <span>{title}</span>
                      {!!sortKey && (
                        <>
                          <span
                            onClick={() => {
                              handleSort(sortKey, contextValue);
                            }}
                          >
                            <span
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <IoMdArrowDropup className="asc-icon -mb-3" size="20" />
                              <IoMdArrowDropdown className="desc-icon" size="20" />
                            </span>
                          </span>
                          {isShowFilter && <span style={{ marginLeft: "auto" }}>
                            <ToggleVisibility
                              onReset={onResetColum}
                              column={sortKey}
                              title={title}
                              typeColumn={typeColumn}
                              filterName={filterName}
                              filterOption={filterOption}
                            ></ToggleVisibility>
                          </span>}

                        </>
                      )}
                    </div>
                  </th>
                ) : (
                  ""
                );
              }
            })}
          </tr>
        </thead>
        <tbody ref={tbodyRef}>
          {Number(total) > 0 ? (
            <>
              {Array.isArray(data) &&
                data.map((item: any, index: any) => {
                  return (
                    <tr
                      id={`row-id-${keyExtractor({ item, index }) || index}`}
                      className={`${selected[keyExtractor({ item, index })]
                        ? "selected"
                        : ""
                        } ${item?.checkconent ? "activeitem" : ""
                        } bg-white border-b`}
                      key={keyExtractor({ item, index }) || index}
                    >
                      {!noSelected && (
                        <td className="w-4 p-3 border border-slate-300">
                          {!item.hideCheck && (
                            <div className="flex items-center grid-selected">
                              <input
                                value={keyExtractor({ item, index })}
                                id={
                                  keyExtractor({ item, index }) !== undefined
                                    ? keyExtractor({ item, index }).toString()
                                    : index.toString()
                                }
                                onChange={(ev) => {
                                  handleCheckItem(
                                    ev.currentTarget.value,
                                    ev.currentTarget.checked,
                                    contextValue
                                  );
                                }}
                                type="checkbox"
                                checked={
                                  selected[keyExtractor({ item, index })]
                                    ? true
                                    : false
                                }
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                              <label
                                htmlFor="checkbox-table-search-1"
                                className="sr-only"
                              >
                                checkbox
                              </label>
                            </div>
                          )}
                        </td>
                      )}
                      {Children.map(children, (child, key) => {
                        // eslint-disable-next-line no-unused-vars
                        if (child.type.name === Column.name) {
                          const {
                            // eslint-disable-next-line no-unused-vars
                            title,
                            className,
                            body,
                            // eslint-disable-next-line no-unused-vars
                            sortKey,
                            filterName,
                            typeColumn,
                            parents,
                            editLine,
                            filterOption,
                          } = child.props;
                          return (
                            <td
                              style={{ cursor: "pointer" }}
                              //contentEditable={editLine}
                              onBlur={(e) => {
                                onBlurEditData(e, body({ item, index }));
                              }}
                              title={item.id}
                              data-filter-name={filterName}
                              key={key}
                              className={[
                                "px-3 py-[7px] border border-slate-300",
                                className,
                              ].join(" ")}
                            >
                              {(() => {
                                if (typeColumn == "text") {
                                  return body({ item, index });
                                } else if (typeColumn == "select") {
                                  if (editSelect === item.id) {
                                    return (
                                      <Select2
                                        name={filterName}
                                        options={filterOption}
                                        id={item.id}
                                        defaultValue={item.parentJson}
                                        onChange={(e: any) => {
                                          hanlechangeSelect(
                                            e,
                                            body({ item, index }),
                                            filterName,
                                            item.id
                                          );
                                        }}
                                      />
                                    );
                                  } else {
                                    return (
                                      <span
                                        onClick={(e) => {
                                          onClickEditSelect(e, item.id);
                                        }}
                                      >
                                        {body({ item, index })}{" "}
                                      </span>
                                    );
                                  }
                                } else if (typeColumn == "boolean") {
                                  if (editBoolean === item.id) {
                                    return (
                                      <>
                                        <input
                                          type="checkbox"
                                          defaultChecked={
                                            item.isShow ? true : false
                                          }
                                          name={filterName}
                                          onChange={(e) => {
                                            hanlechangeBoolean(
                                              e,
                                              body({ item, index })
                                            );
                                          }}
                                        />{" "}
                                        Hiển thị
                                      </>
                                    );
                                  } else {
                                    return (
                                      <span
                                        onClick={(e) => {
                                          onClickEditBoolean(e, item.id);
                                        }}
                                      >
                                        {body({ item, index })}{" "}
                                      </span>
                                    );
                                  }
                                } else {
                                  return body({ item, index });
                                }
                              })()}
                            </td>
                          );
                        }
                      })}
                    </tr>
                  );
                })}
            </>
          ) : (
            <tr>
              {noSelected ? (
                <td
                  colSpan={
                    Array.isArray(children)
                      ? children.filter((x) => !Array.isArray(x)).length +
                      children
                        .filter((x) => Array.isArray(x))
                        .reduce((total, arg) => total + arg.length, 0)
                      : null
                  }
                  className="items-center h-10 border border-slate-300"
                  style={{ textAlign: "center" }}
                >
                  Không có dữ liệu
                </td>
              ) : (
                <td
                  colSpan={
                    Array.isArray(children)
                      ? children.filter((x) => !Array.isArray(x)).length +
                      children
                        .filter((x) => Array.isArray(x))
                        .reduce((total, arg) => total + arg.length, 0) +
                      1
                      : null
                  }
                  className="items-center h-10 border border-slate-300"
                  style={{ textAlign: "center" }}
                >
                  Không có dữ liệu
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table>
      {page_size > 0 ? (
        <Pagination
          page={page}
          page_size={page_size}
          total={total}
          pageSizeOptions={pageSizeOptions}
          handleChange={(res) => {
            processHanleChange(res.event, res.data, contextValue);
          }}
        ></Pagination>
      ) : (
        <span className="p-2">
          Tổng số <b>{total}</b> bản ghi
        </span>
      )}
    </>
  );
};

Table.displayName = "Table";
Table.Column = Column;

import React from "react";
const Pagination = (props) => {
    const handlePagination = (current: number) => {
        props.pagination(current);
    };

    return (
        <div className="flex justify-center">
            <nav className='py-4' aria-label="Page navigation example">
                <ul className="inline-flex -space-x-px text-base h-10">
                    <li className="page-item">
                        <a
                            className={`page-link flex items-center justify-center px-3 h-10 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white  ${props.current === 1 ? "disabled" : props.current > 1 ? "" : ""
                                }`}
                            href="javascript:;"
                            onClick={() => handlePagination(props.current - 1)}
                        >
                            <span className="sr-only">Previous</span>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                            </svg>
                        </a>
                    </li>
                    {props.total < 7 ? (
                        <>
                            {Array.apply(0, Array(props.total)).map((arr, i) => (
                                <>
                                    <li
                                        key={i}
                                        className={`page-item ${props.current === i + 1 ? "active" : ""
                                            }`}
                                    >
                                        <a
                                            className="page-link flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                            href="javascript:;"
                                            onClick={() => handlePagination(i + 1)}
                                        >
                                            {i + 1}
                                        </a>
                                    </li>
                                </>
                            ))}
                        </>
                    ) : props.current % 5 >= 0 &&
                        props.current > 4 &&
                        props.current + 2 < props.total ? (
                        <>
                            <li className="page-item">
                                <a
                                    className="page-link flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    href="javascript:;"
                                    onClick={() => handlePagination(1)}
                                >
                                    1
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled" href="javascript:;">
                                    ...
                                </a>
                            </li>
                            <li className="page-item">
                                <a
                                    className="page-link flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    href="javascript:;"
                                    onClick={() => handlePagination(props.current - 1)}
                                >
                                    {props.current - 1}
                                </a>
                            </li>
                            <li className="page-item active">
                                <a aria-current="page"
                                    className="page-link flex items-center justify-center px-3 h-10 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                                    href="javascript:;"
                                    onClick={() => handlePagination(props.current)}
                                >
                                    {props.current}
                                </a>
                            </li>
                            <li className="page-item">
                                <a
                                    className="page-link flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    href="javascript:;"
                                    onClick={() => handlePagination(props.current + 1)}
                                >
                                    {props.current + 1}
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled" href="javascript:;">
                                    ...
                                </a>
                            </li>
                            <li className="page-item">
                                <a
                                    className="page-link flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    href="javascript:;"
                                    onClick={() => handlePagination(props.total)}
                                >
                                    {props.total}
                                </a>
                            </li>
                        </>
                    ) : props.current % 5 >= 0 &&
                        props.current > 4 &&
                        props.current + 2 >= props.total ? (
                        <>
                            <li className="page-item">
                                <a
                                    className="page-link flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    href="javascript:;"
                                    onClick={() => handlePagination(1)}
                                >
                                    1
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled" href="javascript:;">
                                    ...
                                </a>
                            </li>
                            <li
                                className={`page-item ${props.current === props.total - 3 ? "active" : ""
                                    }`}
                            >
                                <a
                                    className="page-link flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    href="javascript:;"
                                    onClick={() => handlePagination(props.total - 3)}
                                >
                                    {props.total - 3}
                                </a>
                            </li>
                            <li
                                className={`page-item ${props.current === props.total - 2 ? "active" : ""
                                    }`}
                            >
                                <a
                                    className="page-link flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    href="javascript:;"
                                    onClick={() => handlePagination(props.total - 2)}
                                >
                                    {props.total - 2}
                                </a>
                            </li>
                            <li
                                className={`page-item ${props.current === props.total - 1 ? "active" : ""
                                    }`}
                            >
                                <a
                                    className="page-link flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    href="javascript:;"
                                    onClick={() => handlePagination(props.total - 1)}
                                >
                                    {props.total - 1}
                                </a>
                            </li>
                            <li
                                className={`page-item ${props.current === props.total ? "active" : ""
                                    }`}
                            >
                                <a
                                    className="page-link flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    href="javascript:;"
                                    onClick={() => handlePagination(props.total)}
                                >
                                    {props.total}
                                </a>
                            </li>
                        </>
                    ) : (
                        <>
                            {Array.apply(0, Array(5)).map((arr, i) => (
                                <>
                                    <li
                                        className={`page-item ${props.current === i + 1 ? "active" : ""
                                            }`}
                                        key={i}
                                    >
                                        <a
                                            className="page-link flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                            href="javascript:;"
                                            onClick={() => handlePagination(i + 1)}
                                        >
                                            {i + 1}
                                        </a>
                                    </li>
                                </>
                            ))}
                            <li className="page-item">
                                <a className="page-link flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled" href="javascript:;">
                                    ...
                                </a>
                            </li>
                            <li className="page-item">
                                <a
                                    className="page-link flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    href="javascript:;"
                                    onClick={() => handlePagination(props.total)}
                                >
                                    {props.total}
                                </a>
                            </li>
                        </>
                    )}
                    <li className="page-item">
                        <a
                            className={`page-link flex items-center justify-center px-3 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${props.current === props.total
                                ? "disabled"
                                : props.current < props.total
                                    ? ""
                                    : ""
                                }`}
                            href="javascript:;"
                            onClick={() => handlePagination(props.current + 1)}
                        >
                            <span className="sr-only">Next</span>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                            </svg>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Pagination;

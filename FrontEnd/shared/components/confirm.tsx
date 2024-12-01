import { useEffect, useState, useContext } from "react";
import { IoMdClose } from "react-icons/io";
import { Subject } from "rxjs";

const confirmationSubject = new Subject();

export function confirm(
  message: string,
  onConfirm: {
    (): Promise<void>;
    (): Promise<void>;
    (): Promise<void>;
    (): Promise<void>;
    (): Promise<void>;
    (): Promise<void>;
  },
  classYes?: string,
) {
  confirmationSubject.next({ message, onConfirm, classYes });
}
export default function ConfirmationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState(() => {});
  const [classNameYes, setClassNameYes] = useState("");

  useEffect(() => {
    const subscription = confirmationSubject.subscribe((params: any) => {
      setIsOpen(true);
      setMessage(params.message);
      setOnConfirm(() => params.onConfirm);
      setClassNameYes(params.classYes);
    });
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    onConfirm();
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <>
          <div className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full justify-center items-start flex">
            <div className="relative w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button
                  type="button"
                  className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                  data-modal-hide="popup-modal"
                  onClick={handleCancel}
                >
                  <IoMdClose className="w-5 h-5" viewBox="0 0 20 20" />
                </button>
                <div className="p-6 text-center">
                  <svg
                    aria-hidden="true"
                    className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <h3 className="mb-5 text-base font-normal text-gray-500 dark:text-gray-400">
                    {message}
                  </h3>
                  <button
                    data-modal-hide="popup-modal"
                    type="button"
                    className={`${classNameYes} text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2`}
                    onClick={handleConfirm}
                  >
                    Đồng ý
                  </button>
                  <button
                    data-modal-hide="popup-modal"
                    type="button"
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    onClick={handleCancel}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            modal-backdrop=""
            className="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40"
          ></div>
        </>
      )}
    </>
  );
}

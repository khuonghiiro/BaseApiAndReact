import { ReactNode } from "react";
import { MdClose } from "react-icons/md";
export const ModalHeader = ({
  onClose,
  children,
}: {
  onClose: (isRefresh: boolean) => void;
  children?: ReactNode;
}) => {
  return (
    <>
      <div className="flex items-center justify-between p-2 bg-header-grid border-b rounded-t dark:border-gray-600">
        <h3 className="text-xl font-medium text-white dark:text-white">
          {children}
        </h3>
        <button
          type="button"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
          data-modal-hide="large-modal"
          onClick={() => {
            onClose(false);
          }}
        >
          <MdClose className="w-5 h-5 text-black" viewBox="0 0 20 20" />

          <span className="sr-only">Close modal</span>
        </button>
      </div>
    </>
  );
};
ModalHeader.displayName = "header";

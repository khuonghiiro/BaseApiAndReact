import { ReactNode} from 'react';
export const ModalFooter = ({onClose,children}:{onClose: (isRefresh: boolean) => void,children?: ReactNode}) => {
    return (
        <>
         <div className="flex items-center justify-end p-3 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
         {children}
            
            <button
              data-modal-hide="large-modal"
              type="button"
              className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              onClick={() => {
                onClose(true);
              }}
            >
              Thoát
            </button>
          </div>
          </>
    );
  };
  ModalFooter.displayName = 'footer';
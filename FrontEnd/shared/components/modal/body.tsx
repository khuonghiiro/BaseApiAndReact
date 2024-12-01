
import { ReactNode} from 'react';
export const ModalBody = ({nameClass,children}:{nameClass?: string,children?: ReactNode}) => {
    return (
        <>
        <div className={`p-6 gap-4 grid ${nameClass}`}>
            {children}
          </div>
          </>
    );
  };
  ModalBody.displayName = 'body'
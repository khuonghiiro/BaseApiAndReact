import { Fragment, useCallback, useEffect, useState } from "react";
import PopupMessage from "./popup-message";
import { Transition } from "@headlessui/react";
import { usePopupMsgContext } from "./popup-msg-provider";
import { useAuth } from "@/shared/Context/appAdminContext";

// ----- cách dùng -----
// const [userId, setUserId] = useState<number>(0);

// const onClickUser = (selectUser: any) => {
//     setUserId(selectUser.createdUserId);
// }

// return (
//     <>
//         <div
//             className="mr-2"
//             onClick={() => onClickUser(id user truyền vào)}>
//         </div>
//         <ImportMessagegPopup selectUserId={userId} />
//     </>

// );

// Chỉ dùng cho khi muốn mở popup message thì sẽ không forcus vào được input tương ứng
function ImportMessagegPopup({ selectUserId }: { selectUserId: number }) {
    const { openPopups, setOpenPopups, onActiveUserId, handleRemoveUserPopup } = usePopupMsgContext();
    const [fullName, setFullName] = useState("");
    const [userId, setUserId] = useState<number>(0);
    const { logout, user } = useAuth();

    useEffect(() => {
        setFullName(user.fullName);
        setUserId(user.idTaiKhoan);

        return () => {
            
          };
    }, [user]);

    useEffect(() => {
        if (selectUserId !== 0 && selectUserId !== userId) {
            onActiveUserId(selectUserId);
        }
    }, [selectUserId]);

    const handleRemovePopup = useCallback((userIdToRemove: number) => {
        handleRemoveUserPopup(userIdToRemove);
      }, []);

    return (
        <>
            {(selectUserId !== 0 && userId !== selectUserId) &&

                openPopups.map((popup, index) => (
                    <Transition
                        as={Fragment}
                        show={true}
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                        key={popup.userId}
                    >
                        <div className={`fixed bottom-0 shadow-lg z-30`}
                            style={{ right: `${index * 320 + (index + 1) * 30}px` }}
                        >
                            <PopupMessage
                                selectUserId={popup.userId}
                                chatUserId={popup.chatUserId}
                                userLoginId={userId}
                                fullName={fullName}
                                onClickClose={() => handleRemovePopup(popup.userId)}
                                isVisible={true}
                                openPopups={openPopups}
                                setOpenPopups={setOpenPopups}
                                forceFocus={popup.forceFocus}
                            />
                        </div>
                    </Transition>
                ))

            }

        </>
    );
}

export default ImportMessagegPopup;
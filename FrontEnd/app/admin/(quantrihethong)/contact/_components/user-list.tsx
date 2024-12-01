import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { User, ChatUser, Contact } from '@/shared/model';
import { FaEnvelope, FaAddressBook } from 'react-icons/fa';
import { AuthService } from '@/shared/services';
const TabContacts = React.lazy(() => import('./tab-contacts'));
const TabListUsers = React.lazy(() => import('./tab-list-users'));

interface UserListProps {
    userLoginId: number | null;
    onActiveUserId: (userId: number) => void;
    setIsVisible: (isVisible: boolean) => void; // Thêm prop setIsVisible
    tabHeight: number;
    isVisible: boolean;
}

export const UserList: React.FC<UserListProps> = ({ userLoginId, onActiveUserId, setIsVisible, tabHeight, isVisible }) => {
    const [activeTab, setActiveTab] = useState(0); // 0 cho TabContent, 1 cho TabContact
    const [activeUserId, setActiveUserId] = useState<number | null>(null);
    const { getOauth } = AuthService();
    const [isShowUsers, setIsShowUsers] = useState(true);

    useEffect(() => {
        const auth = getOauth();
        if (!auth) return;

        if (auth.unitCode && auth.unitCode.includes('04')) {
            setIsShowUsers(false);
        }

    }, []);

    const handleSelectUser = useCallback((selectUserObj: User) => {
        setActiveUserId(selectUserObj.idTaiKhoan);
        onActiveUserId(selectUserObj.idTaiKhoan ?? 0);

        // Đóng UserList khi chọn user
        setIsVisible(false);
    }, [onActiveUserId]);

    const handleSelectContact = useCallback((selectContactObj: Contact) => {

        const newActiveUserId = selectContactObj.userFirstId == userLoginId ?
            selectContactObj.userSecondId ??
            null :
            selectContactObj.userFirstId;

        setActiveUserId(newActiveUserId ?? 0);
        onActiveUserId(newActiveUserId ?? 0);

        // Đóng UserList khi chọn contact
        setIsVisible(false);

    }, [onActiveUserId]);

    // useEffect(() => {
    //     // Kiểm tra isVisible, nếu không cần thiết, unmount component
    //     if (!isVisible) {
    //         return () => setIsVisible(false);
    //     }
    // }, [isVisible]);

    const Loading = () => (
        <div className="text-center">
            <h5>Loading...</h5>
        </div>
    )

    return (
        <div className='h-full'>
            <div className="flex border-b bg-white text-[12px] h-[55px]">
                <button
                    className={`flex-1 text-center py-2 items-center justify-center flex flex-col ${activeTab === 0 ? 'text-blue-500 border-b-2 border-blue-500 ' : ''}`}
                    onClick={() => setActiveTab(0)}
                >
                    <FaEnvelope size={16} />
                    <div>Trò chuyện</div>
                </button>
                {isShowUsers && <button
                    className={`flex-1 text-center py-2 items-center justify-center flex flex-col ${activeTab === 1 ? 'text-blue-500 border-b-2 border-blue-500 ' : ''}`}
                    onClick={() => setActiveTab(1)}
                >
                    <FaAddressBook size={16} />
                    <div>Danh bạ</div>
                </button>
                }

            </div>
            <Suspense fallback={<Loading />}>
                {activeTab === 0 && <TabContacts
                    activeUserId={activeUserId}
                    onSelectContact={handleSelectContact}
                    userLoginId={userLoginId}
                    tabHeight={tabHeight}
                />}
                {activeTab === 1 && isShowUsers && <TabListUsers
                    activeUserId={activeUserId}
                    userLoginId={userLoginId}
                    onSelectUser={handleSelectUser}
                    tabHeight={tabHeight}
                />}
            </Suspense>

        </div>
    );
};

import React, { useState, useEffect, useRef } from 'react';
import { User } from '@/shared/model';
import useInfiniteScroll from '../use-infinite-scroll';
import { userServices } from '../../users/services';

interface TabContactProps {
    userLoginId: number | null;
    onSelectUser: (userObj: User) => void;
    activeUserId: number | null;
    tabHeight: number;
}

const TabListUsers: React.FC<TabContactProps> = React.memo(({ userLoginId, onSelectUser, activeUserId, tabHeight }) => {
    const scrollRefContact = useRef<HTMLDivElement>(null);
    const [activeRowUserId, setActiveRowUserId] = useState<number | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isInit, setInit] = useState(true);
    const [containerHeight, setContainerHeight] = useState<number>(0); // State for container height

    useEffect(() => {
        const loadUsers = async () => {
            const fetchedUsers = await userServices.getListUsers(userLoginId ?? 0, page);
            if (fetchedUsers.length === 0) {
                setHasMoreData(false);
            } else {
                if (isInit) {
                    setUsers([...fetchedUsers]);
                    setInit(false);
                } else {
                    setUsers(prev => [...prev, ...fetchedUsers]);
                }
            }
        };

        if (hasMoreData) {
            loadUsers();
        }
    }, [page]);

    useEffect(() => {
        const handleResize = () => {
            const topBarHeight = 55; // Độ cao của top bar
            setContainerHeight(tabHeight - topBarHeight);
        };
        handleResize(); // Khi component được render lần đầu tiên
        window.addEventListener("resize", handleResize); // Thêm event listener để lắng nghe sự thay đổi kích thước cửa sổ
        return () => window.removeEventListener("resize", handleResize); // Cleanup khi component bị unmount
    }, []);

    const loadMoreUsers = async () => {
        if (!hasMoreData) return;
        setPage(prevPage => prevPage + 1);
    };

    const [isFetching] = useInfiniteScroll({ scrollRef: scrollRefContact, fetchData: loadMoreUsers, hasMoreData: hasMoreData });

    const handleSelectUser = (userObj: User) => {
        onSelectUser(userObj);
        setActiveRowUserId(userObj.idTaiKhoan);
    };

    const categorizeUsersByAlphabet = (users: User[]) => {
        const categorized: Record<string, User[]> = {};
        users.forEach(user => {
            const firstLetter = user.fullName[0].toUpperCase();
            if (!categorized[firstLetter]) {
                categorized[firstLetter] = [];
            }
            categorized[firstLetter].push(user);
        });
        return categorized;
    };

    const categorizedUsers = categorizeUsersByAlphabet(users);

    // kiểm tra xem nó có nằm trong danh sách không
    const isHasUser = (userId: number) => {

        let isCheckInit: boolean = false;

        if (userId === activeRowUserId) {
            return true;
        }

        if ((activeUserId != null &&
            activeUserId != 0 &&
            (userId == activeUserId) && !isCheckInit)
        ) {
            return true;
        }

        return false;
    }

    return (
        <div ref={scrollRefContact} className="p-0 bg-white w-full overflow-y-auto"
            style={{ height: containerHeight }}>
            {Object.keys(categorizedUsers).sort().map(letter => (
                <div key={letter}>
                    <div className="px-2 py-2 font-bold text-[10px] text-slate-500">{letter}</div>
                    {categorizedUsers[letter].map(user => (
                        <div
                            key={user.idTaiKhoan}
                            className={`flex flex-col py-0.5 pr-0.5 cursor-pointer ${isHasUser(user.idTaiKhoan) ? 'bg-[#c7edfc]' : 'hover:bg-[#dcf1fa]'}`}
                            onClick={() => handleSelectUser(user)}
                        >
                            <div className="flex w-full py-1 pl-2">
                                <div className="flex items-center justify-center px-1">
                                    <img src="/user.jpg" alt="profile picture" className="w-10 h-10 rounded-full" />
                                </div>
                                <div className="flex items-center justify-center px-1">
                                    <div className="truncate">{user.fullName}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
            {isFetching && <div>Loading more users...</div>}
        </div>
    );
}, (prevProps, nextProps) => {
    // Return true to prevent re-render, false to allow re-render
    return prevProps.userLoginId === nextProps.userLoginId && prevProps.activeUserId === nextProps.activeUserId;
});

export default TabListUsers;

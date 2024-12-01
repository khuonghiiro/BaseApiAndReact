import React, { createContext, useState, useContext, ReactNode } from 'react';

interface PopupType {
  userId: number;
  chatUserId: number | null;
  forceFocus: boolean;
}

interface PopupContextProps {
  openPopups: PopupType[]; // Định nghĩa PopupType nếu cần
  setOpenPopups: React.Dispatch<React.SetStateAction<PopupType[]>>;
  onActiveUserId: (userId: number, chatUserId?: number | null) => void;
  handleRemoveUserPopup: (userId: number) => void;
}

const PopupMsgContext = createContext<PopupContextProps | undefined>(undefined);

export const usePopupMsgContext = () => {
  const context = useContext(PopupMsgContext);
  if (!context) {
    throw new Error('usePopupMsgContext must be used within a PopupMsgProvider');
  }
  return context;
};

export const PopupMsgProvider = ({ children }: { children: ReactNode }) => {
  const [openPopups, setOpenPopups] = useState<{ userId: number; chatUserId: number | null; forceFocus: boolean }[]>([]);

  const onActiveUserId = (userId: number, chatUserId: number | null = null) => {
    const existingPopup = openPopups.find(popup => popup.userId === userId);
    if (existingPopup) {
      setOpenPopups(openPopups.map(popup =>
        popup.userId === userId ? { ...popup, chatUserId, forceFocus: true } : popup
      ));
    } else if (openPopups.length >= 3) {
      setOpenPopups([...openPopups.slice(1), { userId, chatUserId, forceFocus: true }]);
    } else {
      setOpenPopups([...openPopups, { userId, chatUserId, forceFocus: true }]);
    }
  };

  const handleRemoveUserPopup = (userId: number) => {
    setOpenPopups(currentPopups => currentPopups.filter(popup => popup.userId !== userId));
  };

  return (
    <PopupMsgContext.Provider value={{ openPopups, setOpenPopups, onActiveUserId, handleRemoveUserPopup }}>
      {children}
    </PopupMsgContext.Provider>
  );
};
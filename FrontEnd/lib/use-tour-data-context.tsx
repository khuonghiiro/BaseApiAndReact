import React, { createContext, useContext, useState, useEffect } from 'react';

// Định nghĩa context
const TourDataContext = createContext<any>(null);

// Tạo một provider component
export const TourDataProvider = ({ children, initialData }: { children: React.ReactNode, initialData: any }) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    // Bạn có thể thêm logic để tải dữ liệu từ API hoặc các nguồn khác ở đây
    setData(initialData);
  }, [initialData]);

  return (
    <TourDataContext.Provider value={data}>
      {children}
    </TourDataContext.Provider>
  );
};

// Custom hook để sử dụng context
export const useTourDataContext = () => {
  return useContext(TourDataContext);
};

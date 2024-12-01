import { Button, Dropdown } from 'antd';
import React, { useRef } from 'react';

export const ChooseFile = ({ onChange }: {
  onChange?: (vl: any) => void;
}) => {
  // const onClick = ({ key }: any) => {
  //   onChange && onChange(key);
  // };
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    // Khi nút button được nhấp, kích hoạt việc chọn file
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: any) => {
    // Lấy đường dẫn của file từ sự kiện onChange
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Lấy ra đường dẫn tệp tin trên máy tính
      const filePath = selectedFile.name;

      alert(filePath);
    }


  };
  return (
    <>
      <Button type="primary" style={{
        height: '36px',
        padding: '5px 10px',
        backgroundColor: '#4096ff'
      }}
        onClick={handleButtonClick} >{`{x}`}</Button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>

  );
};

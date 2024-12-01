import { Button, Dropdown } from 'antd';
import React from 'react';

export const DropDownVariable = ({ items, onChange }: {
  items: any[];
  onChange?: (vl: any) => void;
}) => {
  const onClick = ({ key }: any) => {
    onChange && onChange(key);
  };
  return (
    <Dropdown menu={{
      items: items?.map((x: any) => {
        x.label = x.key;
        return x;
      }), onClick
    }} placement="bottom" >
      <Button type="primary" style={{
        height: '36px',
        padding: '5px 10px',
        backgroundColor: '#4096ff'
      }}>{`{x}`}</Button>
    </Dropdown >
  );
};

import React from 'react';
import * as BsIcons from 'react-icons/bs';

// Khai báo BsIcons với index signature
const icons: { [key: string]: React.ComponentType } = BsIcons;

function NumberedIcon({ number, color = '#d31111' }: { number: number, color?: string }) {
  if (number === 0) {
    return <span></span>;
  }

  let numberText: string = number + '';

  if (number > 99) {
    numberText = '99+';
  }

  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      style={{ fontWeight: "900" ,borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: color }}
    >
      <circle cx="8" cy="8" r="8" fill={color} /> {/* Cập nhật màu ở đây */}
      <text x="50%" y="50%" dy=".3em" textAnchor="middle" fill="#fff" fontSize="8">{numberText}</text>
    </svg>
  );
}

export default NumberedIcon;

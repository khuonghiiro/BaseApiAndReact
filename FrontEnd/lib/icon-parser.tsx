import React from 'react';
import { Element } from 'html-react-parser';
import * as FaIcons from 'react-icons/fa6';
import * as AiIcons from 'react-icons/ai';
import * as MdIcons from 'react-icons/md';

// Định nghĩa kiểu cho thư viện biểu tượng
type IconLibrary = { [key: string]: React.ElementType };

// Tạo đối tượng key-value từ các thư viện icon
const createIconMap = (iconLibrary: IconLibrary): IconLibrary => {
  return Object.keys(iconLibrary).reduce((acc: IconLibrary, iconName: string) => {
    const lowerCaseName = iconName.toLowerCase();
    acc[lowerCaseName] = iconLibrary[iconName];
    return acc;
  }, {});
};

// Tạo map cho từng thư viện
const faIconMap = createIconMap(FaIcons);
const aiIconMap = createIconMap(AiIcons);
const mdIconMap = createIconMap(MdIcons);

// Gộp tất cả các map lại thành một map
const iconMap: IconLibrary = { ...faIconMap, ...aiIconMap, ...mdIconMap };

// Định nghĩa một hàm để tải biểu tượng đồng bộ từ thư viện
const loadIconSync = (iconName: string): React.ElementType | null => {
  const lowerCaseName = iconName.toLowerCase();
  return iconMap[lowerCaseName] || null;
};

// Định nghĩa kiểu cho domNode
interface DomNode {
  type: string;
  name?: string;
  attribs?: { [key: string]: string };
}

// Hàm thay thế biểu tượng trong cây DOM
export const replaceIcons = (domNode: DomNode): string | Element | null => {
  if (domNode.type === 'tag' && domNode.name) {
    const node = domNode as Element;
    const IconComponent = loadIconSync(node.name);
    
    if (IconComponent) {
      // Trả về thành phần biểu tượng thay thế
      return (
        <IconComponent className={node.attribs?.class} />
      ) as unknown as Element; // Ép kiểu sang Element
    }
  }
  return null;
};

// Ví dụ sử dụng
// const result = parse(data?.textHtml ?? '', { replace: replaceIcons });

import { ApiUrl } from '@/public/app-setting';
import React, { lazy, useEffect, useState } from 'react';
import { MdFileDownload, MdRemoveRedEye } from 'react-icons/md';

const ShowFileModal = lazy(() => import('./show-file-modal'));

interface FileRendererProps {
  fileData: any;
}

const ShowFileAttachment: React.FC<FileRendererProps> = ({ fileData }) => {
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const [parsedFileData, setParsedFileData] = useState<any>([]);

  useEffect(() => {
    try {
      const parsedData = typeof fileData === 'string' ? JSON.parse(fileData) : fileData;
      setParsedFileData(Array.isArray(parsedData) ? parsedData : [parsedData]);
    } catch (error) {
      console.error('Failed to parse fileData:', error);
      setParsedFileData([]);
    }
  }, [fileData]);

  const downloadTypes = ["doc", "docx", "xls", "xlsx"];
  const downloadTypeImages = ["png", "jpg", "jpeg"];
  const downloadTypePdf = ["pdf"];

  const docTypes = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  const excelTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const pdfTypes = [
    "application/pdf"
  ];

  const imageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif"
  ];

  const docAndExcelTypes = [...docTypes, ...excelTypes];

  const GetImageLabel = (itemFile: any) => {

    if (itemFile && excelTypes.includes(itemFile.type)) {
      return "/excel.png";
    }
    else if (itemFile && docTypes.includes(itemFile.type)) {
      return "/doc.png";
    }
    else if (itemFile && pdfTypes.includes(itemFile.type)) {
      return "/pdf.png";
    }

    return (ApiUrl + "fileupload/api/file/" + itemFile.guiid);
  }

  const isShowViewOnBrower = (type: any) => {
    if (type && docAndExcelTypes.includes(type)) {
      return false;
    }

    return true;
  }

  const handleFileClick = (itemFile: any) => {
    if (itemFile && docAndExcelTypes.includes(itemFile.type)) {
      const link = document.createElement('a');
      link.href = ApiUrl + "fileupload/api/file/download/" + itemFile.guiid;
      link.download = 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    else if (itemFile && pdfTypes.includes(itemFile.type)) {
      const link = document.createElement('a');
      
      link.href = ApiUrl + "fileupload/api/file/download/" + itemFile.guiid;
      link.download ='download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // window.open(`${ApiUrl}${url}`, '_blank');
    }
    else {
      window.open((ApiUrl + "fileupload/api/file/" + itemFile.guiid), '_blank');
    }
  };

  const handleFileClickShowBrower = (itemFile: any) => {
    window.open(`${ApiUrl}fileupload/api/file/${itemFile.guiid}`, '_blank');
  };

  const handleFileClickView = (file: any) => {
    setSelectedFile(file);
  };

  const shortText = (fileName: string, length: any) => {
    const fileType = fileName.split('.').pop()?.toLowerCase();

    const typeAll = [...downloadTypeImages, ...downloadTypes];
    if (fileType && typeAll.includes(fileType)) {
      const fileExtension = `.${fileType}`;
      const baseName = fileName.slice(0, fileName.length - fileExtension.length);
      if (baseName.length > length) {
        return baseName.slice(0, length) + ".." + fileExtension;
      } else {
        return baseName + fileExtension;
      }
    } else {
      return '';
    }
  }

  return (
    <>
      {parsedFileData.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {parsedFileData.map((item: any, index: number) => (
            <div
              key={index}
              className="relative w-[100px] h-[100px] border border-blue-500 border-dashed m-0 mb-1 mr-1 p-1"
            >
              <img
                src={GetImageLabel(item)}
                alt={item?.title}
                className="w-full h-full object-fill"
              />
              <p className="text-[12px] mt-1 whitespace-nowrap" title = {item?.title}>{shortText(item?.title, 10)}</p>
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                {
                  isShowViewOnBrower(item?.type) ?
                    <>
                      <div title="Nhấn để xem" className="cursor-pointer">
                        <button
                          className="bg-white text-blue rounded-lg px-2 py-1 m-1"
                          onClick={() => handleFileClickShowBrower(item)}
                        >
                          <MdRemoveRedEye color="#1c64f2" />
                        </button>
                      </div>
                    </> :
                    <>
                      <div title="Nhấn để tải" className="cursor-pointer">
                        <button
                          className="bg-white text-blue rounded-lg px-2 py-1 m-1"
                          onClick={() => handleFileClick(item)}
                        >
                          <MdFileDownload color="#808c3f" />
                        </button>
                      </div>
                      <div title="Nhấn để xem" className="cursor-pointer">
                        <button
                          className="bg-white text-blue rounded-lg px-2 py-1 m-1"
                          onClick={() => handleFileClickView(item)}
                        >
                          <MdRemoveRedEye color="#1c64f2" />
                        </button>
                      </div>
                    </>
                }

              </div>
            </div>
          ))}
        </div>
      )}
      {selectedFile && (
        <ShowFileModal
          isShow={!!selectedFile}
          isLoading={false}
          onClose={() => setSelectedFile(null)}
          file={selectedFile}
        />
      )}
    </>
  );
}

export default ShowFileAttachment;

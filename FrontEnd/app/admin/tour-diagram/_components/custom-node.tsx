'use client'
import React from 'react';
import dynamic from 'next/dynamic';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { MdEditSquare } from 'react-icons/md';
import { RiFileCopy2Fill } from 'react-icons/ri';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import parse from 'html-react-parser';
import { ApiUrl } from '@/public/app-setting';
import { tourGuideNodeServices } from '../../tourguidenode/services';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { confirm } from '@/shared/components/confirm';
import { TbClick } from 'react-icons/tb';
import { replaceIcons } from '@/lib/icon-parser';

const CustomNode = ({ id, data, onEditClick, isView }: any) => {
  const { addNodes, getNodes, setNodes, setEdges, fitBounds } = useReactFlow();
  const getRandomOffset = (min: any, max: any) => Math.floor(Math.random() * (max - min + 1)) + min;

  const duplicateNode = () => {
    const nodeToCopy = getNodes().find((node) => node.id === id);
    if (!nodeToCopy) return;

    const newId = uuidv4();
    const newPosition = {
      x: nodeToCopy.position.x + getRandomOffset(50, 300),
      y: nodeToCopy.position.y + getRandomOffset(20, 450)
    };

    const newNode = {
      ...nodeToCopy,
      id: newId,
      position: newPosition,
      data: { ...nodeToCopy.data, isClone: true, stepIndex: 0 },
      selected: false  // Đảm bảo node nhân bản không được chọn ban đầu
    };

    addNodes(newNode);

    // Scroll to the duplicated node
    fitBounds({ x: newPosition.x, y: newPosition.y, width: 200, height: 200 }, { duration: 800 });
  };

  const deleteNode = async () => {
    if (isView) return;

    await del(id);
  };

  const del = async (delId: any) => {
    confirm("Bạn có chắc chắn muốn xóa?", async () => {
      try {
        await tourGuideNodeServices.del(delId);
        toast.success("Xóa thành công");

        setNodes((nds) => nds.filter((node) => node.id !== delId));
        setEdges((eds) => eds.filter((edge) => edge.source !== delId && edge.target !== delId));
        // await mutate();
      } catch (err) {
        toast.error("Xóa thất bại");
      }
    });
  };

  const onEdit = () => {
    if (isView) return;
    onEditClick(id);
  };

  const getLinkImage = (fileData: any) => {
    const parsedData = typeof fileData === 'string' ? JSON.parse(fileData) : fileData;

    return ApiUrl + "fileupload/api/file/" + parsedData[0]?.guiid;
  }

  return (
    <div className="custom-node">
      {/* <div className={`flex justify-between items-center p-1.5 w-[100px] border-none !bg-green-500 text-white rounded-t-lg`}>
        <div className="flex-grow font-bold">
          <h2>{data.stepTitle}</h2>
        </div>
      </div> */}
      <div className={`custom-node p-4 pt-0 border border-gray-300 ${data?.isShow ? 'bg-white' : 'bg-gray-400'} rounded-lg shadow-md`}>

        <div className={`flex justify-between items-center rounded-t-lg border-none p-1.5 w-[250px] ${(data?.isShow ? (data.bgColor ? data.bgColor : (data.isClone ? '!bg-green-400' : '!bg-orange-500')) : 'bg-gray-400')} text-white`}>
          <div className={`flex items-center ${isView ? 'text-center' : 'text-left'} font-bold `}>
            <h2>Bước {data?.stepIndex ?? '1'}</h2>
            {data?.isClickElem &&
              <TbClick color='black' className='ml-1' />
            }
          </div>
          {!isView &&
            <div className={`flex items-center space-x-2`}>
              <>
                <div title='Chỉnh sửa'>
                  <button
                    type='button'
                    className="text-white"
                    onClick={onEdit}
                  >
                    <MdEditSquare size={25} />
                  </button>
                </div>
                {/* <div title='Nhân bản'>
              <button
                type='button'
                className="text-white"
                onClick={duplicateNode}
              >
                <RiFileCopy2Fill size={25} />
              </button>
            </div> */}
                <div title='Xóa'>
                  <button
                    type='button'
                    className="text-white"
                    onClick={deleteNode}
                  >
                    <AiOutlineCloseCircle size={25} />
                  </button>
                </div>
              </>

            </div>
          }

        </div>
        <div className="text-center">
          <h1>{data.title ?? ''}</h1>
          {(data?.attachment && data?.attachment !== "[]") &&
            <>
              <img
                src={getLinkImage(data?.attachment)}
                alt={data?.attachment?.title ?? ''}
                className="!mx-auto w-[50%]"
              />
            </>
          }
        </div>
        {data?.isHtml ?
          parse(data?.textHtml ?? '')
          :
          <div className="prose prose-sm mx-auto max-w-full" dangerouslySetInnerHTML={{ __html: data?.content ?? '' }} />
        }

      </div>

      {/* Nhiều đầu vào */}
      <Handle className='target-input-add' type="target" position={Position.Left} id="input-1" style={{ top: '50%' }} />
      {/* <Handle className='target-input-add' type="target" position={Position.Left} id="input-2" />
      <Handle className='target-input-add' type="target' position={Position.Right} id="input-3" style={{ top: '30%' }} /> */}
      {/* <Handle type="target' position={Position.Right} id="input-4" style={{ top: '70%' }} /> */}

      {/* Nhiều đầu ra */}
      <Handle className='source-output-add' type="source" position={Position.Right} id="output-1" style={{ top: '50%' }} />
      {/* <Handle className='source-output-add' type="source' position={Position.Right} id="output-2" /> */}
      {/* <Handle title='Nhân bản' className='source-copy-node' type="source" position={Position.Left} id="copy-node" /> */}
      {/* <Handle type="source' position={Position.Right} id="output-4" style={{ top: '70%' }} /> */}
    </div>
  );
};

export default CustomNode;

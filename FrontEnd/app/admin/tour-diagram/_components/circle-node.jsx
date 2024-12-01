import React from 'react';
import { Handle, Position } from '@xyflow/react';


const CircleNode = ({ data }) => {

  return (
    <div className="circle-node text-[18px] text-center p-0 border border-gray-300 rounded-full shadow-md !bg-[#008000] text-white">

      <label>{data.label}</label>

      {/* Nhiều đầu ra */}
      <Handle className='source-output-circle' type="source" position={Position.Right} id="output-1" style={{ top: '50%' }} />
    </div>
  );
};

export default CircleNode;

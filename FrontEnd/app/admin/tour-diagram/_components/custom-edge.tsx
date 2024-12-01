'use client'
import React from 'react';
import { getBezierPath, getSmoothStepPath } from '@xyflow/react';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  arrowHeadType,
  markerEnd = 'url(#arrowhead)',
  onEdgeClick,
  isView
}: any) => {
  const edgePathGenerator = data && data.edgeType === 'step' ? getSmoothStepPath : getBezierPath;

  const [edgePath, labelX, labelY] = edgePathGenerator({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const labelPosition = 0.7;
  const labelPositionX = sourceX + (targetX - sourceX) * labelPosition;
  const labelPositionY = sourceY + (targetY - sourceY) * labelPosition;

  const onDelete = (event: any) => {
    if (isView) return;
    event.stopPropagation();
    onEdgeClick(id);
  };

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
      />
      {!isView &&
        <g transform={`translate(${labelX},${labelY})`}>
          <foreignObject width={40} height={40} x={-20} y={-20} style={{ pointerEvents: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
              <button type='button' className='px-2 py-1 bg-red-600 text-white rounded-full' style={{ pointerEvents: 'all' }} onClick={onDelete}>
                Xóa
              </button>
            </div>
          </foreignObject>
        </g>
      }

      {/* <g transform={`translate(${labelPositionX},${labelPositionY})`}>
        <rect x="-30" y="-10" width="60" height="25" fill="white" stroke="black" rx="5" ry="5" />
        <text x="0" y="0" fill="black" fontSize="14" textAnchor="middle" dominantBaseline="central">
          {data?.stepIndex ?? '0'}
        </text>
      </g> */}
    </>
  );
};

export default CustomEdge;

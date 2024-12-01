
import { Handle, Position } from 'reactflow';
export const StartNode=({ data, isConnectable }) => {
    return (
      <>
        <div>
          Start
        </div>
        <Handle
          type="source"
          position={Position.Right}
          style={{  backgroundColor: '#00e676' }}
          isConnectable={isConnectable}
        />
      </>
    );
  };
  export const EndNode=({ data, isConnectable }) => {
    return (
      <>
        <Handle
          type="target"
          position={Position.Left}
          style={{  backgroundColor: '#00e676' }}
          onConnect={(params) => console.log('handle onConnect', params)}
          isConnectable={isConnectable}
        />
        <div>
        {data.label}
        </div>
      </>
    );
  };
  export const LoopNode=({ data, isConnectable }) => {
    return (
      <>
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: '#00e676' }}
          onConnect={(params) => console.log('handle onConnect', params)}
          isConnectable={isConnectable}
        />
        <Handle
          type="target"
          position={Position.Bottom}
          style={{ bottom: -3, left:'70%', background: '#c7a71a' }}
          id="I"
          onConnect={(params) => console.log('handle onConnect', params)}
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ bottom: -3, left:'30%', background: '#c7a71a' }}
          id="O"
          onConnect={(params) => console.log('handle onConnect', params)}
          isConnectable={isConnectable}
        />
        <div tilte={data.label} className="custom-node-text">
        {data.label}
        </div>
        <Handle
          type="source"
          position={Position.Right}
          id="T"
          style={{ top: 8, background: '#00e676' }}
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="F"
          style={{ bottom: 3, top:'auto', background: '#f50057' }}
          isConnectable={isConnectable}
        />
      </>
    );
  };
  export const CustomNode=({ data, isConnectable}) => {
    return (
      <>
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: '#00e676' }}
          onConnect={(params) => console.log('handle onConnect', params)}
          isConnectable={isConnectable}
        />
        <div tilte={data.label} className="custom-node-text">
        {data.label}
        </div>
        <Handle
          type="source"
          position={Position.Right}
          id="T"
          style={{ top: 4, background: '#00e676' }}
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="F"
          style={{ bottom: '0px', top:'auto', background: '#f50057' }}
          isConnectable={isConnectable}
        />
      </>
    );
  };
  export const VariablesNode=({ data, isConnectable }) => {
    return (
      <>
        <div>
          (x) Variables
        </div>
      </>
    );
  };
  export const StyleStart = {
    border: '1px solid green',
    backgroundColor: 'green',
    color: 'white',
    padding: 5,
    borderRadius: '50%',
    fontSize: '8px',
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width:'30px',
    height:'30px',
  };
  export const StyleEnd = {
    border: '1px solid red',
    backgroundColor: 'red',
    color: 'white',
    padding: 5,
    borderRadius: '50%',
    fontSize: '8px',
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width:'30px',
    height:'30px',
  };
  export const StyleLoop = {
    border: '1px solid #00b0ff',
    backgroundColor: '#00b0ff',
    color: 'white',
    padding: 5,
    borderRadius: '50%',
    fontSize: '8px',
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width:'35px',
    height:'35px',
  };
  export const StyleDefault = {
    border: '1px solid #00b0ff',
    backgroundColor: '#00b0ff',
    color: 'white',
    padding: 5,
    borderRadius: '2px',
    fontSize: '8px',
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width:'60px',
    height:'20px',
    //overflow: 'hidden'
  };
  export const StyleVariables = {
    border: '1px solid #c7a71c',
    backgroundColor: '#c7a71c',
    color: 'white',
    padding: 5,
    borderRadius: '2px',
    fontSize: '8px',
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width:'70px',
    height:'30px',
  };

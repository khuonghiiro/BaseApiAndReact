// DiagramIndex.tsx
'use client';
import React, { useCallback, useRef, useState, useEffect, useMemo, useReducer } from 'react';
import { GiDiagram } from "react-icons/gi";
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    MiniMap,
    Controls,
    Background,
    BackgroundVariant,
    useViewport,
    useReactFlow,
    Node,
    Edge,
    Connection,
    XYPosition,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../diagram-style.css';
import CustomNode from './custom-node';
import CircleNode from './circle-node';
import CustomEdge from './custom-edge';
import { toast } from 'react-toastify';
import { tourGuideNodeServices } from '../../tourguidenode/services';
import { DefaulPer, DefaultMeta } from '@/public/app-setting';
import { getPermisson, INITIAL_STATE_LIST, listReducer } from '@/lib';
import { v4 as uuidv4 } from 'uuid';
import { Loading } from '@/shared/components/LoadingComponent';
import { AiOutlineNodeExpand } from 'react-icons/ai';
import { IoAnalyticsOutline } from 'react-icons/io5';
import { FaDiagramNext } from 'react-icons/fa6';

const initialNodes: Node[] = [
    {
        id: 'start-id',
        type: 'circleNode',
        data: { label: 'Bắt đầu', stepIndex: 0 },
        position: { x: 250, y: 250 },
    },
];

const initialEdges: Edge[] = [];

const recalculateSteps = (nodes: Node[], edges: Edge[]): Node[] => {
    const newNodes = [...nodes];
    const stepMap: { [key: string]: number } = {};

    newNodes.forEach(node => {
        stepMap[node.id] = node.id === 'start-id' ? 1 : 0;
    });

    const calculateStep = (nodeId: string, currentStep: number) => {
        stepMap[nodeId] = Math.max(stepMap[nodeId], currentStep);
        const outgoingEdges = edges.filter(edge => edge.source === nodeId);
        outgoingEdges.forEach(edge => {
            calculateStep(edge.target, currentStep + 1);
        });
    };

    calculateStep('start-id', 0);

    return newNodes.map(node => ({
        ...node,
        data: {
            ...node.data,
            stepIndex: stepMap[node.id]
        }
    }));
};

// Hàm để duyệt qua các edges và nodes, tìm các nodes kết nối từ `start-id`
const getConnectedNodes = (nodes: Node[], edges: Edge[]) => {
    const result = [];
    const visited = new Set<string>();
    const queue = ['start-id'];

    while (queue.length) {
        const currentId = queue.shift();
        if (!currentId || visited.has(currentId)) continue;
        visited.add(currentId);

        const currentNode = nodes.find(node => node.id === currentId);
        if (currentNode && currentNode.id !== 'start-id') {
            result.push({
                id: currentNode.id,
                stepIndex: currentNode.data.stepIndex
            });
        }

        const connectedEdges = edges.filter(edge => edge.source === currentId);
        connectedEdges.forEach(edge => {
            queue.push(edge.target);
        });
    }

    return result;
};


export function DiagramIndex({
    setListNodes,
    setListEdges,
    handleEditClick,
    handleConnectEnd,
    data,
    nodeNew,
    isView,
    date,
    keyDiagram,
}: {
    setListNodes: (nodes: any) => void,
    setListEdges: (edges: any) => void,
    handleEditClick: (editId: any, stepIndex: any, screenToFlowPositionNew?: React.MutableRefObject<XYPosition | null>) => void,
    handleConnectEnd: (screenToFlowPositionNew: any, nodeNewId: any, stepIndex: any, connectingNodeId?: React.MutableRefObject<string | null>) => void,
    onMute: any,
    data: any,
    nodeNew: any,
    isView?: boolean,
    date: Date,
    keyDiagram: any,
}) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const { x, y, zoom } = useViewport();
    const { fitBounds, screenToFlowPosition } = useReactFlow();
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const connectingNodeId = useRef<string | null>(null);
    const positionAdd = useRef<XYPosition | null>(null);
    const [reloadKey, setReloadKey] = useState(0);
    const [_date, setDate] = useState<Date>(new Date());

    const [meta, setMeta] = useState<any>({
        ...DefaultMeta,
        page_size: 1000,
        filter: {
            keyDiagram: keyDiagram
        }

    });
    const [permisson, setPermisson] = useState<any>({
        ...DefaulPer,
    });
    const { data: dataNode, error: errorNode, isLoading: isLoadingNode, mutate: mutateNode } = tourGuideNodeServices.GetList(meta);

    useEffect(() => {
        setPermisson(getPermisson("tourguidenode"));
        setMeta({
            ...DefaultMeta,
            page_size: 1000,
            filter: {
                keyDiagram: keyDiagram
            }

        });

        const storedEdges = localStorage.getItem('edges-' + keyDiagram);
        if (storedEdges) {

            const tranEdge = transformEdges(JSON.parse(storedEdges));
            setEdges(tranEdge);
        }

    }, [keyDiagram]);

    const reloadData = async () => {
        await mutateNode();
        setReloadKey(prevKey => prevKey + 1); // Tăng giá trị reloadKey để kích hoạt useEffect
    };

    useEffect(() => {
        if (!isLoadingNode && dataNode) {
            const transformedNodes = transformNodes(dataNode.data);
            setNodes(p => [...initialNodes, ...transformedNodes]);
        }
        else {
            setNodes(p => [...initialNodes]);
        }
    }, [dataNode, reloadKey]); // Thêm reloadKey vào dependencies

    const transformNodes = (nodesData: any): Node[] => {

        // const edgeConnects = nodesData
        //     .filter((node: any) => node.nodeId && node.nodeId.toString().trim() !== '')
        //     .map((node: any) => ({
        //         id: node.id.toString(),
        //         source: node.nodeId.toString(),
        //         target: node.id.toString(),
        //         type: 'customEdge',
        //         data: { edgeType: 'bezier' },
        //         animated: true
        //     }));


        // setEdges(p => [...edgeConnects]);

        return nodesData.map((node: any) => ({
            id: node.id.toString(),
            type: 'customNode',
            data: { label: node.title, stepTitle: `Bước ${node.stepIndex + 1}`, content: node.content, ...node },
            position: { x: node.positionX, y: node.positionY },
            animated: true
        }));
    };

    useEffect(() => {

        const connectedNodes = getConnectedNodes(nodes, edges);
        setListNodes(connectedNodes);

        const filteredData = edges.map(s => ({
            source: s.source,
            target: s.target
        }));

        setListEdges(filteredData);

        localStorage.setItem('edges-' + keyDiagram, JSON.stringify(filteredData));

    }, [edges, nodes, setListEdges, setListNodes]);

    useEffect(() => {
        if (date != _date) {
            setDate(date);
            reloadData();
        }
    }, [date]);

    useEffect(() => {

        const storedEdges = localStorage.getItem('edges-' + keyDiagram);

        if (storedEdges && storedEdges !== '[]') {

            const tranEdge = transformEdges(JSON.parse(storedEdges));
            setEdges(tranEdge);
        }
        else if (data?.listEdges) {

            const tranEdge = transformEdges(JSON.parse(data?.listEdges));

            setEdges(tranEdge);

            localStorage.removeItem('edges-' + keyDiagram);
        }

    }, [data?.listEdges, reloadKey]);

    useEffect(() => {
        setNodes(nds => recalculateSteps(nds, edges));
    }, [edges]);

    const transformEdges = (edgesData: any): Edge[] => {
        return edgesData.map((edge: any) => ({
            id: edge.target.toString(),
            source: edge.source.toString(),
            target: edge.target.toString(),
            type: 'customEdge',
            data: { edgeType: 'bezier', ...edge },
            animated: true
        }));
    };

    const checkCycle = (sourceId: string, targetId: string, edges: Edge[]): boolean => {
        const visited = new Set<string>();
        const stack = [targetId];

        while (stack.length) {
            const nodeId = stack.pop() || '';
            if (nodeId === sourceId) return true;
            if (!visited.has(nodeId)) {
                visited.add(nodeId);
                const nextNodes = edges.filter(edge => edge.source === nodeId).map(edge => edge.target!);
                stack.push(...nextNodes);
            }
        }
        return false;
    };

    const onConnect = useCallback((params: Edge | Connection) => {

        if (isView) return;

        const sourceNode = nodes.find(node => node.id === params.source);
        const targetNode = nodes.find(node => node.id === params.target);

        if (checkCycle(params.source!, params.target!, edges)) {
            alert("Không thể kết nối hai node tạo thành chu trình.");
            return;
        }

        if (sourceNode?.data?.isClone && targetNode?.data?.isClone) {
            alert("Không thể kết nối hai node nhân bản với nhau.");
            return;
        }

        if (edges.some(edge => edge.source === params.source || edge.target === params.target)) {
            alert("Node đã có kết nối.");
            return;
        }

        const newEdges = addEdge({ ...params, type: 'customEdge' }, edges);
        setEdges(newEdges);
        setNodes(recalculateSteps(nodes, newEdges));

    }, [nodes, edges]);

    const onConnectStart = useCallback((_: any, { nodeId }: { nodeId: any }) => {
        connectingNodeId.current = nodeId;
    }, []);

    const nodeHasConnection = (nodeId: string, edgeLoads: Edge[]) => {
        return edgeLoads.some(edge => edge.source === nodeId || edge.target === nodeId);
    };

    const onConnectEnd = useCallback(
        (event: any) => {
            if (isView) return;

            if (!connectingNodeId.current) {
                toast.warn("không có node id.");
                return;
            }

            const targetIsPane = event.target.classList.contains('react-flow__pane');

            if (connectingNodeId && targetIsPane) {

                const nodeNewId = uuidv4().toString();

                const nodeFind = nodes.find(node => node.id === connectingNodeId.current) || null;

                handleConnectEnd(screenToFlowPosition({
                    x: event.clientX,
                    y: event.clientY,
                }),
                    nodeNewId,
                    nodeFind?.data?.stepIndex ?? 0,
                    connectingNodeId,

                );

                const newEdge: Edge = {
                    id: nodeNewId,
                    source: connectingNodeId.current ?? nodeNewId,
                    target: nodeNewId,
                    type: 'customEdge',
                    data: { edgeType: 'bezier' },
                    animated: true
                };

                setEdges(eds => [...eds, newEdge]);

                const mergeData = [...edges, newEdge];
                const filteredData = mergeData.map(s => ({
                    source: s.source,
                    target: s.target
                }));

                localStorage.setItem('edges-' + keyDiagram, JSON.stringify(filteredData));
            }
        },
        [screenToFlowPosition, handleConnectEnd],
    );

    const delEdge = async (edgeId: any) => {

        try {
            const delEgdeData = await tourGuideNodeServices.deleteEdge(edgeId);
            if (delEgdeData) {
                toast.success("Xóa thành công");
                setEdges(eds => eds.filter(edge => edge.id !== edgeId));
            }
        } catch (err) {
            toast.error("Xóa thất bại");
        }

    }

    const onEdgeClick = useCallback((id: string) => {
        if (isView) return;
        // delEdge(id);

        setEdges(eds => {
            const updatedEdges = eds.filter(edge => edge.id !== id);
            const filteredData = updatedEdges.map(s => ({
                source: s.source,
                target: s.target
            }));

            localStorage.setItem('edges-' + keyDiagram, JSON.stringify(filteredData));
            return updatedEdges;
        });

        // setEdges(eds => eds.filter(edge => edge.id !== id));
    }, [isView]);

    const onEditClick = useCallback((id: string) => {
        if (isView) return;

        const nodeData = nodes.find(node => node.id === id);
        if (nodeData) {
            handleEditClick(id, nodeData?.data?.stepIndex ?? 0, positionAdd);
        }
    }, [nodes, handleEditClick, positionAdd]);

    const nodeTypes = useMemo(() => ({
        customNode: (props: any) => <CustomNode {...props} onEditClick={onEditClick} isView ={isView} />,
        circleNode: (props: any) => <CircleNode {...props} />
    }), [onEditClick, isView]);

    const edgeTypes = useMemo(() => ({
        customEdge: (props: any) => <CustomEdge {...props} onEdgeClick={onEdgeClick} isView = {isView}/>
    }), [onEdgeClick, isView]);

    const getRandomPosition = () => {
        const minX = -x / zoom;
        const maxX = (window.innerWidth - x) / zoom;
        const minY = -y / zoom;
        const maxY = (window.innerHeight - y) / zoom;

        return {
            x: Math.random() * (maxX - minX) + minX,
            y: Math.random() * (maxY - minY) + minY,
        };
    };

    const addNode = (label: string, stepTitle: string) => {
        const position = getRandomPosition();
        const newNode: Node = {
            id: `node-${Date.now()}`,
            type: 'customNode',
            data: { label, stepTitle, isAddNode: true, bgColor: 'bg-blue-400' },
            position,
        };
        setNodes(nds => {
            const newNodes = nds.concat(newNode);
            const { x, y } = position;
            fitBounds({ x, y, width: 200, height: 200 }, { duration: 600 });
            return newNodes;
        });
    };

    const updateNodePositions = () => {
        setNodes(nds => {
            // Sắp xếp các node theo stepIndex
            const sortedNodes = [...nds].sort((a, b) => {
                const stepIndexA = typeof a.data.stepIndex === 'number' ? a.data.stepIndex : 0;
                const stepIndexB = typeof b.data.stepIndex === 'number' ? b.data.stepIndex : 0;
                return stepIndexA - stepIndexB;
            });
    
            // Cập nhật vị trí của từng node dựa trên chỉ số sau khi đã sắp xếp
            return sortedNodes.map((node, index) => ({
                ...node,
                position: {
                    x: 400 * index, // Đảm bảo x là số
                    y: 250 // Đảm bảo y là số
                },
            }));
        });
    };
      

    return (
        <div style={{ display: 'flex', width: '100%', height: '70vh' }} ref={reactFlowWrapper}>
            <Loading loading={isLoadingNode} />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onConnectStart={onConnectStart}
                onConnectEnd={onConnectEnd}
                fitView
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
            >
                <Background color="#ccc" variant={"cross" as BackgroundVariant} />
                <MiniMap />
                <Controls />
                <svg width="0" height="0">
                    <defs>
                        <marker
                            id="arrowhead"
                            markerWidth="10"
                            markerHeight="7"
                            refX="8"
                            refY="3.5"
                            orient="auto"
                            markerUnits="strokeWidth"
                        >
                            <polygon points="0 0, 10 3.5, 0 7" />
                        </marker>
                    </defs>
                </svg>
                <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 4, display: 'flex', alignItems: 'center', gap: '10px' }}>

                    <div>
                        <div title='Căn chỉnh vị trí' className='flex items-center mx-2 bg-green-600 p-1 rounded border border-gray text-white'>
                            <button type="button" className='' onClick={updateNodePositions}>
                                <IoAnalyticsOutline size={25}/>
                            </button>
                        </div>

                        {/* <div title='Căn chỉnh vị trí' className='flex items-center mx-2 bg-green-600 p-1 rounded border border-gray text-white'>
                            <button type="button" className='' onClick={updateNodePositions}>
                                <FaDiagramNext size={25}/>
                            </button>
                        </div> */}
                    </div>
                </div>
            </ReactFlow>
        </div>
    );
}

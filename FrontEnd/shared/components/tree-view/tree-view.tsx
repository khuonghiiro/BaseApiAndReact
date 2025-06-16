import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";

interface TreeNode {
  id: number;
  title: string;
  key: string;
  isRoot: boolean;
  childrens: TreeNode[];
}

interface TreeViewProps {
  nodes: any[];
  onSelect?: (data: TreeNode) => void;
  mapFields?: {
    idField: string;
    titleField: string;
    keyField: string;
    childrenField: string;
    isRootField: string;
  };
  color?: string;
}

const TreeView = ({ nodes, onSelect, mapFields, color }: TreeViewProps) => {
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
  const [selectedNodePath, setSelectedNodePath] = useState<string | null>(null);

  // Map data
  const mapNodeData = (node: any): TreeNode => {
    const idField = mapFields?.idField || "id";
    const titleField = mapFields?.titleField || "title";
    const childrenField = mapFields?.childrenField || "childrens";
    const keyField = mapFields?.keyField || "key";
    const isRootField = mapFields?.isRootField || "isRoot";

    return {
      id: node[idField],
      title: node[titleField],
      key: node[keyField],
      isRoot: node[isRootField],
      childrens: (node[childrenField] || []).map((child: any) =>
        mapNodeData(child)
      ),
    };
  };

  const toggleNode = (nodeKey: string) => {
    setExpandedNodes((prev) =>
      prev.includes(nodeKey)
        ? prev.filter((key) => key !== nodeKey)
        : [...prev, nodeKey]
    );
  };

  const generateNodePath = (parentPath: string | null, node: TreeNode) =>
    parentPath ? `${parentPath}-${node.key}` : `${node.key}`;

  const handleSelectNode = (nodePath: string, node: TreeNode) => {
    setSelectedNodePath(nodePath);
    if (onSelect) onSelect(node);
  };

  const renderTree = (parentPath: string | null, node: TreeNode) => {
    const nodePath = generateNodePath(parentPath, node);
    const isSelected = nodePath === selectedNodePath;
    const isExpanded = expandedNodes.includes(node.key);

    return (
      <div
        key={node.key}
        className={`pl-4 relative ${isExpanded ? "border-left-custom" : ""} 
          ${color ? `bg-[${color}]` : ""}`}
      >
        <div
          className={`flex items-center w-full ${
            isSelected ? "bg-blue-100 text-blue-700" : ""
          } transition-all node-content`}
        >
          {node.childrens.length > 0 && (
            <div
              className={`cursor-pointer ${parentPath ? "ml-2" : "mr-1"}`}
              onClick={() => toggleNode(node.key)}
            >
              {isExpanded ? <FaMinus /> : <FaPlus />}
            </div>
          )}

          {parentPath && <span className="border-bottom-custom"></span>}
          <span
            className=" ml-1 cursor-pointer hover:bg-gray-100 hover:text-blue-600 p-1 rounded flex-grow"
            onClick={() => handleSelectNode(nodePath, node)}
          >
            {node.title}
          </span>
        </div>

        {isExpanded && node.childrens.map((child) => renderTree(nodePath, child))}
      </div>
    );
  };

  const mappedNodes = nodes.map((node) => mapNodeData(node));

  return (
    <div className="border-l-2 border-gray-300 text-[14px] py-2">
      {mappedNodes.map((node) => renderTree(null, node))}
    </div>
  );
};

export default TreeView;

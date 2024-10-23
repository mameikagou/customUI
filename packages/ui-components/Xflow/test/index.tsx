import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  MiniMap,
  Panel,
  NodeResizer,
  NodeToolbar,
  Handle,
  Position,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { useCallback, memo } from "react";
import { CustomNode } from "./customNode";

// node是节点
const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Input Node1" },
    position: { x: 250, y: 0 },
  },
  {
    id: "2",
    type: "input",
    data: { label: "Input Node2" },
    position: { x: 350, y: 100 },
  },
  {
    id: "3",
    type: "input",
    data: { label: "Input Node2" },
    position: { x: 450, y: 200 },
  },
];

// edge是边,表示从source到target的边
const initialEdges = [
  { id: "e1-2", source: "1", target: "2", label: "连接1和2", type: "step" },
  { id: "e2-3", source: "2", target: "3", label: "连接2和3" },
];

const nodeTypes = {
  custom: CustomNode,
};

export default function XflowComponents() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  return (
    <div className="w-[80vh] h-[80vh]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <MiniMap />
        {/* 控制放大缩小的组件 */}
        <Controls />
        {/* 提供网格背景 */}
        <Background gap={12} size={1} />
        <Panel position="top-left">top-left</Panel>

        {nodes.map((node) => (
          <NodeResizer key={node.id} nodeId={node.id} minWidth={100} minHeight={30}  />
        ))}

        {nodes.map((node) => (
          <NodeToolbar key={node.id} nodeId={node.id}>
            <button>delete</button>
          </NodeToolbar>
        ))}
      </ReactFlow>
    </div>
  );
}

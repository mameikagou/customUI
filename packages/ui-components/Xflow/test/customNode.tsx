import { Handle, NodeToolbar, Position } from "@xyflow/react";
import { memo } from "react";

// 自定义节点组件
export const CustomNode = memo(({ data }) => {
  return (
    <>
      <NodeToolbar
        isVisible={data.toolbarVisible}
        position={data.toolbarPosition}
      >
        <button>delete</button>
        <button>copy</button>
        <button>expand</button>
      </NodeToolbar>

      <div style={{ padding: "10px 20px" }}>{data.label}</div>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </>
  );
});

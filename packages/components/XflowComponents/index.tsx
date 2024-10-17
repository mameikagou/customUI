import React from 'react';
import { ReactFlow } from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const initialNodes = [
    {
        id: '1',
        type: 'input',
        data: { label: 'Input Node' },
        position: { x: 250, y: 0 },
    },
    {
        id: '2',
        type: 'input',
        data: { label: 'Input Node' },
        position: { x: 250, y: 0 },
    },
]

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
]

export default function XflowComponents(){
    return(
        <div className='w-[80vh] h-[80vh]'>
            <ReactFlow nodes={initialNodes} edges={initialEdges}></ReactFlow>
        </div>
    )
}
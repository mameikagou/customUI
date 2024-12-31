import "./styles/index.less";
import { TableBody } from "./tbody";
import { ColumnType } from "./interface";
import { useState } from "react";

export const Table = () => {
    // 定义列配置
    const columns: ColumnType<any>[] = [
        {
            key: 'name',
            dataIndex: 'name',
            title: '姓名',
            render: (value) => <b>{value}</b>
        },
        {
            key: 'age',
            dataIndex: 'age',
            title: '年龄'
        },
        {
            key: 'city',
            dataIndex: 'city',
            title: '城市'
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: '状态',
            render: (value) => (
                <span style={{ color: value === 'active' ? 'green' : 'red' }}>
                    {value}
                </span>
            )
        }
    ];

    // 示例数据
    const data = [
        { id: '1', name: '张三', age: 25, city: '北京', status: 'active' },
        { id: '2', name: '李四', age: 30, city: '上海', status: 'inactive' },
        { id: '3', name: '王五', age: 28, city: '广州', status: 'active' },
        { id: '4', name: '赵六', age: 35, city: '深圳', status: 'active' },
    ];

    // 选中行的状态
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    // 行选择处理函数
    const handleSelectRow = (key: string, selected: boolean) => {
        if (selected) {
            setSelectedRows([...selectedRows, key]);
        } else {
            setSelectedRows(selectedRows.filter(k => k !== key));
        }
    };

    return (
        <table className="arco-table">
            <TableBody
                columns={columns}
                data={data}
                rowKey="id"
                onSelectRow={handleSelectRow}
                selectedRows={selectedRows}
            />
        </table>
    );
};

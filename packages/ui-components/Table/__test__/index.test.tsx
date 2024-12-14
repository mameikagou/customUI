import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TableBody } from '../tbody';
import { ColumnType } from '../interface';

// 测试数据类型定义
interface TestData {
    id: string;
    name: string;
    age: number;
}

// 测试数据
const mockData: TestData[] = [
    { id: '1', name: 'John', age: 25 },
    { id: '2', name: 'Jane', age: 30 },
];

// 测试列定义
const mockColumns: ColumnType<TestData>[] = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        render: (text, record) => `${text} years old`,
    },
];

describe('TableBody', () => {
    // 基本渲染测试
    test('renders all rows and columns correctly', () => {
        const mockOnSelectRow = jest.fn();
        
        render(
            <TableBody<TestData>
                columns={mockColumns}
                data={mockData}
                rowKey="id"
                selectedRows={[]}
                onSelectRow={mockOnSelectRow}
            />
        );

        // 验证所有数据是否正确渲染
        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.getByText('25 years old')).toBeInTheDocument();
        expect(screen.getByText('Jane')).toBeInTheDocument();
        expect(screen.getByText('30 years old')).toBeInTheDocument();
    });

    // 行选择测试
    test('handles row selection correctly', () => {
        const mockOnSelectRow = jest.fn();
        
        render(
            <TableBody<TestData>
                columns={mockColumns}
                data={mockData}
                rowKey="id"
                selectedRows={['1']}
                onSelectRow={mockOnSelectRow}
            />
        );

        // 查找第一行（通过名字定位）
        const firstRow = screen.getByText('John').closest('tr');
        expect(firstRow).toHaveClass('table-row-selected');

        // 点击行触发选择
        fireEvent.click(firstRow!);
        expect(mockOnSelectRow).toHaveBeenCalledWith('1', false);
    });

    // 自定义渲染测试
    test('renders custom cell content using render function', () => {
        const customColumns: ColumnType<TestData>[] = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                render: (text) => <span data-testid="custom-name">{`Mr. ${text}`}</span>,
            },
        ];

        render(
            <TableBody<TestData>
                columns={customColumns}
                data={mockData}
                rowKey="id"
                selectedRows={[]}
                onSelectRow={() => {}}
            />
        );

        expect(screen.getByText('Mr. John')).toBeInTheDocument();
    });

    // 函数式 rowKey 测试
    test('works with function rowKey', () => {
        const mockOnSelectRow = jest.fn();
        const customRowKey = (record: TestData) => `user-${record.id}`;

        render(
            <TableBody<TestData>
                columns={mockColumns}
                data={mockData}
                rowKey={customRowKey}
                selectedRows={[]}
                onSelectRow={mockOnSelectRow}
            />
        );

        const firstRow = screen.getByText('John').closest('tr');
        fireEvent.click(firstRow!);
        expect(mockOnSelectRow).toHaveBeenCalledWith('user-1', true);
    });

    // 空数据测试
    test('renders empty table body when no data provided', () => {
        render(
            <TableBody<TestData>
                columns={mockColumns}
                data={[]}
                rowKey="id"
                selectedRows={[]}
                onSelectRow={() => {}}
            />
        );

        const tbody = screen.getByRole('rowgroup');
        expect(tbody.children.length).toBe(0);
    });
});
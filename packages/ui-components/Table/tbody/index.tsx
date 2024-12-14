import { ColumnType } from "../interface";

export const TableBody = <T extends Record<string, any>>({
    columns,
    data,
    rowKey,
    onSelectRow,
    selectedRows,
}: {
    columns: ColumnType<T>[];
    data: T[];
    rowKey: string | ((record: T) => string);
    onSelectRow: (key: string, selected: boolean) => void;
    selectedRows: string[];
}) => {
    const getRowKey = (record: T): string => {
        if (typeof rowKey === "function") {
            return rowKey(record);
        }
        return record[rowKey];
    };

    const renderCell = (column: ColumnType<T>, record: T, index: number) => {
        const value = record[column.dataIndex];
        if (column.render) {
            return column.render(value, record, index);
        }
        return value;
    };

    return (
        <div className="arco-table-body">
            <tbody>
                {data.map((record, index) => {
                    const key = getRowKey(record);
                    const isSelected = selectedRows.includes(key);
                    return (
                        <tr
                            key={key}
                            className={isSelected ? "table-row-selected" : ""}
                            onClick={() => {
                                onSelectRow(key, !isSelected);
                            }}
                        >
                            {columns.map((column) => (
                                <td key={column.key}>
                                    {renderCell(column, record, index)}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </div>
    );
};

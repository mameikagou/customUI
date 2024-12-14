export interface ColumnType<T extends Record<string, any>> {
    title: string;
    dataIndex: Extract<keyof T, string>; // Only allow string keys, and make the T is assignable to stirng
    key: Extract<keyof T, string>; // Only allow string keys
    render?: (text: string, record: T, index: number) => React.ReactNode;
    width?: number;
    sorted?: boolean | ((a:T,b:T) => number);
    filter?: {text: string, value: string}[]
    onFilter?: (value: string, record: T) => T
}

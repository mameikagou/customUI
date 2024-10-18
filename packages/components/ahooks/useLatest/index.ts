import { useRef } from "react";

// 避免闭包,获取最新的值
const useLatest = <T>(value: T) => {
    const ref = useRef(value);
    ref.current = value;
    return ref;
}

export default useLatest;
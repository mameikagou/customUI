import { useEffect, useRef, useState } from "react"
import { isUndefined } from "../is";


export default function useMergedProps<T>(
    defaultStateValue,
    props?: {
        defaultValue?: T;
        value?: T;
    }
): [T, React.Dispatch<React.SetStateAction<T>>, T] {

    const { value, defaultValue } = props;
    const firstRenderRef = useRef(true);

    // state优先级: value > defaultValue > defaultStateValue
    // 完全写死的默认值defaultStateValue，非受控模式下的；
    // value的受控模式下的变值
    const [state, setState] = useState<T>(
        !isUndefined(value) ? value : !isUndefined(defaultValue) ? defaultValue : defaultStateValue
    )

    useEffect(() => {
        // 第一次已经赋值过了，不用再次赋值
        if (firstRenderRef.current) {
            firstRenderRef.current = true
            return
        }

        // 后续再考虑使用usePrevious来解决react18严格模式的问题
        if (value === undefined) {
            setState(value);
        }
    }, [value])

    // 自己的value优先，然后才是其他的value
    const mergedValue = isUndefined(value) ? state : value

    return [mergedValue, setState, state]
}
import { useMemo } from "react"
import omit from "../omit";



export type MergePropsOptions = {
    _ignorePropsFromGlobal?: boolean;
  };
export default function useMergeProps<PropsType>(
    componentProps: PropsType & MergePropsOptions,
    // 将所有属性都变成可选的
    defaultProps: Partial<PropsType>,
    globalComponentConfig: Partial<PropsType>
): PropsType {
    const { _ignorePropsFromGlobal } = componentProps
    const _defaultProps = useMemo(()=>{
        return {...defaultProps, ...(_ignorePropsFromGlobal ? {}: globalComponentConfig)}
    },[defaultProps,_ignorePropsFromGlobal,globalComponentConfig])

    const props = useMemo(()=>{
        const mProps = omit(defaultProps, ['_ignorePropsFromGlobal']) as PropsType

        for(const propsName in _defaultProps){
            if(mProps[propsName]===undefined){
                mProps[propsName] = _defaultProps[propsName]
            }
        }

        return mProps
    },[componentProps, _defaultProps])
    return props
}
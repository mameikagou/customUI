// 就是保证"对象"不会重复创建，减少性能损耗
// 为什么传入对象是一个函数？
// 为了延迟创建。在需要的时候才创建对象

import { DependencyList, useRef } from "react";

// type DependencyList = readonly unknown[];
// 这东西就是个unknown[]数组

export default function useCreation<T>(factory: () => T, deps: DependencyList) {
    const { current } = useRef({
        deps,
        obj: undefined as undefined | T,
        initialized: false,
    });

    if(current.initialized === false || !depsAreSame(current.deps,deps)){
        current.deps = deps;
        current.obj = factory();
        current.initialized = true;
    }
    return current.obj;
}

export function depsAreSame(oldDeps: DependencyList, deps: DependencyList): boolean {
    if(oldDeps === deps) return true
    for(let i=0;i< oldDeps.length;i++){
        if(!Object.is(oldDeps[i],deps)) return false
    }
    return true
}
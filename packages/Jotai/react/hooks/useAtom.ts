import * as React from 'react';
import { useEffect, useState } from "react";
import type { AtomStore } from "../../vanilla/store";

export function useAtom<T>(atom: AtomStore<T>): [T, (value: T) => void] {
    const [value, setValue] = useState<T>(atom.getValue());

    useEffect(() => {
        const unsubscribe = atom.subscribe((newValue) => {
            setValue(newValue);
        });
        return () => unsubscribe();
    }, []);

    return [
        value,
        (newValue: T | ((prev:T)=>T)) => {
            if(typeof newValue === 'function') {
                atom.setValue((newValue  as (prev:T)=>T)(atom.getValue())) // 传入当前的prev当作函数参数
            } else{
                atom.setValue(newValue);
            }
        },
    ];
}

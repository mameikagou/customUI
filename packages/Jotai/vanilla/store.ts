type Listener<T> = (value: T) => void;

export type AtomStore<T> = {
    getValue: () => T;
    setValue: (value: T) => void;
    subscribe: (listener: Listener<T>) => () => void; // 使用闭包来实现订阅
};

// 某面试题：为什么js会有闭包？
// 回答加1，方便外部调用来执行一些操作，比如收尾或者清除，就像是订阅模式下，通过闭包来定义一个删除器；

// 基于订阅发布者模式，每次更新数据的时候，都会通知所有的订阅者
export function createAtomStore<T>(initialValue: T): AtomStore<T> {
    let value = initialValue;
    const listeners = new Set<Listener<T>>();

    const notify = () => {
        listeners.forEach((listener) => {
            listener(value);
        });
    };
    return {
        getValue: () => value,
        setValue: (newValue) => {
            if (value !== newValue) { // 添加值比较，避免不必要的更新
                value = newValue;
                notify();
            }
        },
        subscribe: (listener) => {
            listeners.add(listener);
            return () => {
                listeners.delete(listener);
            };
        },
    };
}

export function atom<T>(initialValue: T): AtomStore<T> {
    return createAtomStore(initialValue);
}

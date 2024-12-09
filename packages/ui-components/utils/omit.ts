

export default function omit<T extends object, K extends keyof T>(
    obj: T,
    keys: Array<K | string>
): Omit<T, K> {
    const clone = {
        ...obj
    }

    keys.forEach((key) => {
        if ((key as K) in clone) { // in是用来判断属性是否存在的，includes表示特定的值是否存在
            delete clone[key as K]
        }
    })
    return clone
}
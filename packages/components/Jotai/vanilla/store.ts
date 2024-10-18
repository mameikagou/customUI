
// const isPendingPromise

const buildStore = (getAtomState)=>{

    const setAtomStateValueOrPromise = () => {}
}

export const createStore = () => {
    const atomStateMap = new WeakMap()

    // 没有就新建一个
    const getAtomState = (atom)=> {
        let atomState = atomStateMap.get(atom)
        // 所以每一个atomState都是一个对象,他的值有三个字段, map set n
        if(!atomState){
            atomState = {d: new Map(), p: new Set(), n:0}
            atomStateMap.set(atom, atomState)
        }
        return atomState
    }
    // 待补充
    return buildStore(getAtomState)
}
import * as React from "react"; // 命名空间
 
// 简要封装一下, 后面的东西, 后面再加;
export function createContext(){
    // 这东西会返回一个Provider和Consumer组件;
    const Context = React.createContext(undefined);

    function useContext(){
        return React.useContext(Context);
    }

    return [Context, Context.Provider, useContext]
}
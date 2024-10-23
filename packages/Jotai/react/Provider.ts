import { create } from "domain";
import { useRef, createContext, createElement, useContext } from "react";

// 后续查看 vanilla.ts 实现createStore
type Store = ReturnType<typeof createStore>;

type Options = {
  store?: Store;
};

const StoreContext = createContext(undefined);

// 将useContext的store和options的store封装在一起
// TODO: 备用store的好处呢?
export const useStore = (options?: Options):Store => {
    const store = useContext(StoreContext);
    return store || options?.store;
    // || getDefaultStore()
}

// 重新封装Privider
export const Provider = ({ children, store }) => {
  const storeRef = useRef<Store>();
  // 如果没有,就创建一个
  if (!store && !storeRef.current) {
    storeRef.current = createStore();
  }
  return createElement(
    StoreContext.Provider,
    {
      value: store || storeRef.current,
    },
    children
  );
};

/**
 * 
createElement相当于是在创建标签
const element = React.createElement(
  'div',
  { className: 'my-class' },
  'Hello, world!'
);

 */
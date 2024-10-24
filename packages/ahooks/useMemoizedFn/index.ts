import { useRef, useMemo } from "react";

type noop = (this: any, ...args: any[]) => any;

type PicFunction<T extends noop> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => ReturnType<T>;

// 缓存函数，避免频繁生成函数导致的错误
// 说白了不就是用current来闭包存地址么
function useMemoizedFn<T extends noop>(fn: T) {
  const fnRef = useRef<T>(fn);

  fnRef.current = useMemo<T>(() => fn, [fn]);

  const memoizedFn = useRef<PicFunction<T>>();

  //   避免重复更新
  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
        // 绑定上下文
      return fnRef.current.apply(this, ...args);
    };
  }
  return memoizedFn.current as T;
}

export default useMemoizedFn;

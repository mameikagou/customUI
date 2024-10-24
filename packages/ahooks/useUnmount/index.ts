import { useEffect } from "react";
import useLatest from "@/ahooks/useLatest";
import { isFunction } from "@/utilities";
import isDev from "@/utilities/isDev";

const useUnmount = (fn: () => void) => {
  if (!isDev && !isFunction(fn)) {
    console.error(
      `useUnmount expected parameter is a function, got ${typeof fn}`
    );
  }

  const fnRef = useLatest(fn);

  useEffect(() => {
    return () => {
      fnRef.current();
    };
  }, []);
};

export default useUnmount;

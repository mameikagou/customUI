import { isFunction } from "@/utilities";
import isDev from "@/utilities/isDev";
import { useEffect } from "react";

const useMount = (fn:()=>void) =>{

    if(isDev&&isFunction(fn)){
        console.error(
            `useMount: parameter \`fn\` expected to be a function, but got "${typeof fn}".`,
        );
    }

    useEffect(()=>{
        fn?.()
    },[])
}

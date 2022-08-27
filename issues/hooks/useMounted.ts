import { useCallback, useEffect, useRef } from "react"


export const useMountedState = () => {
    //need ref to check for mounted
    const mountedRef = useRef(false); //default value should be false because we should check 
    const isMounted = useCallback(()=>mountedRef.current, []);
    //using useCallback so when component using this function rerenders we're not creating a new funciton
    useEffect(()=>{
        //when componenent using useMountedState gets mounted the ref will be set to true
        mountedRef.current= true;


        //need clean up function so set the ref back to false when the component is no longer mounted

        return ()=>{
            mountedRef.current = false;
        }
    }, []);

    return isMounted;
}
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const AutoScrollTop = () => {
    const { pathname } = useLocation();

    useEffect(()=>{
        window.scrollTo(0,0);
    },[pathname])
    // 렌더링이 필요 없음.
    return null;
}

export default AutoScrollTop;
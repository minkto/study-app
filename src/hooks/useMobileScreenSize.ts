import { useEffect, useState } from "react"

export function useMobileScreenSize() {
    const [isMobile, setIsMobile] = useState(false);
    const mobileScreenSizeMediaQuery = '(max-width: 768px)';

    useEffect(() => {

        const mediaQueryList = window.matchMedia(mobileScreenSizeMediaQuery);
        const setMobileState = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
        };

        // On initial load, set if it's mobile screen size.
        setIsMobile(mediaQueryList.matches);

        mediaQueryList.addEventListener('change', setMobileState);

        return () => {
            mediaQueryList.removeEventListener('change', setMobileState);
        }
    }, []);

    return isMobile;
}
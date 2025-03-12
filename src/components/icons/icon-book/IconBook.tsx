import { SvgIcon } from "@/shared.types";

export const IconBook = ({width,height} : SvgIcon) => 
{
    return(<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.33334 26C5.33334 25.1159 5.68453 24.2681 6.30965 23.6429C6.93478 23.0178 7.78262 22.6666 8.66668 22.6666H26.6667M5.33334 26C5.33334 26.884 5.68453 27.7319 6.30965 28.357C6.93478 28.9821 7.78262 29.3333 8.66668 29.3333H26.6667V2.66663H8.66668C7.78262 2.66663 6.93478 3.01782 6.30965 3.64294C5.68453 4.26806 5.33334 5.1159 5.33334 5.99996V26Z" 
        stroke="#1E1E1E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>        
    )
}

export default IconBook;
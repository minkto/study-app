import { SvgIcon } from "@/shared.types";

export const IconFilter = ({width,height,className} : SvgIcon) => 
{
    return(
    <div className={className !== undefined ?  className=`${className}` : "icon-wrapper"}>
    <svg
     width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.3334 2.5H1.66669L8.33335 10.3833V15.8333L11.6667 17.5V10.3833L18.3334 2.5Z" 
        stroke="#1E1E1E" 
        strokeWidth="2"
        strokeLinecap="round" 
        strokeLinejoin="round"/>
        </svg>
        </div>
        )
}

export default IconFilter;
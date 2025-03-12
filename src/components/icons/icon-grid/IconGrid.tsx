import { SvgIcon } from "@/shared.types";

export const IconGrid = ({width,height} : SvgIcon) => 
{
    return(<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.3333 4H4V13.3333H13.3333V4Z" stroke="#1E1E1E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M28 4H18.6667V13.3333H28V4Z" stroke="#1E1E1E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M28 18.6667H18.6667V28H28V18.6667Z" stroke="#1E1E1E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.3333 18.6667H4V28H13.3333V18.6667Z" stroke="#1E1E1E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        )
}

export default IconGrid;
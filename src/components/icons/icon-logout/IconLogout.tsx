import { SvgIcon } from "@/shared.types";

export const IconLogout = ({width,height} : SvgIcon) => 
{
    return(<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 28H6.66667C5.95942 28 5.28115 27.719 4.78105 27.219C4.28095 26.7189 4 26.0406 4 25.3333V6.66667C4 5.95942 4.28095 5.28115 4.78105 4.78105C5.28115 4.28095 5.95942 4 6.66667 4H12M21.3333 22.6667L28 16M28 16L21.3333 9.33333M28 16H12" 
        stroke="#1E1E1E" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"/>
        </svg>
        
        )
}

export default IconLogout;
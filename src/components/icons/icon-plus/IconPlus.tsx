import { SvgIcon } from "@/shared.types";

const IconPlus = ({width,height}: SvgIcon) => 
{
    return(<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19M5 12H19" stroke="#1E1E1E" strokeWidth={"2.5"}  strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        )
}

export default IconPlus;
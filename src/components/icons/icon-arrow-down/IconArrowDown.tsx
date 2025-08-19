import { SvgIcon } from "@/shared.types";

const IconArrowDown = ({width,height,useCurrentColor} : SvgIcon) => {
    return (<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} 
    fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 6.66667V25.3333M16 25.3333L25.3333 16M16 25.3333L6.66663 16" 
        stroke={useCurrentColor ? "currentColor" : "#1E1E1E"  }
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" />
    </svg>
    )
}

export default IconArrowDown;
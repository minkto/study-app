import { SvgIcon } from "@/shared.types";

const IconCancel = ({ width, height }: SvgIcon) => {
    return (<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M24 8L8 24M8 8L24 24" stroke="#1E1E1E"
            strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

    )
}

export default IconCancel;
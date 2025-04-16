import { SvgIcon } from "@/shared.types"

export const IconChevronDown = ({ width, height ,className}: SvgIcon) => {

    return (
    <div className={className !== undefined ?  className=`${className}` : "icon-wrapper"}>
    <svg width={width} height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M5 7.5L10 12.5L15 7.5"
            stroke="#1E1E1E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
    </svg>
    </div>
    )
}

export default IconChevronDown;
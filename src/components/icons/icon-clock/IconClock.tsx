import { SvgIcon } from "@/shared.types";

export const IconClock = ({ width, height, className }: SvgIcon) => {
    return (
        <svg className={`icon-img ${className}`}
         width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="icon-img__path"
             d="M16.0001 8.00002V16L21.3334 18.6667M29.3334 16C29.3334 23.3638 23.3639 29.3334 16.0001 29.3334C8.63628 29.3334 2.66675 23.3638 2.66675 16C2.66675 8.63622 8.63628 2.66669 16.0001 2.66669C23.3639 2.66669 29.3334 8.63622 29.3334 16Z" 
            stroke="#1E1E1E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default IconClock;
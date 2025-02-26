interface IconMoreHorizontalProps {
    width?: number;
    height?: number;
}

const IconMoreHorizontal = ({ width = 16, height = 16 }: IconMoreHorizontalProps) =>

(<svg
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M16 17.3333C16.7364 17.3333 17.3334 16.7363 17.3334 16C17.3334 15.2636 16.7364 14.6666 16 14.6666C15.2637 14.6666 14.6667 15.2636 14.6667 16C14.6667 16.7363 15.2637 17.3333 16 17.3333Z" stroke="#E0E0E0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25.3334 17.3333C26.0698 17.3333 26.6667 16.7363 26.6667 16C26.6667 15.2636 26.0698 14.6666 25.3334 14.6666C24.597 14.6666 24 15.2636 24 16C24 16.7363 24.597 17.3333 25.3334 17.3333Z" stroke="#E0E0E0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.66671 17.3333C7.40309 17.3333 8.00004 16.7363 8.00004 16C8.00004 15.2636 7.40309 14.6666 6.66671 14.6666C5.93033 14.6666 5.33337 15.2636 5.33337 16C5.33337 16.7363 5.93033 17.3333 6.66671 17.3333Z" stroke="#E0E0E0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
</svg>
);


export default IconMoreHorizontal
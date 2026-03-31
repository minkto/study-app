"use client"

import { useEffect, useRef, useState } from 'react';
import styles from './description-card.module.css'
import IconChevronDown from '../icons/icon-chevron-down/IconChevronDown';

interface DescriptionCardProps {
    text?: string | undefined;
}

export const DescriptionCard = ({ text }: DescriptionCardProps) => {

    const OVERFLOW_MARGIN_HEIGHT = 2;
    const innerContent = useRef<HTMLDivElement>(null);
    const showMoreBtn = useRef<HTMLButtonElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const isExpandedRef = useRef(false);
    const isAnimatingRef = useRef(false);
    const buttonText = isExpanded ? "Show Less" : "Show More";


    const handleShowMore = () => {
        const next = !isExpanded;
        setIsExpanded(next);
        isExpandedRef.current = next;
        isAnimatingRef.current = true;
        setTimeout(() => { isAnimatingRef.current = false; }, 500); // match your CSS transition duration
    }


    useEffect(() => {
        const el = innerContent.current;
        if (!el) {
            return;
        }

        const check = () => {
            if (isAnimatingRef.current) {
                return; // ignore resize events during expand/collapse
            }

            if (isExpandedRef.current) {
                el.classList.toggle(styles['inner-content--expanded'])
            }

            const overflowing = el.scrollHeight > el.clientHeight + OVERFLOW_MARGIN_HEIGHT;

            setIsOverflowing(overflowing);
            if (!overflowing) {
                setIsExpanded(false);
                isExpandedRef.current = false;
            }
        };

        check();
        const observer = new ResizeObserver(check);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);


    return <div className={styles["description-card"]}>
        <div
            className={`${isOverflowing ? styles["overflow"] : ""} 
            ${styles["description-card__inner-content"]} 
            ${isExpanded ? styles["inner-content--expanded"] : ""}`}
            ref={innerContent}
        >
            <p>{text}
            </p>
        </div>
        <div className={styles["description-card__show-more-option"]}>
            {(isOverflowing || isExpanded) && <button
                onClick={handleShowMore}
                className={`btn-reset ${styles["show-more-option__btn-link"]}`}
                ref={showMoreBtn}
            >{buttonText}
                <IconChevronDown
                    strokeColor='#457600'
                    className={`${styles["icon-wrapper"]} ${isExpanded ? styles["icon-wrapper--rotated"] : ""}`}
                    width={20}
                    height={20}
                /></button>}
        </div>
    </div>
}

export default DescriptionCard;
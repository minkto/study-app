import { useEffect, useRef, useState } from 'react';
import CategoryPill from '../category-pill/CategoryPill';
import IconMoreHorizontal from '../icons/icon-more-horizontal/IconMoreHorizontal';
import styles from './resource-listings-card.module.css'

interface ResourceListingsCardProps {
    title?: string;
}

const ResourceListingsCard = ({ title = "Card Name" }: ResourceListingsCardProps) => {
    const [dropdownMenuModal, setDropdownMenuModal] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const onModalClick = () => dropdownMenuModal ? 
    setDropdownMenuModal(false) : 
    setDropdownMenuModal(true);

    const onOutsideClick = (e : MouseEvent|KeyboardEvent ) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            setDropdownMenuModal(false);
        }
    }

    const showDropdownMenu = () => {
        return <div className={styles['card-dropdown-menu']} ref={modalRef}>
            <ul className={styles['card-dropdown-menu__list']}>
                <li className={styles['card-dropdown-menu__list-item']}>Option 1</li>
                <li className={styles['card-dropdown-menu__list-item']}>Option 2</li>
                <li className={styles['card-dropdown-menu__list-item']}>Option 3</li>
            </ul>
        </div>
    }

    useEffect(() => {
        document.addEventListener("mousedown", onOutsideClick);
        document.addEventListener("keydown", onOutsideClick);
    
        // Cleanup function
        return () => {
          document.removeEventListener("mousedown", onOutsideClick);
          document.addEventListener("keyup", onOutsideClick);
        };
      }, []);

    return (
        <div className={styles["resources-listing-card"]}>
            <div className={styles["resources-listing-card__row"]}>
                <h2 className={styles["resources-listing-card__name"]}>{title}</h2>
                <div className={styles["resources-listing-card__options"]}>
                    {dropdownMenuModal ? showDropdownMenu() : null}
                    <button className={styles["resources-listing-card__options-button"]} onClick={onModalClick}>
                        <IconMoreHorizontal width={32} height={32} />
                    </button>
                </div>
            </div>

            <div className={styles["resources-listing-card__row"]}>
                {/*<!-- Percentage Component -->*/}
                <div className={styles["resources-listing-card__progress-bar"]}>
                    <div className={styles["resources-listing-card__progress-bar__name"]}>Percentage Reviewed</div>
                    <div className={styles["resources-listing-card__progress-bar__image"]}></div>
                </div>
            </div>
            <div className={styles["resources-listing-card__row"]}>
                <div className={styles["resources-listing-card__category"]}>
                    <CategoryPill />
                    <CategoryPill />
                    <CategoryPill />
                    <CategoryPill />
                    <CategoryPill />
                    <CategoryPill />
                </div>
            </div>
            <div className={styles["resources-listing-card__description"]}>
                <p className={styles["max-lines"]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Morbi vitae finibus augue. Nulla tincidunt porttitor felis, ut iaculis sapien pretium id.
                    Nunc non vulputate libero, ac suscipit felis. Fusce sodales lacus vel nisi dignissim, vel convallis quam placerat.
                    Suspendisse potenti. Praesent ac mi et leo congue sollicitudin.
                    Donec enim metus, consectetur id malesuada vel, accumsan quis felis.
                    Morbi quis purus maximus, dignissim enim nec, molestie lorem. Mauris porta rhoncus rhoncus.
                    Sed at lectus porttitor, elementum metus sed, ornare tellus. Fusce eget turpis nunc.</p>
                <div className={styles["resources-listing-card__description-container"]}></div>

            </div>

            <div className={styles["resources-listing-card__description-overlay"]}></div>
        </div>
    );
}

export default ResourceListingsCard;
import styles from '@/components/card-dropdown-menu/card-dropdown-menu.module.css'
import { useCallback, useEffect, useRef, useState } from 'react';
import IconMoreHorizontal from '../icons/icon-more-horizontal/IconMoreHorizontal';


interface CardDropdownMenuProps {
    onClose?: () => void;
    links?: DropdownMenuOption[];
    positionState?: CardDropdownAlignmentType;
}

interface DropdownMenuOption {
    label: string;
    href?: string;
    onClick?: () => void;
}

export type CardDropdownAlignmentType = typeof CardDropdownAlignment[keyof typeof CardDropdownAlignment];


export const CardDropdownAlignment =
{
    NONE: 0,
    LEFT: 1,
    RIGHT: 2,
    CENTER: 3
}



const CardDropdownMenu = ({ links, positionState }: CardDropdownMenuProps) => {

    const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const renderDropdownMenuOptions = (dropdownMenuOptions: DropdownMenuOption[] | undefined) => {
        if (dropdownMenuOptions === undefined) {
            return null;
        }
        return (
            dropdownMenuOptions?.map((i) => (
                <li key={i.label} className={styles["dropdown-menu__list-item"]}>
                    {i.href ? (
                        <a href={i.href} className={styles["dropdown-menu__link"]}>{i.label}</a>
                    ) : (
                        <button onClick={() => {
                            if (i.onClick !== undefined) {
                                i?.onClick();
                            }
                            toggleDropdown();
                        }
                        } className={styles["dropdown-menu__button"]}>{i.label}</button>
                    )}
                </li>
            ))
        );
    }

    const toggleDropdown = useCallback(
        (() => setDropdownMenuOpen(!dropdownMenuOpen)), [dropdownMenuOpen]
    );

    const getPosition = useCallback((pos: CardDropdownAlignmentType) => {

        switch (pos) {
            case CardDropdownAlignment.LEFT:
                return "position-left";

            case CardDropdownAlignment.RIGHT:
                return "position-right";

            case CardDropdownAlignment.CENTER:
                return "position-center";

            case CardDropdownAlignment.NONE:
            default:
                return "position-center";

        }
    }, [])

    useEffect(() => {
        const onOutsideClick = (e: MouseEvent | KeyboardEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                toggleDropdown();
            }
        }

        if (dropdownMenuOpen) {
            document.addEventListener("mousedown", onOutsideClick);
            document.addEventListener("keydown", onOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", onOutsideClick);
            document.removeEventListener("keydown", onOutsideClick);
        };
    }, [dropdownMenuOpen, toggleDropdown]);

    return (
        <div className={styles["dropdown-menu"]}>
            {dropdownMenuOpen ? <div className={`${styles["dropdown-menu__options"]} ${styles[getPosition(positionState?? CardDropdownAlignment.NONE)]}`} ref={modalRef}>
                <ul className={styles['dropdown-menu__list']}>
                    {renderDropdownMenuOptions(links)}
                </ul>
            </div> : null}
            <button className={styles["dropdown-menu__options-button"]} onClick={toggleDropdown}>
                <IconMoreHorizontal width={32} height={32} />
            </button>
        </div>);
}

export default CardDropdownMenu;

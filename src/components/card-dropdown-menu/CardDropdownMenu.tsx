import styles from '@/components/card-dropdown-menu/card-dropdown-menu.module.css'
import { useCallback, useEffect, useRef, useState } from 'react';
import IconMoreHorizontal from '../icons/icon-more-horizontal/IconMoreHorizontal';


interface CardDropdownMenuProps {
    onClose?: () => void;
    links?: DropdownMenuOption[];
}

interface DropdownMenuOption {
    label: string;
    href?: string;
    onClick?: () => void;
}


const CardDropdownMenu = ({ links }: CardDropdownMenuProps) => {

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
                        <button onClick={i.onClick} className={styles["dropdown-menu__button"]}>{i.label}</button>
                    )}
                </li>
            ))
        );
    }

    const toggleDropdown = useCallback(
        (() => setDropdownMenuOpen(!dropdownMenuOpen)), [dropdownMenuOpen]
    );

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
            {dropdownMenuOpen ? <div className={styles['dropdown-menu__options']} ref={modalRef}>
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

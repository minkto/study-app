import styles from '@/components/card-dropdown-menu/card-dropdown-menu.module.css'
import { useEffect, useRef } from 'react';


interface CardDropdownMenuProps {
    isOpen?: boolean;
    onClose: () => void;
    links?: DropdownMenuOption[];
}

interface DropdownMenuOption {
    label: string;
    href?: string;
    onClick?: () => void;
}


const CardDropdownMenu = ({ isOpen = false, onClose, links }: CardDropdownMenuProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const renderDropdownMenuOptions = (dropdownMenuOptions: DropdownMenuOption[] | undefined) => {
        if (dropdownMenuOptions === undefined) {
            return null;
        }
        return (
            dropdownMenuOptions?.map((i) => (
                <li key={i.label} className={styles["card-dropdown-menu__list-item"]}>
                    {i.href ? (
                        <a href={i.href} className={styles["card-dropdown-menu__link"]}>{i.label}</a>
                    ) : (
                        <button onClick={i.onClick} className={styles["card-dropdown-menu__button"]}>{i.label}</button>
                    )}
                </li>
            ))
        );
    }
    useEffect(() => {
        const onOutsideClick = (e: MouseEvent | KeyboardEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", onOutsideClick);
            document.addEventListener("keydown", onOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", onOutsideClick);
            document.removeEventListener("keydown", onOutsideClick);
        };
    }, [isOpen, onClose]);

    return (isOpen ? <div className={styles['card-dropdown-menu']} ref={modalRef}>
        <ul className={styles['card-dropdown-menu__list']}>
            {renderDropdownMenuOptions(links)}
            <li className={styles['card-dropdown-menu__list-item']}>Option 1</li>
            <li className={styles['card-dropdown-menu__list-item']}>Option 2</li>
            <li className={styles['card-dropdown-menu__list-item']}>Option 3</li>
        </ul>
    </div> : null);
}

export default CardDropdownMenu;

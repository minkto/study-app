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
    const firstOptionRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);


    const renderDropdownMenuOptions = (dropdownMenuOptions: DropdownMenuOption[] | undefined) => {
        if (dropdownMenuOptions === undefined) {
            return null;
        }

        const lastIndex = dropdownMenuOptions.length - 1;

        const handleLastItemKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Tab' && !e.shiftKey) {
                // Let the browser complete its native focus-move to the next
                // tabbable element FIRST (using the current DOM, menu still open),
                // then close the menu on the next tick so it doesn't rip the
                // focused element out mid-event.
                setTimeout(() => {
                    closeDropdown();
                }, 0);
            }
        };

        return (
            dropdownMenuOptions?.map((i, index) => (
                <li key={i.label} className={styles["dropdown-menu__list-item"]}>
                    {i.href ? (
                        <a ref={index === 0 ? (el) => { firstOptionRef.current = el } : undefined}
                            onKeyDown={index === lastIndex ? handleLastItemKeyDown : undefined}

                            href={i.href} className={styles["dropdown-menu__link"]}>{i.label}</a>
                    ) : (
                        <button
                            onKeyDown={index === lastIndex ? handleLastItemKeyDown : undefined}

                            ref={index === 0 ? (el) => { firstOptionRef.current = el } : undefined}
                            aria-label={i.label}
                            onClick={() => {
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

    const closeDropdown = useCallback(() => {
        setDropdownMenuOpen(false);
    }, []);

    const openDropdown = useCallback(() => {
        setDropdownMenuOpen(true);
    }, []);

    const toggleDropdown = useCallback(() => {
        setDropdownMenuOpen(prev => !prev);
    }, []);


    // Intercept Tab on the trigger button so it goes into the menu instead of tabbing out
    const handleTriggerKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'Tab' && !e.shiftKey) {
            if (!dropdownMenuOpen) {
                // let the click/keyboard-activation open it, then redirect focus
                openDropdown();
            }
            e.preventDefault();
            // wait a tick for the menu to render before focusing
            requestAnimationFrame(() => firstOptionRef.current?.focus());
        }
    }, [dropdownMenuOpen, openDropdown]);

    useEffect(() => {
        const onOutsideClick = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node) && e.target !== triggerRef.current) {
                closeDropdown();
            }
        }

        const onEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeDropdown();
                triggerRef.current?.focus();
            }
        }


        if (dropdownMenuOpen) {
            document.addEventListener("mousedown", onOutsideClick);
            document.addEventListener("keydown", onEscape);
        }

        return () => {
            document.removeEventListener("mousedown", onOutsideClick);
            document.removeEventListener("keydown", onEscape);
        };
    }, [dropdownMenuOpen, toggleDropdown, closeDropdown]);

    return (
        <div className={styles["dropdown-menu"]}>
            {dropdownMenuOpen ? <div className={`${styles["dropdown-menu__options"]} ${styles[getPosition(positionState ?? CardDropdownAlignment.NONE)]}`} ref={modalRef}>
                <ul className={styles['dropdown-menu__list']}>
                    {renderDropdownMenuOptions(links)}
                </ul>
            </div> : null}
            <button
                ref={triggerRef}
                aria-label="More Options"
                aria-expanded={dropdownMenuOpen}
                aria-haspopup="menu"
                className={styles["dropdown-menu__options-button"]}
                onClick={toggleDropdown}
                onKeyDown={handleTriggerKeyDown}>
                <IconMoreHorizontal width={32} height={32} />
            </button>
        </div>);
}

export default CardDropdownMenu;

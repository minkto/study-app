import IconCancel from "@/components/icons/icon-cancel/IconCancel";
import { useEffect, useRef } from "react";
import styles from './core-modal.module.css';

interface CoreModalProps {
    title?: string;
    children?: React.ReactNode;
    isActive?: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
}

export const CoreModal = ({ title, children, isActive, onConfirm, onClose }: CoreModalProps) => {
    const backgroundEl = useRef<HTMLDivElement>(null);
    const firstFocusElement = useRef<HTMLButtonElement>(null);
    const secondFocusElement = useRef<HTMLButtonElement>(null);

    const handleOnConfirm = () => {
        if (onConfirm !== undefined) {
            onConfirm();
        }
        if (onClose !== undefined) {
            onClose();
        }
    }

    useEffect(() => {
        const handleClose = (e: MouseEvent | KeyboardEvent) => {
            // Check to see if event is currently on background.
            if (backgroundEl.current === e.target) {
                if (onClose !== undefined) {
                    onClose();
                }
            }
        }

        /**
         * Used to ensure the modal is the main focus, when open.
         * @param e Keyboard event
         */
        const handleTrapFocus = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                const firstFocusable = firstFocusElement.current;
                const lastFocusable = secondFocusElement.current;
                const currentFocus = document.activeElement;

                // Shift key is checked as when going to previous element, it is true.
                if (e.shiftKey && currentFocus === firstFocusable) {
                    e.preventDefault();
                    lastFocusable?.focus();
                } else if (!e.shiftKey && currentFocus === lastFocusable) {
                    e.preventDefault();
                    firstFocusable?.focus();
                }
            }
        }

        if (isActive) {
            // Focus on the second button, to confirm
            firstFocusElement.current?.focus();

            backgroundEl.current?.addEventListener('mousedown', handleClose);
            backgroundEl.current?.addEventListener('keydown', handleClose);
            backgroundEl.current?.addEventListener('keydown', handleTrapFocus);
        }

        return () => {
            backgroundEl.current?.removeEventListener('mousedown', handleClose);
            backgroundEl.current?.removeEventListener('keydown', handleClose);
            backgroundEl.current?.removeEventListener('keydown', handleTrapFocus);
        }

    }, [isActive])
    return (
        isActive && <div ref={backgroundEl} className="modal-background" >
            <div className={'modal-content'}>
                <div className={styles['model-content-header']}>
                    {title && <h2>{title}</h2>}
                    <div className={styles['modal-options']}>
                        <button aria-label="close" className={styles["modal-close-btn"]} onClick={() => handleOnConfirm()}><IconCancel width={32} height={32} /></button>
                    </div>
                </div>
                {children}
            </div>
        </div>
    )
}

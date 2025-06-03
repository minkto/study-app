import { useEffect, useRef, useState } from 'react';
import styles from './confirmation-modal.module.css'


interface ConfirmationModalProps {
    headingText?: string;
    text?: string;
    subText?: string;
    confirmText?: string;
    cancelText?: string;
    isActive?: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
}

const ConfirmationModal = ({
    headingText = "",
    text = "",
    subText = "",
    confirmText = "Confirm",
    cancelText = "Cancel",
    isActive = false,
    onClose,
    onConfirm
}: ConfirmationModalProps) => {

    const backgroundEl = useRef<HTMLDivElement>(null);
    const firstFocusElement = useRef<HTMLButtonElement>(null);
    const secondFocusElement = useRef<HTMLButtonElement>(null);

    const handleOnConfirm = () => {
        if (onConfirm !== undefined) {
            onConfirm();
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

    }, [])
    return (
        isActive && <div ref={backgroundEl} className={styles["modal-background"]} >
            <div className={styles['modal-content']}>
                <div className={styles['modal-content-inner-block']}>
                    <h1 className={styles['modal-content-inner-block__heading']}>
                        {headingText}
                    </h1>
                </div>
                <div className={styles['modal-content-inner-block__text']}>
                    {text}
                </div>
                <div className={styles['modal-content-inner-block__sub-text']}>
                    {subText}
                </div>

                <div className={styles['modal-content-inner-block-buttons']}>
                    <button ref={firstFocusElement} className={styles['modal-content-inner-block-buttons__cancel']} onClick={onClose}>
                        {cancelText}
                    </button>
                    <button ref={secondFocusElement} className={styles['modal-content-inner-block-buttons__confirm']} onClick={handleOnConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal;
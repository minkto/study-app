import { useState } from 'react'

export interface ModalVisibilityState {
    isVisible: boolean;
    toggle: () => void;
    show: () => void;
    hide: () => void;
}

export function useModalVisibility(): ModalVisibilityState {
    const [isVisible, setIsVisible] = useState(false);

    const toggle = () => setIsVisible(prev => !prev);
    const show = () => setIsVisible(true);
    const hide = () => setIsVisible(false);

    return {
        isVisible,
        toggle,
        show,
        hide
    };
}
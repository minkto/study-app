"use client";

import CardDropdownMenu, { CardDropdownAlignment } from "../card-dropdown-menu/CardDropdownMenu";
import { useModalVisibility } from '@/hooks/useModalVisibility';
import DashboardModalPortal from '../dashboard-modal-portal/DashboardModalPortal';
import { CoreModal } from '../modals/core-modal/CoreModal';
import { Note } from "@/shared.types";
import NotesForm from "../notes-form/NotesForm";
import ConfirmationModal from "../modals/confirmation-modal/ConfirmationModal";
import { useCallback, useMemo, useState } from "react";
import styles from './notes-card.module.css';

interface NotesCardProps {
    note: Note;
    noteNumber: number;
}


export const NotesCard = ({ note, noteNumber }: NotesCardProps) => {

    const ModalActiveState = useMemo(() => ({
        ADD: 0,
        VIEW: 1,
        EDIT: 2,
        DELETE: 3,
    }), []);

    const { isVisible: modalVisible, toggle: handleModalVisibility, hide } = useModalVisibility();
    const [activeModal, setActiveModal] = useState<number>(ModalActiveState.ADD);

    const getModalTitle = useCallback((modalActiveState: number): string => {
        switch (modalActiveState) {
            case ModalActiveState.ADD:
                return "Add Note"
            case ModalActiveState.EDIT:
                return "Edit Note"
            case ModalActiveState.VIEW:
                return "View Note";
            case ModalActiveState.DELETE:
                return "Delete Note";
            default:
                return "Add Note";
        }
    }, [ModalActiveState.ADD, ModalActiveState.DELETE, ModalActiveState.EDIT, ModalActiveState.VIEW])

    return (
        <div className={styles["notes-card"]}>
            <DashboardModalPortal show={modalVisible}>
                <CoreModal title={getModalTitle(activeModal)} onClose={hide}
                    isActive={modalVisible &&
                        (activeModal == ModalActiveState.EDIT || activeModal == ModalActiveState.ADD
                            || activeModal == ModalActiveState.VIEW
                        )
                    }>
                    <NotesForm chapterId={Number(note.chapterId)} />
                </CoreModal>
                <ConfirmationModal
                    onClose={hide}
                    onConfirm={async () => {
                    }}
                    isActive={activeModal == ModalActiveState.DELETE}
                    text={`Are you sure you would like to delete note ${noteNumber}?`}
                    subText={`${note?.content}`}
                    confirmText="Yes, Delete"
                    headingText="Delete Note"
                />
            </DashboardModalPortal>
            <div className={styles["notes-card-header"]}>
                <span className={styles["note-card__note-number"]}>#{noteNumber}</span>
                {<CardDropdownMenu
                    positionState={CardDropdownAlignment.CENTER} links={
                        [
                            {
                                label: "View",
                                onClick: () => {
                                    setActiveModal(ModalActiveState.VIEW);
                                    handleModalVisibility();
                                }
                            },
                            {
                                label: "Edit",
                                onClick: () => {
                                    setActiveModal(ModalActiveState.EDIT);
                                    handleModalVisibility();
                                }
                            },
                            {
                                label: "Delete",
                                onClick: () => {
                                    setActiveModal(ModalActiveState.DELETE);
                                    handleModalVisibility();
                                }
                            },
                        ]
                    } />}

            </div>
            <p className="notes-card__content">{note.content}</p>
        </div >

    )
}

export default NotesCard;
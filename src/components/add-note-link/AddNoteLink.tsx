"use client";

import { useModalVisibility } from '@/hooks/useModalVisibility';
import DashboardModalPortal from '../dashboard-modal-portal/DashboardModalPortal';
import { CoreModal } from '../modals/core-modal/CoreModal';
import NotesForm from '../notes-form/NotesForm';
import { useParams } from 'next/navigation'
import { FormState } from '@/constants/constants';


interface AddNoteLinkProps {
    onAddNote?: () => Promise<void>;
}

export const AddNoteLink = ({ onAddNote }: AddNoteLinkProps) => {
    const { isVisible: modalVisible, toggle: handleModalVisibility, hide } = useModalVisibility();

    const params = useParams();

    const chapterId = params?.["chapter-id"] as string;

    return (<div>
        <DashboardModalPortal show={modalVisible}>
            <CoreModal title='Add Note' onClose={hide}
                isActive={modalVisible
                }>
                <NotesForm onFormSubmit={async () => {
                    if (onAddNote !== undefined) {
                        await onAddNote();
                        handleModalVisibility();
                    }

                }} state={FormState.ADD} chapterId={Number(chapterId)} />
            </CoreModal>
        </DashboardModalPortal>

        <button className="dashboard-primary-btn" onClick={() => {
            handleModalVisibility();
        }}>Add</button>
    </div>
    );
}

export default AddNoteLink;
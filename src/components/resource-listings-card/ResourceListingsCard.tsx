import CategoryPill from '../category-pill/CategoryPill';
import styles from './resource-listings-card.module.css'
import CardDropdownMenu from '../card-dropdown-menu/CardDropdownMenu';
import { GetResourceDto } from '@/shared.types';
import { useEffect, useState } from 'react';
import DashboardModal from '../dashboard-modal-portal/DashboardModalPortal';
import ConfirmationModal from '../modals/confirmation-modal/ConfirmationModal';

interface ResourceListingsCardProps {
    resource: GetResourceDto;
    onDelete: (id: number | undefined) => Promise<void>;
}

const renderCategory = (resource: GetResourceDto) => {
    if (resource?.categoryName !== "" &&
        resource?.categoryName !== undefined &&
        resource?.categoryName !== null) {
        return (
            <div className={styles["resources-listing-card__category"]}>
                <CategoryPill title={resource.categoryName} />
            </div>
        )
    }

    return null;
}

const ResourceListingsCard = ({ resource, onDelete }: ResourceListingsCardProps) => {

    const [progressBarWidth, setProgressBarWidth] = useState("0%");
    const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

    const handleModalVisibility = () => {
        setDeleteModalVisible(!deleteModalVisible);
    }

    useEffect(() => {
        setProgressBarWidth(`calc(${resource.percentageCompleted}%)`);
    }, [resource.percentageCompleted]);

    return (
        <div className={styles["resources-listing-card"]}>
            <DashboardModal show={deleteModalVisible}>
                <ConfirmationModal
                    headingText='Delete Resource'
                    text={`Are you sure you would like to delete this resource.`}
                    subText='NOTE: All chapters will also be deleted.'
                    confirmText='Yes, Delete'
                    onClose={handleModalVisibility} isActive={deleteModalVisible}
                    onConfirm={() => onDelete(resource.resourceId)} />
            </DashboardModal>
            <div className={styles["resources-listing-card__row"]}>
                <h2 className={styles["resources-listing-card__name"]}>{resource.name}</h2>
                {<CardDropdownMenu links={
                    [
                        { href: `resources/${resource.resourceId}/chapters`, label: "View Chapters" },
                        { href: `resources/${resource.resourceId}/edit-resource`, label: "Edit Resource" },
                        {
                            onClick: () => {
                                handleModalVisibility();
                            }, label: "Delete Resource"
                        },
                    ]
                } />}
            </div>

            <div className={styles["resources-listing-card__row"]}>
                {/*<!-- Percentage Component -->*/}
                <div className={styles["resources-listing-card__progress-bar"]}>
                    <div className={styles["resources-listing-card__progress-bar__name"]}>Percentage Complete</div>
                    <div className={styles["resources-listing-card__progress-bar__background"]}>
                        <div style={{ width: progressBarWidth }} className={styles["resources-listing-card__progress-bar__overlay"]}></div>
                        <div className={styles["resources-listing-card__progress-bar__value"]}>{resource.percentageCompleted}%</div>
                    </div>

                </div>
                {renderCategory(resource)}
            </div>
            <div className={styles["resources-listing-card__description"]}>
                <p className={styles["max-lines"]}>{resource?.description}</p>
                <div className={styles["resources-listing-card__description-container"]}></div>
            </div>

            <div className={styles["resources-listing-card__description-overlay"]}></div>
        </div>
    );
}

export default ResourceListingsCard;
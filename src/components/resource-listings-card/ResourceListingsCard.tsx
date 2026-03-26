import CategoryPill from '../category-pill/CategoryPill';
import styles from './resource-listings-card.module.css'
import CardDropdownMenu from '../card-dropdown-menu/CardDropdownMenu';
import { GetResourceDto } from '@/shared.types';
import DashboardModalPortal from '../dashboard-modal-portal/DashboardModalPortal';
import ConfirmationModal from '../modals/confirmation-modal/ConfirmationModal';
import { useModalVisibility } from '@/hooks/useModalVisibility';
import ResourceProgressBar from '../resource-progress-bar/ResourceProgressBar';

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

    const { isVisible: deleteModalVisible, toggle: handleModalVisibility, hide } = useModalVisibility();

    return (
        <div className={styles["resources-listing-card"]}>
            <DashboardModalPortal show={deleteModalVisible}>
                <ConfirmationModal
                    headingText='Delete Resource'
                    text={`Are you sure you would like to delete this resource.`}
                    subText='NOTE: All chapters will also be deleted.'
                    confirmText='Yes, Delete'
                    onClose={hide} isActive={deleteModalVisible}
                    onConfirm={() => onDelete(resource.resourceId)} />
            </DashboardModalPortal>
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

            {renderCategory(resource)}

            <div className={styles["resources-listing-card__row"]}>
                <ResourceProgressBar percentageCompleted={resource?.chaptersProgressDetails?.percentageCompleted} />
            </div>
            <div className={styles["resources-listing-card__description"]}>
                <p className={styles["max-lines"]}>{resource?.description}</p>
                <div className={styles["resources-listing-card__description-container"]}></div>
            </div>
        </div>
    );
}

export default ResourceListingsCard;
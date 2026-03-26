import CategoryPill from "@/components/category-pill/CategoryPill";
import ResourceProgressBar from "@/components/resource-progress-bar/ResourceProgressBar";
import { getResourceDto } from "@/services/resourceService";
import { GetResourceDto } from "@/shared.types";
import { isStringEmpty } from "@/utils/stringUtils";
import { auth } from "@clerk/nextjs/server";
import styles from './page.module.css'

export default async function Page({ params }: { params: Promise<{ "resource-id": string }> }) {

    const { "resource-id": resourceId } = await params;
    const { userId, redirectToSignIn } = await auth();
    if (isStringEmpty(userId)) {
        redirectToSignIn();
    }

    const getResourceDetails = async () => {
        try {
            const response = await getResourceDto(Number(resourceId), userId)

            if (!response) {
                throw new Error(`Failed to fetch resource: ${response}`)
            }

            return response

        } catch (error) {
            console.error("Error fetching resource:", error)
            return null
        }
    }

    const resource: GetResourceDto | null = await getResourceDetails();

    return <div>
        <div className={styles["resource-details-section"]}>
            <h1 className={styles["resource-details__title"]}>{resource?.name}</h1>
            {resource?.categoryId && <div className={styles["resource-details__category"]}>
                <CategoryPill title={resource?.categoryName} />
            </div>}
        </div>

        <div className={styles["resource-details__progress-details"]}>
            <div className={styles["progress-details__percentage"]}>
                <ResourceProgressBar percentageCompleted={resource?.chaptersProgressDetails?.percentageCompleted} />
            </div>
            <div className={styles["progress-details__progress"]}>
                <h3>{resource?.chaptersProgressDetails?.totalChaptersComplete}/{resource?.chaptersProgressDetails?.totalChapters}</h3>
                <h4>Chapters</h4>
            </div>

        </div>
    </div>
}
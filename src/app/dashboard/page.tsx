import styles from './page.module.css'

export default function Page() {

    const renderSmallCard = (text: string) => {
        return <div className={`${styles[text]}`}>
            <div className={`${styles["dashboard-statistics-sm-card"]} ${text}`}>
                <div className={styles["dashboard-statistics-sm-card__title"]}>
                    <h4>Total Chapters Reviewed</h4>
                </div>
                <div className={styles["dashboard-statistics-sm-card__count"]}>
                    <h2>0</h2>
                </div>
                <div className={styles["dashboard-statistics-sm-card__sub-heading"]}>
                    <h4>Completed Today</h4>
                </div>
            </div>
        </div>

    }


    const renderMediumCard = (text: string) => {
        return <div className={styles[`${text}`]}>
             <div className={styles[`dashboard-statistics-md-card`]}>
                <div className={styles["dashboard-statistics-md-card__title"]}>Total Chapters Reviewed</div>
                <div className={styles["dashboard-statistics-md-card__count"]}>
                    <h2>0</h2>
                </div>
                <div className={styles["dashboard-statistics-md-card__sub-heading"]}>Completed This Month</div>
            </div>
        </div>
    }

    return (
        <div className={styles["dashboard-statistics"]}>
            <div className={styles["dashboard-statistics__heading"]}>
                <h2>Home</h2>
            </div>
            <div className={styles["dashboard-statistics-row"]}>
                {renderSmallCard("sa-col-1")}
                {renderSmallCard("sa-col-1")}
                {renderSmallCard("sa-col-1")}
            </div>
            <div className={styles["dashboard-statistics-row"]}>
                {renderMediumCard("sa-col-2")}
                {renderMediumCard("sa-col-2")}
            </div>
            <div className={styles["dashboard-statistics-row"]}>
                {renderMediumCard("sa-col-2")}
                {renderMediumCard("sa-col-2")}
            </div>
        </div>);
}
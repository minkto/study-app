import styles from './category-pill.module.css'

const CategoryPill = () => {
    return (<div className={styles["resources-listing-card-category__pill"]}>
        <p className={styles["resources-listing-card-category-pill__text"]}>
            Card Category
        </p>
    </div>)
}

export default CategoryPill;
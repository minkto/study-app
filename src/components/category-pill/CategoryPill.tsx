import styles from './category-pill.module.css'


interface CategoryPillProps
{
    title?: string
}

const CategoryPill = ({title} : CategoryPillProps) => {
    return (<div className={styles["resources-listing-card-category__pill"]}>
        <p className={styles["resources-listing-card-category-pill__text"]}>
            {title}
        </p>
    </div>)
}

export default CategoryPill;
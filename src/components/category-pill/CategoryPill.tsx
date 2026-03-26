import { DEFAULT_CATEGORY_COLOR } from '@/constants/constants';
import styles from './category-pill.module.css'

interface CategoryPillProps {
    title?: string | null;
    color?: string | null;
}

const CategoryPill = ({ title,color }: CategoryPillProps) => {
    return (<div className={styles["category__pill"]}>
        <div style={{backgroundColor: color ?? DEFAULT_CATEGORY_COLOR }} className={styles["category-pill__color-tag"]}></div>
        <p className={styles["category-pill__text"]}>
            {title}
        </p>
    </div>)
}

export default CategoryPill;
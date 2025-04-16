import IconChevronDown from '../icons/icon-chevron-down/IconChevronDown';
import IconFilter from '../icons/icon-filter/IconFilter';
import styles from './listings-search-filter-options.module.css'

export const ListingsSearchFilterOptions = () => {
    return (<div className={styles["search-filter-options"]}>
        <button className={styles["search-filter-options__btn"]}><IconFilter className={"icon-wrapper"} width={20} height={20}/>Filter By</button>
        <button className={styles["search-filter-options__btn"]}><IconChevronDown className={"icon-wrapper"} width={20} height={20}/>Sort By</button>
    </div>)
}

export default ListingsSearchFilterOptions;
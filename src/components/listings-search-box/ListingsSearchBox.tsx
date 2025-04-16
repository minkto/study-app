import IconSearch from '../icons/icon-search/IconSearch'
import styles from './listings-search-box.module.css'

export const ListingsSearchBox = () => {

    return (
        <div className={styles["search-box-listing"]}>
            <input className={styles["search-box-listing__text"]} type="text"></input>
            <button className={styles["search-box-listing__submit-btn"]}><IconSearch width={20} height={20}/></button>   
        </div>
    )
}

export default ListingsSearchBox
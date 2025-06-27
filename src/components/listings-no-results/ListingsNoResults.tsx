import styles from './listings-no-results.module.css';

export const ListingsNoResults = () => {
    return (<div className={styles["listings-no-results"]}>
        <h1>No results found</h1>
        <p>If you are expecting some results, refine your search and please try again.</p>
    </div>)
}

export default ListingsNoResults;
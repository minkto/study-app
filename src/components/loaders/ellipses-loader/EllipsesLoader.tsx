import styles from './ellipses-loader.module.css';

const EllipsesLoader = () => {
    return (
        <div className={styles["ellipses-loader__wrapper"]}>
            <p>Waiting for response...</p>
            <span className={styles["loader"]}></span>
        </div>
    )
}

export default EllipsesLoader;
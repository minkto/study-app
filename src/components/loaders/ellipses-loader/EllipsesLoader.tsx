import styles from './ellipses-loader.module.css';

interface EllipsesLoaderProps 
{
    message?: string;
}

const EllipsesLoader = ({message = "Waiting for response..."} : EllipsesLoaderProps) => {
    return (
        <div className={styles["ellipses-loader__wrapper"]}>
            <p>{message}</p>
            <span className={styles["loader"]}></span>
        </div>
    )
}

export default EllipsesLoader;
import Image from "next/image"
import styles from "./not-found.module.css"

export default function NotFound() {
    return (<div className={styles["not-found-container"]}>
        <Image src="/avatar/learn-lobe-404-image.svg" alt="404" width={200} height={200} />
        <h1 className={styles["not-found-title"]}>404</h1>
        <h2 className={styles["not-found-subtitle"]}>Oops! We could not find the page you are looking for.</h2>
    </div>)
}
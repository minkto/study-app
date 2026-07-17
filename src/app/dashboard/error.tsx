"use client"

import styles from '../error.module.css'
import Image from 'next/image'


export default function ErrorPage({
    error,
}: {
    error: Error & { digest?: string }
}) {

    const isProd = process.env.NODE_ENV === "production";
    
    return (

        <div className={styles["error-container"]}>
            <Image src="/avatar/learn-lobe-500-image.svg" alt="500" width={200} height={200} />
            <h1 className={styles["error-title"]}>500</h1>
            <h2 className={styles["error-subtitle"]}>Internal Server Error</h2>
            <h3 className={styles["error-summary"]}>Something went wrong! An unexpected error has occured.</h3>
            {!isProd &&
                <>
                    <h4>Error Message</h4>
                    <p>{error.message}</p>
                    <h4>Stack Trace</h4>
                    <p>{error.stack}</p>
                </>}
        </div>
    )
}
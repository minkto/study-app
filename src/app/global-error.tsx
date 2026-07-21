"use client"

import Link from 'next/link'
import styles from './error.module.css'
import Image from 'next/image'


export default function GlobalError({
    error,
}: {
    error: Error & { digest?: string }
}) {

    const isProd = process.env.NODE_ENV === "production";

    return (
        <html lang="en">
            <head>
                <title>500 - Internal Server Error | LearnLobe</title>
                <meta name='description' content='An unexpected error has occured.'/>
            </head>
            <body className={styles["error-container-body"]}>
                <main className={styles["error-container"]}>
                    <Image src="/avatar/learn-lobe-500-image.svg" alt="500" width={200} height={200} />
                    <h1 className={styles["error-title"]}>500</h1>
                    <h2 className={styles["error-subtitle"]}>Internal Server Error</h2>
                    <h3>Something went wrong! An unexpected error has occured.</h3>
                    <Link className={styles["error-link"]} href="/dashboard">Return to Dashboard</Link>
                    {!isProd &&
                        <>
                            <p>Error Message : {error.message}</p>
                            <p>Stack Trace: {error.stack}</p>
                        </>}
                </main>
            </body>
        </html>
    )
}
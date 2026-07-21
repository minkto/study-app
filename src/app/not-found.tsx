import Link from 'next/link'
import Image from 'next/image'
import styles from './not-found.module.css'
import { Metadata } from 'next'


export const metadata: Metadata = {
    title: '404 - Page Not Found | LearnLobe',
    description: 'The requested page could not be found.',
}

export default function NotFound() {
  return (
    <div className={styles["not-found-container"]}>
      <Image src="/avatar/learn-lobe-404-image.svg" alt="404" width={200} height={200} />
      <h1 className={styles["not-found-title"]}>404</h1>
      <h2 className={styles["not-found-subtitle"]}>Oops! We could not find the page you are looking for. Let&apos;s go back to the dashboard.</h2>
      <Link className={styles["not-found-link"]} href="/dashboard">Return to Dashboard</Link>
    </div>
  )
}
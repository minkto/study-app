import styles from './auth-page-layout.module.css'
import Image from 'next/image'
import logo from './login-page-backaground-v2.svg'

export default function Layout({children} : {children: React.ReactNode}) {
    return (
        <div className={styles["auth-container"]}>
            <div className={styles["auth-section-image-wrapper"]}>
                <Image
                    src={logo}
                    alt="Authentication Screen Book and Mountain Image"
                    height={1024}
                />
            </div>
            <div className={styles["auth-section-page-details"]}>
                {children}
            </div>
        </div>
    )
}
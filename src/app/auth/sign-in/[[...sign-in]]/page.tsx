import { SignIn } from "@clerk/nextjs";
import styles from '../../auth-page-layout.module.css';

export default function Page() {
    return (
        <div className={styles["auth-child-items"]}>
            <h1>Keep on Learning.</h1>
            <SignIn />
        </div>
    )
}
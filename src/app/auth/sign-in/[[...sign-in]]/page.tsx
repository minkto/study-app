import { SignIn } from "@clerk/nextjs";
import styles from '../../auth-page-layout.module.css';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Sign In | LearnLobe',
  description: 'Sign In to start managing your resources for learning.',
}

export default function Page() {
    return (
        <div className={styles["auth-child-items"]}>
            <h1>Keep on Learning.</h1>
            <SignIn />
        </div>
    )
}
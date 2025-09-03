"use client";

import { useState } from "react";
import styles from "./ai-chat-confirmation-message.module.css"
import EllipsesLoader from "../loaders/ellipses-loader/EllipsesLoader";

interface AIChatConfirmationMessageProps {
    text?: string;
    onConfirm: () => Promise<void>;
    onCancel: () => Promise<void>;
}

export const AIChatConfirmationMessage = ({ text = "", onCancel, onConfirm }: AIChatConfirmationMessageProps) => {
    const [isDone, setIsDone] = useState(false);
    const [chatResourceResponseLoading, setChatResourceResponseLoading] = useState(false);

    const confirmHandler = async () => {
        setChatResourceResponseLoading(true);
        await onConfirm();
        setChatResourceResponseLoading(false);
    }

    return chatResourceResponseLoading ? <EllipsesLoader /> :
        <div className={styles["ai-chat-window-resources-options"]}>
            <p>{text}</p>
            {!chatResourceResponseLoading ? <div className={styles["ai-chat-window-response-options"]}>
                {<>
                    <button disabled={isDone} className="dashboard-primary-btn"
                        onClick={async () => {
                            setIsDone(true);
                            await onCancel();
                        }}>No</button>
                    <button disabled={isDone} className="dashboard-primary-btn"
                        onClick={async () => {
                            setIsDone(true);
                            await confirmHandler()
                        }}>Yes</button>

                </>
                }
            </div> : null}

        </div>

}

export default AIChatConfirmationMessage;

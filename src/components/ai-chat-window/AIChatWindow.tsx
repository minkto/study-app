import styles from "./ai-chat-window.module.css";

interface AIChatWindowProps {
    messages?: string[];
}

const AIChatWindow = ({ messages }: AIChatWindowProps) => {
    return (
        <div className={styles["ai-chat-window"]}>
            {messages && messages.length > 0 ? (messages.map((message, index) =>
            (
                <div key={index} className={styles["ai-chat-window-request"]}>
                    <p className={styles["ai-chat-window-request__message"]}>{message}</p>
                </div>))) : null}
        </div>
    )

}


export default AIChatWindow;
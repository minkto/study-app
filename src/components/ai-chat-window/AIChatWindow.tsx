import { AIChatMessages } from "@/shared.types";
import styles from "./ai-chat-window.module.css";

interface AIChatWindowProps {
    chatMessages?: AIChatMessages;
}

const AIChatWindow = ({ chatMessages }: AIChatWindowProps) => {
    return (
        <div className={styles["ai-chat-window"]}>
            {chatMessages && chatMessages?.messages?.length > 0 ? (chatMessages.messages.map((message, index) =>
            (
                <div key={index} className={styles["ai-chat-window-request__messages"]}>
                    <p className={styles["ai-chat-window-request__message"]}>{message.requestMessage}</p>
                    <p className={styles["ai-chat-window-response__message"]}>{message.responseMessage}</p>
                </div>))) : null}
        </div>
    )

}

export default AIChatWindow;
import { AIChatMessages } from "@/shared.types";
import styles from "./ai-chat-window.module.css";
import EllipsesLoader from "../loaders/ellipses-loader/EllipsesLoader";

interface AIChatWindowProps {
    chatMessages?: AIChatMessages;
    isLoading?: boolean;
    currentRequestMessage?: string;
}

const AIChatWindow = ({ chatMessages, isLoading, currentRequestMessage }: AIChatWindowProps) => {

    const renderLoading = () => {
        return (<div className={styles["ai-chat-window-messages"]}>
            <p className={styles["ai-chat-window-messages__current-request"]}>{currentRequestMessage}</p>
            <div className={styles["ai-chat-window-messages__loader"]}>
                <EllipsesLoader />
            </div>
        </div>)
    }

    return (
        <div className={styles["ai-chat-window"]}>
            {chatMessages && chatMessages?.messages?.length > 0 ? (chatMessages.messages.map((message, index) =>
            (
                <div key={index} className={styles["ai-chat-window-messages"]}>
                    <p className={styles["ai-chat-window-messages__request"]}>{message.requestMessage}</p>
                    <p className={styles["ai-chat-window-messages__response"]}>{message.responseMessage}</p>
                </div>))) : null}
            {isLoading ? renderLoading() : null}
        </div>
    )

}

export default AIChatWindow;
import { AIChatMessages, AIChatApiResponse } from "@/shared.types";
import styles from "./ai-chat-window.module.css";
import EllipsesLoader from "../loaders/ellipses-loader/EllipsesLoader";

interface AIChatWindowProps {
    chatMessages?: AIChatMessages;
    currentRequestMessage?: string;
    isLoading?: boolean;
}

const AIChatWindow = ({ chatMessages, isLoading, currentRequestMessage }: AIChatWindowProps) => {

    const renderResourcesResponse = (responseObject: AIChatApiResponse) => {
        return (
            <div>
                {responseObject.resources && responseObject.resources.map((resource, index) => (
                    <div key={index} className={styles["ai-chat-window-messages__resource"]}>
                        <h3>{resource.name}</h3>
                        <h4>Chapters</h4>
                        {resource.chapters && resource.chapters.length > 0 ? (
                            resource.chapters.map((chapter: string, chapterIndex: number) => (
                                <ul key={chapterIndex}>
                                    <li>{chapter}</li>
                                </ul>
                            ))
                        ) : null}
                        {resource.source ? (
                            <div className={styles["ai-chat-window-messages__source"]}>
                                <h4>Source</h4>
                                <a href={resource.source} target="_blank" rel="noopener noreferrer">{resource.source}</a>
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>
        );
    }

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
                    {message.responseObject ? renderResourcesResponse(message.responseObject) : null}
                </div>))) : null}
            {isLoading ? renderLoading() : null}
        </div>
    )
}

export default AIChatWindow;
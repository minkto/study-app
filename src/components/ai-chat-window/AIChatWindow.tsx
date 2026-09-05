import { AIChatMessages, AIChatApiResponse, Resource, AIChatMessage } from "@/shared.types";
import styles from "./ai-chat-window.module.css";
import EllipsesLoader from "../loaders/ellipses-loader/EllipsesLoader";
import AIChatConfirmationMessage from "../ai-chat-confirmation-message/AIChatConfirmationMessage";
import { memo, useCallback, useState } from "react";

interface AIChatWindowProps {
    addChatMessage?: (message: AIChatMessage) => void;
    chatMessages?: AIChatMessages;
    currentRequestMessage?: string;
    isLoading?: boolean;
}

interface AIChatMessageItemProps {
    message: AIChatMessage;
    onConfirmResource: (responseObject: AIChatApiResponse | undefined) => Promise<void>;
    onCancelConfirmation: () => Promise<void>;
}

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

const AIChatMessageItem = memo(({ message, onConfirmResource, onCancelConfirmation }: AIChatMessageItemProps) => {

    const renderChatConfirmationMessageForResources = () => {
        if (message?.responseObject &&
            message.responseObject.resources &&
            message.responseObject.resources.length > 0 &&
            message.showConfirmationOptions) {
            return <AIChatConfirmationMessage
                text={message?.responseMessage}
                onConfirm={() => onConfirmResource(message?.responseObject)}
                onCancel={onCancelConfirmation} />
        }
    }

    const renderChatMessage = () => {

        if (!message) {
            return null;
        }

        if (message?.showConfirmationOptions === true) {
            return renderChatConfirmationMessageForResources();
        }

        if (message.requestMessage) {
            return <p className={styles["ai-chat-window-messages__request"]}>{message.requestMessage}</p>
        }

        if (message.responseMessage) {
            return <p className={styles["ai-chat-window-messages__response"]}>{message.responseMessage}</p>
        }

        if (message.responseObject) {
            return renderResourcesResponse(message.responseObject);
        }
    }

    return (
        <div className={styles["ai-chat-window-messages"]}>
            {renderChatMessage()}
        </div>
    );
});

AIChatMessageItem.displayName = "AIChatMessageItem";

const AIChatWindow = ({ addChatMessage, chatMessages, isLoading, currentRequestMessage }: AIChatWindowProps) => {

    const [chatCreateResourceErrorCount, setChatCreateResourceErrorCount] = useState(0);

    async function createResourcesFromAIService(resources: Resource[]): Promise<boolean> {
        try {
            const response = await fetch(`/api/resources/bulk`, {
                method: 'POST',
                body: JSON.stringify({ resources }),
            });

            const body = await response.json();

            if (!response.ok) {
                return false;
            }

            return body.success;

        } catch (error) {
            console.error("Error has occured creating resources from AI Services: ", error);
            return false;
        }
    }

    const createResourceFromResponse = useCallback(async (responseObject: AIChatApiResponse | undefined) => {

        if (responseObject?.resources !== undefined && responseObject.resources !== null) {

            const mappedResources = responseObject.resources.map<Resource>((r) => {
                return {
                    name: r?.name ?? "",
                    isPinned: false,
                    chapters: r.chapters?.map((chapter) => {
                        return {
                            name: chapter
                        }
                    })
                }
            })

            const result = await createResourcesFromAIService(mappedResources);
            setupChatReplyFromResult(responseObject,result);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatCreateResourceErrorCount, addChatMessage])

    const setupChatReplyFromResult = (responseObject: AIChatApiResponse, result: boolean) => {
        const chatMessage: AIChatMessage = {};

        if (chatCreateResourceErrorCount >= 2) {
            chatMessage.responseMessage = generateErrorMessage();
            setChatCreateResourceErrorCount(0);
        }
        else if (!result) {

            chatMessage.requestMessage = "";
            chatMessage.responseMessage = generateErrorMessage();
            chatMessage.responseObject = responseObject;
            chatMessage.showConfirmationOptions = true;
            setChatCreateResourceErrorCount((prevChatCreateResourceErrorCount) => prevChatCreateResourceErrorCount + 1);
        }
        else {
            chatMessage.responseMessage = `Success: The action of creating has been successful. If you wish to add more, please add a new prompt.`;
            chatMessage.responseObject = {};
            setChatCreateResourceErrorCount(0);
        }

        if (addChatMessage) {
            addChatMessage(chatMessage);
        }
    }

    const generateErrorMessage = (): string => {
        if (chatCreateResourceErrorCount > 1) {
            return "Error: Cannot perform the create action on multiple attempts. Please try again later or a different prompt.";
        }
        if (chatCreateResourceErrorCount === 1) {
            return "Error: An issue has occured, please try one more time.";
        }

        return "Error: An issue has occured, please try again.";
    }

    const onCancelConfirmation = useCallback(async () => {
        if (addChatMessage) {
            addChatMessage(
                {
                    responseMessage: "Please type a new prompt if you require my service."
                });
        }
    }, [addChatMessage])

    const renderLoading = (showRequest: boolean = true) => {
        return (<div className={styles["ai-chat-window-messages"]}>
            {showRequest ? <p className={styles["ai-chat-window-messages__current-request"]}>{currentRequestMessage}</p> : null}
            <div className={styles["ai-chat-window-messages__loader"]}>
                <EllipsesLoader />
            </div>
        </div>)
    }

    return (
        <div className={styles["ai-chat-window"]}>
            {chatMessages && chatMessages?.messages?.length > 0 ? (chatMessages.messages.map((message, index) =>
            (
                <AIChatMessageItem
                    key={index}
                    message={message}
                    onConfirmResource={createResourceFromResponse}
                    onCancelConfirmation={onCancelConfirmation} />
            ))) : null}
            {isLoading ? renderLoading() : null}
        </div>
    )
}

export default AIChatWindow;
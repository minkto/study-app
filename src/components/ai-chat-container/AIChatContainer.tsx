"use client";

import { useState } from "react";
import AIChatWindow from "../ai-chat-window/AIChatWindow";
import AISearchBar from "../ai-search-bar/AISearchBar";
import styles from "./ai-chat-container.module.css";
import { AIChatMessages, AIChatApiResponse, AIChatMessage } from "@/shared.types";

const AIChatContainer = () => {

    const [currentRequestMessage, setCurrentRequestMessage] = useState<string>("");
    const [chatMessages, setChatMessages] = useState<AIChatMessages>({ messages: [] });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function getResourcesFromAIChatService(prompt: string): Promise<AIChatApiResponse> {
        try {
            const response = await fetch(`/api/ai/chat`, {
                method: 'POST',
                body: JSON.stringify({ prompt }),
            });

            const body = await response.json();

            if (!response.ok) {
                return { resources: [], errorMessage: body?.error?.errorMessage };
            }

            return body?.resources;

        } catch (error) {
            console.error("Error has occured while fetching resources from AI Services: ", error);
            return { resources: [] };
        }
    }

    const handleOnSubmit = (text: string) => {
        const inputValue = text?.trim() || "";

        if (inputValue !== "") {
            addChatMessages(inputValue);
        }
    };


    const addResponseMessage = async (message: AIChatMessage) => {
        setChatMessages(prev => ({
            ...prev,
            messages: [
                ...prev.messages,
                {
                    requestMessage: message.requestMessage,
                    responseMessage: message.responseMessage,
                    responseObject: message.responseObject,
                    showConfirmationOptions: message.showConfirmationOptions
                }
            ]
        }));
    }

    const addChatMessages = async (text: string) => {
        try {
            setIsLoading(true);
            setCurrentRequestMessage(text);

            const result = await getResourcesFromAIChatService(text);

            setChatMessages(prevChatMessages => ({
                messages: [...prevChatMessages.messages,
                {
                    requestMessage: text,
                },
                {
                    responseMessage: constructResponseMessage(result),
                },

                {
                    responseObject: result
                },
                {
                    requestMessage: "",
                    responseMessage: "Do you wish to create these resource(s)?",
                    responseObject: result,
                    showConfirmationOptions: true
                }
                ]
            }));

        } catch (error) {
            console.error("Error adding request message:", error);
            return;
        }
        finally {
            setIsLoading(false);
        }
    }

    const constructResponseMessage = (response: AIChatApiResponse): string => {
        if (response?.errorMessage) {
            return `Error: ${response.errorMessage}Please try again shortly.`;
        }

        if (response.resources?.length === 0) {
            return `No resources could be found. Try to refine your search.`
        }

        return `I have found ${response.resources?.length || 0} resource${response?.resources?.length ?? 0 > 1 ? "s" : ""} for you.`;
    }

    return (
        <div className={styles["ai-chat-container"]}>
            <AISearchBar onSearchSubmit={handleOnSubmit} isLoading={isLoading} />
            <AIChatWindow addChatMessage={addResponseMessage}

                currentRequestMessage={currentRequestMessage}
                chatMessages={chatMessages}
                isLoading={isLoading} />
        </div>
    );
}

export default AIChatContainer;
"use client";

import { useState } from "react";
import AIChatWindow from "../ai-chat-window/AIChatWindow";
import AISearchBar from "../ai-search-bar/AISearchBar";
import styles from "./ai-chat-container.module.css";
import { AIChatMessages } from "@/shared.types";

const AIChatContainer = () => {

    const [currentRequestMessage, setCurrentRequestMessage] = useState<string>("");
    const [chatMessages, setChatMessages] = useState<AIChatMessages>({ messages: [] });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Simulates a slow function
    function slowFunction(ms = 2000) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(`Finished after ${ms}ms`);
            }, ms);
        });
    }

    const handleOnSubmit = (text: string) => {
        const inputValue = text?.trim() || "";

        if (inputValue !== "") {
            addRequestMessage(inputValue);
        }
    };

    const addRequestMessage = async (text: string) => {
        try {
            setIsLoading(true);
            setCurrentRequestMessage(text);
            
            const result = await slowFunction(3000); // waits 3 seconds

            setChatMessages(prevChatMessages => ({
                messages: [...prevChatMessages.messages,
                { requestMessage: text, responseMessage: `AI: This is my response to your idea.` }]
            }));

        } catch (error) {
            console.error("Error adding request message:", error);
            return;
        }
        finally
        {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles["ai-chat-container"]}>
            <AISearchBar onSearchSubmit={handleOnSubmit} />
            <AIChatWindow currentRequestMessage={currentRequestMessage} chatMessages={chatMessages} isLoading={isLoading} />
        </div>
    );
}

export default AIChatContainer;
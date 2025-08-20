"use client";

import { FormEvent, useRef, useState } from "react";
import IconAISpark from "../icons/icon-ai-spark/IconAISpark";
import IconArrowDown from "../icons/icon-arrow-down/IconArrowDown";
import styles from "./ai-search-bar.module.css";

interface AISearchBarProps {
    onSearchSubmit?: (text: string) => void;
    isLoading?: boolean;
}


const AISearchBar = ({ onSearchSubmit,isLoading }: AISearchBarProps) => {
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [AISparkIconColor, setAISparkIconColor] = useState("ai-search-bar__icon--light-off");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputValue = event.target.value;
        setButtonDisabled(inputValue.trim() === "");
        setAISparkIconColor(inputValue.trim() === ""
            ? "ai-search-bar__icon--light-off"
            : "ai-search-bar__icon--light-on");


        // Auto-resize text area logic
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }

        //setTextValue(inputValue);
        // if (onSearchSubmit) {
        //     onSearchSubmit(event.target.value);
        // }
    };

    const clearInput = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (textareaRef && textareaRef.current) {
            //setTextValue(textareaRef.current.value);
            if (onSearchSubmit) {
                onSearchSubmit(textareaRef.current.value);
            }
        }

        if (textareaRef.current) {
            textareaRef.current.value = "";
            textareaRef.current.style.height = "auto"; // Reset height
        }

        setButtonDisabled(true);
        setAISparkIconColor("ai-search-bar__icon--light-off");
    }

    return (
        <div className={styles["ai-search-bar"]}>
            <form onSubmit={(e) => clearInput(e)} className={styles["ai-search-bar__form"]}>
                <div className={`${styles["ai-search-bar__icon"]} ${styles[AISparkIconColor]}`}><IconAISpark useCurrentColor={true} removeStroke={true} width={32} height={32} /></div>
                <textarea disabled={isLoading} ref={textareaRef} name="ai-search" onChange={handleInputChange} placeholder="Enter your resource idea..." className={styles["ai-search-bar__input"]} />
                <div className={styles["ai-search-bar__button-wrapper"]}>
                    <button disabled={buttonDisabled || isLoading} className={styles["ai-search-bar__button"]}><IconArrowDown useCurrentColor={true} width={32} height={32} /></button>
                </div>
            </form>
        </div>)
}

export default AISearchBar;
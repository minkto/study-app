"use client";

import { useRef, useState } from "react";
import IconAISpark from "../icons/icon-ai-spark/IconAISpark";
import IconArrowDown from "../icons/icon-arrow-down/IconArrowDown";
import styles from "./ai-search-bar.module.css";

const AISearchBar = () => {
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
    };

    return (
        <div className={styles["ai-search-bar"]}>
            <div className={`${styles["ai-search-bar__icon"]} ${styles[AISparkIconColor]}`}><IconAISpark useCurrentColor={true} removeStroke={true} width={32} height={32} /></div>
            <textarea ref={textareaRef} name="ai-search" onChange={handleInputChange} placeholder="Enter your resource idea..." className={styles["ai-search-bar__input"]} />
            <div className={styles["ai-search-bar__button-wrapper"]}>
                <button disabled={buttonDisabled} className={styles["ai-search-bar__button"]}><IconArrowDown useCurrentColor={true} width={32} height={32} /></button>
            </div>
        </div>)
}

export default AISearchBar;
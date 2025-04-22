import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useState } from 'react'
import IconSearch from '../icons/icon-search/IconSearch'
import styles from './listings-search-box.module.css'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface ListingsSearchBoxProps {
    onSearchSubmit?: () => void
}

export const ListingsSearchBox = ({ onSearchSubmit }: ListingsSearchBoxProps) => {

    const [currentText, setCurrentText] = useState("");
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCurrentText(event.target.value);
    }

    const handleOnSubmitSearch = () => {
        setupSearchTermQueryParam();

        if (onSearchSubmit !== undefined && onSearchSubmit !== null) {
            onSearchSubmit();
        }
    }

    const handleOnKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleOnSubmitSearch();
        }
    }

    const setupSearchTermQueryParam = () => {
        const currentSearchParams = new URLSearchParams(searchParams?.toString());
        const trimmedSearchTerm = currentText?.trim();

        if (trimmedSearchTerm && trimmedSearchTerm?.length !== 0) {     
            currentSearchParams.set("search-term",trimmedSearchTerm);
            router.push(`?search-term=${trimmedSearchTerm}`);
        }

        else {
            currentSearchParams.delete("search-term");
            router.replace(`${pathname}?${currentSearchParams}`);
        }
    }
    
    const setupSearchBoxValue = useCallback(() => {
        const currentSearchParams = new URLSearchParams(searchParams?.toString());
        const trimmedSearchTerm = currentSearchParams.get("search-term")?.trim();
        setCurrentText(trimmedSearchTerm ?? "");
    }, [searchParams]);


    useEffect(() => {
        setupSearchBoxValue();
    }, [setupSearchBoxValue])

    return (
        <div className={styles["search-box-listing"]}>
            <input onKeyDown={handleOnKeyPress} value={currentText} onChange={handleTextChange} className={styles["search-box-listing__text"]} type="text"></input>
            <button onClick={handleOnSubmitSearch} className={styles["search-box-listing__submit-btn"]}><IconSearch width={20} height={20} /></button>
        </div>
    )
}

export default ListingsSearchBox
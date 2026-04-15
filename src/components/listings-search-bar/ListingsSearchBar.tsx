import { useCallback } from "react";
import ListingsSearchBox from "../listings-search-box/ListingsSearchBox";
import styles from "./listings-search-bar.module.css";

interface ListingsSearchBarProps {
    handleBeforeOnSearchSubmit?: () => void;
    onSearchSubmit?: (searchValue?: string | undefined) => void;
    children?: React.ReactNode;
    useQueryParams?: boolean;
}

export const ListingsSearchBar = ({ onSearchSubmit, handleBeforeOnSearchSubmit, children, useQueryParams }: ListingsSearchBarProps) => {

    const search = useCallback((searchValue: string | undefined) => {
        if (onSearchSubmit) {
            return onSearchSubmit(searchValue);
        }
    }, [onSearchSubmit])


    return (<div className={`${styles['listings-search-bar']}`}>
        <ListingsSearchBox useQueryParams={useQueryParams} onSearchSubmit={search} handleBeforeOnSearchSubmit={handleBeforeOnSearchSubmit} />
        <div className={`${styles['listings-search-bar-items']}`}>
            {children}
        </div>
    </div>)
}

export default ListingsSearchBar;
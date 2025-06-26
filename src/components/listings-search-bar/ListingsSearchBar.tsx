import ListingsSearchBox from "../listings-search-box/ListingsSearchBox";
import styles from "./listings-search-bar.module.css";

interface ListingsSearchBarProps {
    handleBeforeOnSearchSubmit?: () => void;
    onSearchSubmit?: () => void;
    children?: React.ReactNode;
}

export const ListingsSearchBar = ({ onSearchSubmit, handleBeforeOnSearchSubmit, children }: ListingsSearchBarProps) => {
    return (<div className={`${styles['listings-search-bar']}`}>
        <ListingsSearchBox onSearchSubmit={onSearchSubmit} handleBeforeOnSearchSubmit={handleBeforeOnSearchSubmit} />
        <div className={`${styles['listings-search-bar-items']}`}>
            {children}
        </div>
    </div>)
}

export default ListingsSearchBar;
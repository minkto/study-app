import ListingsSearchBox from "../listings-search-box/ListingsSearchBox";
import ListingsSearchFilterOptions from "../listings-search-filter-options/ListingsSearchFilterOptions";

interface ListingsSearchBarProps {
    onSearchSubmit?: () => void;
    children?: React.ReactNode;
}

export const ListingsSearchBar = ({ onSearchSubmit, children }: ListingsSearchBarProps) => {
    return (<div className='dashboard__widget-row'>
        <ListingsSearchBox onSearchSubmit={onSearchSubmit} />
        <ListingsSearchFilterOptions />
        {children}
    </div>)
}

export default ListingsSearchBar;
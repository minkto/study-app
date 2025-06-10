import ListingsSearchBox from "../listings-search-box/ListingsSearchBox";

interface ListingsSearchBarProps {
    onSearchSubmit?: () => void;
    children?: React.ReactNode;
}

export const ListingsSearchBar = ({ onSearchSubmit, children }: ListingsSearchBarProps) => {
    return (<div className='dashboard__widget-row'>
        <ListingsSearchBox onSearchSubmit={onSearchSubmit} />
        {children}
    </div>)
}

export default ListingsSearchBar;
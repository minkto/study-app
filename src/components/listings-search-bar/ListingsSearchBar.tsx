import ListingsSearchBox from "../listings-search-box/ListingsSearchBox";

interface ListingsSearchBarProps {
    handleBeforeOnSearchSubmit?: () => void;
    onSearchSubmit?: () => void;
    children?: React.ReactNode;
}

export const ListingsSearchBar = ({ onSearchSubmit,handleBeforeOnSearchSubmit, children }: ListingsSearchBarProps) => {
    return (<div className='dashboard__widget-row'>
        <ListingsSearchBox onSearchSubmit={onSearchSubmit} handleBeforeOnSearchSubmit ={handleBeforeOnSearchSubmit} />
        {children}
    </div>)
}

export default ListingsSearchBar;
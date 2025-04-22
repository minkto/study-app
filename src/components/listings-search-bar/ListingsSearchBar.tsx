import Link from "next/link";
import ListingsSearchBox from "../listings-search-box/ListingsSearchBox";
import ListingsSearchFilterOptions from "../listings-search-filter-options/ListingsSearchFilterOptions";
import IconPlus from "../icons/icon-plus/IconPlus";

interface ListingsSearchBarProps 
{
    onSearchSubmit? : () => void    
}

export const ListingsSearchBar = ({onSearchSubmit} : ListingsSearchBarProps) => 
{
    return ( <div className='dashboard__widget-row'>
        <ListingsSearchBox  onSearchSubmit={onSearchSubmit}/>
        <ListingsSearchFilterOptions/>
        <Link className='dashboard-primary-btn' href={'chapters/add-chapter'}><IconPlus width={24} height={24} />Add</Link>
    </div>)
}

export default ListingsSearchBar;
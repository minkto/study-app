import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import IconChevronDown from '../icons/icon-chevron-down/IconChevronDown';
import IconFilter from '../icons/icon-filter/IconFilter';
import styles from './listings-search-filter-options.module.css'

interface FilterOption 
{
    id: number;
    label: string;
    checked: boolean;
}

export const ListingsSearchFilterOptions = () => {
    const [filtersMenuOpen, setFiltersMenuOpen] = useState(false);

    const [statusFilters,setStatusFilters] = useState([
        { id: 0, label: "Not Started", checked: false},
        { id: 1, label: "In Progress", checked: false },
        { id: 2, label: "Completed", checked: false },
    ]);

    const [daysSinceLastCompleted,setdaysSinceLastCompleted] = useState([
        { id: 0, label: "Less Than 10 Days", checked: false },
        { id: 1, label: "Less Than 20 Days", checked: false },
        { id: 3, label: "Less Than 30 Days", checked: false },
        { id: 4, label: "Equal to 30 Days", checked: false },
        { id: 5, label: "Greater Than 30 Days", checked: false },
    ]);

    const showFiltersMenu = () => {
        setFiltersMenuOpen(!filtersMenuOpen);
    }

    const setCheckboxOption = (id: number, setFiltersFunc: Dispatch<SetStateAction<FilterOption[]>>) => {
        console.log("Setting Checkbox");
        setFiltersFunc(prev => 
            prev.map((filter : FilterOption) => filter.id === id ? 
            {...filter,checked : !filter.checked } : filter)
        )
    }

    return (<div className={styles["search-filter-options"]}>
        {filtersMenuOpen &&
            <div className={styles["filter-by-menu"]}>
                <div className={styles["filter-by-menu-pointer"]}></div>

                <div className={styles["filter-by-menu-group"]}>
                    <div className={styles["filter-by-menu-group-heading"]}>
                        <IconChevronDown className={"icon-wrapper"} width={20} height={20} />
                        <h3 className={styles['filter-by-menu-group-heading__title']}>Status</h3>
                    </div>

                    <ul>
                    {statusFilters?.map(x => (
                        <li key={x.id} onClick={() => setCheckboxOption(x.id,setStatusFilters)} className={styles["filter-by-group__option"]}>
                            <input type='checkbox' checked={x.checked}  onChange={(e) => {e.stopPropagation()}}/>
                            <label>{x.label}</label>
                        </li>)
                    )}
                    </ul>
                </div>

                <div className={styles["filter-by-menu-group"]}>
                    <div className={styles["filter-by-menu-group-heading"]}>
                        <IconChevronDown className={"icon-wrapper"} width={20} height={20} />
                        <h3 className={styles['filter-by-menu-group-heading__title']}>Days Since Last Completed</h3>
                    </div>
                    <ul>
                    {daysSinceLastCompleted?.map(x => (
                        <li key={x.id} onClick={() => setCheckboxOption(x.id,setdaysSinceLastCompleted)} className={styles["filter-by-group__option"]}>
                            <input type='checkbox' checked={x.checked}  onChange={(e) => {e.stopPropagation()}}/>
                            <label>{x.label}</label>
                        </li>)
                    )}
                    </ul>
                </div>
            </div>
        }

        <button onClick={showFiltersMenu} className={styles["search-filter-options__btn"]}><IconFilter className={"icon-wrapper"} width={20} height={20} />Filter By</button>
        <button className={styles["search-filter-options__btn"]}><IconChevronDown className={"icon-wrapper"} width={20} height={20} />Sort By</button>
    </div>)
}

export default ListingsSearchFilterOptions;
import { useCallback, useEffect, useRef, useState } from 'react';
import IconChevronDown from '../icons/icon-chevron-down/IconChevronDown';
import IconFilter from '../icons/icon-filter/IconFilter';
import styles from './listings-search-filter-options.module.css'

interface FilterOption {
    id: number;
    label: string;
    checked: boolean;
}

interface FilterGroup {
    groupId: number;
    title?: string;
    options: FilterOption[];
    toggled?: boolean;
}

interface FilterGroupList {
    groups: FilterGroup[];
}

export const ListingsSearchFilterOptions = () => {

    const [filtersMenuOpen, setFiltersMenuOpen] = useState(false);
    const filterMenuRef = useRef<HTMLDivElement>(null);
    const [filtersToUse, setFiltersToUse] = useState<FilterGroupList>(
        {
            groups:
                [
                    {
                        groupId: 0,
                        title: "Status",
                        options: [
                            { id: 0, label: "Not Started", checked: false },
                            { id: 1, label: "In Progress", checked: false },
                            { id: 2, label: "Completed", checked: false },
                        ],
                        toggled: true
                    },

                    {
                        groupId: 1,
                        title: "Days Since Last Completed",
                        options: [
                            { id: 0, label: "Less Than 10 Days", checked: false },
                            { id: 1, label: "Less Than 20 Days", checked: false },
                            { id: 2, label: "Less Than 30 Days", checked: false },
                            { id: 3, label: "Equal to 30 Days", checked: false },
                            { id: 4, label: "Greater Than 30 Days", checked: false },
                        ],
                        toggled: true
                    },

                ]

        }
    )

    const toggleFiltersMenu = useCallback(() => {
        setFiltersMenuOpen(!filtersMenuOpen);
    }, [filtersMenuOpen]);

    const setCheckboxOption = (id: number, groupId: number) => {
        const newFiltersToUse: FilterGroupList = { ...filtersToUse };
        const groupToChange = newFiltersToUse.groups[groupId];
        const optionToChange = groupToChange.options.filter(x => x.id === id)[0];

        optionToChange.checked = !optionToChange.checked;

        setFiltersToUse(newFiltersToUse);
    }

    const toggleFilterMenuGroup = (groupId: number) => {
        const newFiltersToUse: FilterGroupList = { ...filtersToUse };
        const groupToChange = newFiltersToUse.groups[groupId];

        groupToChange.toggled = !groupToChange.toggled

        setFiltersToUse(newFiltersToUse);
    }

    useEffect(() => {
        const onClickOutsideMenu = (e: MouseEvent | KeyboardEvent) => {
            if (filterMenuRef.current && !filterMenuRef.current.contains(e.target as Node)) {
                toggleFiltersMenu();
            }
        }

        if (filtersMenuOpen) {
            document.addEventListener('mousedown', onClickOutsideMenu);
            document.addEventListener('keydown', onClickOutsideMenu);
        }

        return () => {
            document.removeEventListener('mousedown', onClickOutsideMenu);
            document.removeEventListener('keydown', onClickOutsideMenu);
        }

    }, [toggleFiltersMenu, filtersMenuOpen]);

    return (<div className={styles["search-filter-options"]}>
        {filtersMenuOpen &&
            <div className={styles["filter-by-menu"]} ref={filterMenuRef} >
                <div className={styles["filter-by-menu-pointer"]}></div>
                {filtersToUse.groups.map(x => (
                    <div key={x.groupId} className={`${styles["filter-by-menu-group"]} ${!x.toggled ? styles["filter-by-menu-group--hidden"] : ""}`}                    >
                        <div className={styles["filter-by-menu-group-heading"]} onClick={() => toggleFilterMenuGroup(x.groupId)}>
                            <IconChevronDown className={styles["icon-wrapper"]} width={20} height={20} />
                            <h3 className={styles['filter-by-menu-group-heading__title']}>{x.title}</h3>
                        </div>

                        <ul>
                            {x.options?.map(y => (
                                <li key={y.id} onClick={() => setCheckboxOption(y.id, x.groupId)} className={styles["filter-by-group__option"]}>
                                    <input type='checkbox' checked={y.checked} onChange={(e) => { e.stopPropagation() }} />
                                    <label>{y.label}</label>
                                </li>)
                            )}
                        </ul>
                    </div>
                ))}
            </div>
        }

        <button onClick={toggleFiltersMenu} className={styles["search-filter-options__btn"]}><IconFilter className={"icon-wrapper"} width={20} height={20} />Filter By</button>
    </div>)
}

export default ListingsSearchFilterOptions;
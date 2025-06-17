import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import IconChevronDown from '../icons/icon-chevron-down/IconChevronDown';
import IconFilter from '../icons/icon-filter/IconFilter';
import styles from './listings-search-filter-options.module.css'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface FilterOption {
    id: number;
    label: string;
    checked: boolean;
}

interface FilterGroup {
    groupId: number;
    queryKey: string;
    title?: string;
    options: FilterOption[];
    toggled?: boolean;
}

interface FilterGroupList {
    groups: FilterGroup[];
}

interface ListingsSearchFilterOptionsProps {
    filterGroups: FilterGroupList;
    filterQueryKeys?: string[];
    onFilterChange?: () => void;
    handleBeforeOnFilterChange?: () => void; 
}


export const ListingsSearchFilterOptions = ({ filterGroups, filterQueryKeys, onFilterChange ,handleBeforeOnFilterChange}: ListingsSearchFilterOptionsProps) => {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [filtersToUse, setFiltersToUse] = useState<FilterGroupList>(filterGroups);
    const [filtersMenuOpen, setFiltersMenuOpen] = useState(false);
    const filterMenuRef = useRef<HTMLDivElement>(null);
    const [isPending, startTransition] = useTransition();
    
    const setQueryParamsFromFilterOption = (toggleState: boolean, queryLabel: string, querykey: string) => {
        const params = new URLSearchParams(searchParams?.toString());
        if (toggleState) {
            params.append(querykey, queryLabel);
        }
        else {
            params.delete(querykey, queryLabel);
        }

        router.replace(`${pathname}?${params?.toString()}`);
    }

    const setInitialFiltersFromQueryParams = () => {
        if (filterQueryKeys !== undefined) {
            filterQueryKeys.forEach(filterQueryKey => {
                setOnMountFilters(filterQueryKey);
            });
        }
    }

    /**
     * Sets the current filters based on the Query parameters from the URL.
     * @param queryKey The key of the filter to set
     */
    const setOnMountFilters = (queryKey: string) => {
        const params = new URLSearchParams(searchParams?.toString());
        const statusFilter = params.getAll(queryKey);
        const currentFilters = filtersToUse.groups.find(x => x.queryKey === queryKey);

        if (currentFilters) {
            // Creates a copy of the options, and changes the checkbox if query key
            // exists.
            const optionsToUpdate = currentFilters?.options?.map(option => {
                return {
                    ...option,
                    checked: statusFilter.includes(option.label)
                }
            });

            setFiltersToUse(prev => ({
                ...prev,
                groups: prev.groups.map(group =>
                    group.queryKey === queryKey
                        ? { ...group, options: optionsToUpdate }
                        : group
                )
            }))
        }
    }

    const setCheckboxOption = (id: number, groupId: number) => {
        const newFiltersToUse: FilterGroupList = { ...filtersToUse };
        const groupToChange = newFiltersToUse.groups[groupId];
        const optionToChange = groupToChange.options.find(x => x.id === id);

        if (handleBeforeOnFilterChange) {
            handleBeforeOnFilterChange();
        }

        if (optionToChange) {
            optionToChange.checked = !optionToChange.checked;
            setQueryParamsFromFilterOption(optionToChange?.checked, optionToChange.label, groupToChange.queryKey);

            setFiltersToUse(newFiltersToUse);

            if (onFilterChange) {
                startTransition(() => {
                    onFilterChange();
                });
            }
        }
    }

    const toggleFiltersMenuOption = useCallback(() => {
        setFiltersMenuOpen(!filtersMenuOpen);
    }, [filtersMenuOpen]);

    const toggleFilterMenuGroup = (groupId: number) => {
        const newFiltersToUse: FilterGroupList = { ...filtersToUse };
        const groupToChange = newFiltersToUse.groups[groupId];

        if (groupToChange) {
            groupToChange.toggled = !groupToChange.toggled;
            setFiltersToUse(newFiltersToUse);
        }
    }

    useEffect(() => {
        setInitialFiltersFromQueryParams();
    }, []);

    useEffect(() => {
        const onClickOutsideMenu = (e: MouseEvent | KeyboardEvent) => {
            if (filterMenuRef.current && !filterMenuRef.current.contains(e.target as Node)) {
                toggleFiltersMenuOption();
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

    }, [toggleFiltersMenuOption, filtersMenuOpen]);

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

        <button onClick={toggleFiltersMenuOption} className={styles["search-filter-options__btn"]}><IconFilter className={"icon-wrapper"} width={20} height={20} />Filter By</button>
    </div>)
}

export default ListingsSearchFilterOptions;
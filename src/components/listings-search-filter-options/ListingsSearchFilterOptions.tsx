import { ChangeEvent, useCallback, useEffect, useRef, useState, useTransition } from 'react';
import IconChevronDown from '../icons/icon-chevron-down/IconChevronDown';
import IconFilter from '../icons/icon-filter/IconFilter';
import styles from './listings-search-filter-options.module.css'
import { useSearchParams } from 'next/navigation';
import { FilterGroupList } from '@/shared.types';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

interface ListingsSearchFilterOptionsProps {
    filterGroups: FilterGroupList;
    filterQueryKeys?: string[];
    onFilterChange?: (e: string | undefined) => void;
    handleBeforeOnFilterChange?: () => void;
    useQueryParams?: boolean;
}

const CHECKED_CLASS_NAME = "filter-by-group__option--checked";

export const ListingsSearchFilterOptions = ({ filterGroups,
    filterQueryKeys,
    onFilterChange,
    handleBeforeOnFilterChange,
    useQueryParams = true }: ListingsSearchFilterOptionsProps) => {

    const searchParams = useSearchParams();
    const [filtersToUse, setFiltersToUse] = useState<FilterGroupList>(filterGroups);
    const [filtersMenuOpen, setFiltersMenuOpen] = useState(false);
    const filterMenuRef = useRef<HTMLDivElement>(null);
    const [isPending, startTransition] = useTransition();
    const [localQueryString, setLocalQueryString] = useState("");
    const firstOption = useRef<HTMLButtonElement>(null);

    const handleFiltersOnChange = useCallback((filtersQueryStringVal: string | undefined) => {
        if (onFilterChange) {
            onFilterChange(filtersQueryStringVal)
        }
    }, [onFilterChange])

    const getQueryParamsFromFilterOption = (toggleState: boolean, queryLabel: string, querykey: string) => {

        if (!useQueryParams) {

            const params = new URLSearchParams(localQueryString);
            if (toggleState) {
                params.append(querykey, queryLabel);
            }
            else {
                params.delete(querykey, queryLabel);
            }

            setLocalQueryString(params?.toString() ?? "");
            return params?.toString();
        } else {
            const params = new URLSearchParams();

            // Copy only filter-related keys from current searchParams
            filterQueryKeys?.forEach(key => {
                searchParams?.getAll(key).forEach(v => params.append(key, v));
            });

            if (toggleState) {
                params.append(querykey, queryLabel);
            }
            else {
                params.delete(querykey, queryLabel);
            }
            return params?.toString();
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

            setFiltersToUse(newFiltersToUse);

            if (onFilterChange) {
                startTransition(() => {
                    handleFiltersOnChange(getQueryParamsFromFilterOption(optionToChange?.checked, optionToChange.label, groupToChange.queryKey));
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

    const setCheckboxOptionClassName = (checkboxElement: HTMLInputElement) => {
        const optionListElement = checkboxElement.parentNode as HTMLLIElement;
        optionListElement?.classList.toggle(CHECKED_CLASS_NAME);
    }

    const handleOptionActive = (e: ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLLIElement>, id: number, groupId: number) => {
        e.stopPropagation();
        if (e instanceof HTMLInputElement) {
            setCheckboxOptionClassName(e as HTMLInputElement);
        } else {
            e.currentTarget.classList.toggle(CHECKED_CLASS_NAME);
        }
        setCheckboxOption(id, groupId);
    }

    useEffect(() => {
        if (!useQueryParams) {
            return;
        }

        const params = new URLSearchParams(searchParams?.toString());

        setFiltersToUse(prev => ({
            ...filterGroups,
            groups: filterGroups.groups.map(group => {
                const prevGroup = prev.groups.find(existing => existing.queryKey === group.queryKey);
                const selectedValues = params.getAll(group.queryKey);

                return {
                    ...group,
                    toggled: prevGroup?.toggled ?? group.toggled,
                    options: group.options.map(option => ({
                        ...option,
                        checked: selectedValues.includes(option.label),
                    })),
                };
            }),
        }));
    }, [filterGroups, searchParams, useQueryParams]);

    useEffect(() => {
        const onClickOutsideMenu = (e: MouseEvent | KeyboardEvent) => {
            if (filterMenuRef.current && !filterMenuRef.current.contains(e.target as Node)) {
                toggleFiltersMenuOption();
            }

            else if (filtersMenuOpen && e instanceof KeyboardEvent && e.key === 'Escape') {
                toggleFiltersMenuOption();
            }

            // Exit the menu when tabbing backwards from the first option in the menu.
            else if (filtersMenuOpen &&
                firstOption.current &&
                document.activeElement === firstOption.current &&
                e instanceof KeyboardEvent && e.key === 'Tab' && e.shiftKey) {
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

    useEffect(() => {
        if (filtersMenuOpen && firstOption.current) {
            firstOption.current.focus();
        }
    }, [filtersMenuOpen])

    return (
        <div className={styles["search-filter-options"]}>
            {filtersMenuOpen &&

                <div className={styles["filter-by-menu"]} ref={filterMenuRef} >
                    <OverlayScrollbarsComponent
                        options={{ scrollbars: { theme: 'os-theme-dark', clickScroll: true } }}
                        className={styles["filter-by-menu__scrollable"]}
                    >
                        {filtersToUse.groups.map(x => (
                            <div key={x.groupId} className={`${styles["filter-by-menu-group"]} ${!x.toggled ? styles["filter-by-menu-group--hidden"] : ""}`}                    >
                                <div className={styles["filter-by-menu-group-heading"]}>
                                    <button ref={x.groupId === 0 ? firstOption : null} onClick={() => toggleFilterMenuGroup(x.groupId)} className={`btn-reset ${styles["filter-by-menu-group-heading__toggle"]}`} aria-label={`Toggle ${x.title} filter options`} aria-expanded={x.toggled}>
                                        <IconChevronDown className={styles["icon-wrapper"]} width={20} height={20} />
                                        <h3 className={styles['filter-by-menu-group-heading__title']}>{x.title}</h3>
                                    </button>
                                </div>

                                {x.toggled && (
                                    <ul>
                                        {x.options?.map((y) => (
                                            <li
                                                className={`${styles["filter-by-group__option"]} ${y.checked ? styles["filter-by-group__option--checked"] : ""}`}
                                                key={y.id}
                                            >
                                                <label>
                                                    <input
                                                        className="checkbox"
                                                        type="checkbox"
                                                        checked={y.checked}
                                                        onChange={(e) => handleOptionActive(e, y.id, x.groupId)}
                                                    />
                                                    {y.label}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </OverlayScrollbarsComponent>
                </div>
            }
            <button disabled={isPending} onClick={toggleFiltersMenuOption} className={"dashboard-primary-btn"}><IconFilter className={"icon-wrapper"} width={20} height={20} />Filter By</button>
        </div>)
}

export default ListingsSearchFilterOptions;
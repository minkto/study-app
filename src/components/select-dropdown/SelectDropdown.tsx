import { ChangeEvent, useEffect, useState } from 'react';
import styles from './select-dropdown.module.css'

interface SelectDropdownProps {
    getDefaultValue?: () => string;
    onChangeCallback?: (e: ChangeEvent<HTMLSelectElement>) => void;
    dropdownOptions: SelectDropdownOption[];
}

interface SelectDropdownOption {
    label?: string;
    value?: string;
}

export const SelectDropdown = ({ dropdownOptions, getDefaultValue, onChangeCallback }: SelectDropdownProps) => {
    const [selectedOption, setSelectedOption] = useState("");

    useEffect(() => {
        if (getDefaultValue !== undefined) {
            setSelectedOption(getDefaultValue());
        }
    }, [])

    return (
        <select className={styles['listing-dropdown']} value={selectedOption} name="sort-by" onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            if (onChangeCallback !== undefined) {
                onChangeCallback(e);
            }
            setSelectedOption(e.target.value);
        }
        } >
            {dropdownOptions.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
        </select>)
}

export default SelectDropdown;
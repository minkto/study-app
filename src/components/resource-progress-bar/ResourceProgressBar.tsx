"use client"

import { useEffect, useState } from 'react';
import styles from './resource-progress-bar.module.css';

interface ResourceProgressBarProps {
    percentageCompleted: number | undefined;
}


export const ResourceProgressBar = ({ percentageCompleted }: ResourceProgressBarProps) => {
    const [progressBarWidth, setProgressBarWidth] = useState("0%");

    useEffect(() => {
        setProgressBarWidth(`calc(${percentageCompleted}%)`);
    }, [percentageCompleted]);

    return <div className={styles["resources-progress-bar"]}>
        <div className={styles["resources-progress-bar__name"]}>Progress</div>
        <div className={styles["resources-progress-bar__background"]}>
            <div style={{ width: progressBarWidth }} className={styles["resources-progress-bar__overlay"]}></div>
            <div className={styles["resources-progress-bar__value"]}>{percentageCompleted}%</div>
        </div>

    </div>
}

export default ResourceProgressBar;
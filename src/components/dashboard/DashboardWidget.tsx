import { ReactNode } from 'react';
import styles from './dashboard-widget.module.css'

interface DashboardWidgetProps {
    title?: string;
    children?: ReactNode
}

export const DashboardWidget = ({ title, children }: DashboardWidgetProps) => {
    return (<div className={styles["dashboard__widget"]}>
        <h1 className={styles["dashboard__widget-title"]}>{title}</h1>
        <div className='dashboard__widget-inner-content'>
            {children}
        </div>
    </div>)
}
import styles from './dashboard-widget.module.css'

interface DashboardWidgetProps {
    title: string;
}

export const DashboardWidget = ({ title }: DashboardWidgetProps) => {
    return (<div className={styles["dashboard__widget"]}>
        <h1 className={styles["dashboard__widget-title"]}>{title}</h1>
        <div className='dashboard__widget-inner-content'>
            <p>This will contain the component to render inside.</p>
        </div>
    </div>)
}
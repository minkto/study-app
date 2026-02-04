'use client';

import React from 'react';
import styles from './tabs.module.css';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export const Tabs = ({ tabs }: TabsProps) => {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div className={styles['tabs-container']}>
      <div className={styles['tab-headers']}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={styles['tab-header'] + (activeTab === index ? ` ${styles.active}` : '')}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles['tab-content']}>
        {tabs && tabs[activeTab]?.content}
      </div>
    </div>
  );
}

export default Tabs;
"use client"

import Link from "next/link";
import IconSidebar from "../icons/icon-sidebar/IconSidebar";
import IconGrid from "../icons/icon-grid/IconGrid";
import IconBook from "../icons/icon-book/IconBook";
import IconSettings from "../icons/icon-settings/IconSettings";
import IconLogout from "../icons/icon-logout/IconLogout";
import { useEffect, useRef, useState } from "react";
import styles from './sidebar-navigation.module.css';

export const SidebarNavigation = () => {
    const [sidebarToggle, setSidebarToggle] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);
    const hoverMenuRef = useRef<HTMLDivElement>(null);

    const toggleSidebar = () => {
        setSidebarToggle(!sidebarToggle);
    }

    const closeSidebar = () => {
        if (!sidebarToggle) {
            setSidebarToggle(true);
        }
    }

    useEffect(() => {
        const handleOutsideFocus = (e: KeyboardEvent | MouseEvent) => {
            if (overlayRef.current === e.target) {
                toggleSidebar();
            }
        }

        if (overlayRef.current) {
            overlayRef.current?.addEventListener('keydown', handleOutsideFocus);
            overlayRef.current?.addEventListener('mousedown', handleOutsideFocus);
        }


        return () => {
            overlayRef.current?.removeEventListener('keydown', handleOutsideFocus);
            overlayRef.current?.removeEventListener('mousedown', handleOutsideFocus);
        }
    }, [])

    return (<aside className={styles[`sidebar${sidebarToggle ? "" : "--expanded"}`]}>
        <div className={styles["sidebar__container"]}>
            <div className={styles["sidebar__container-top"]}>

                <div className={styles["sidebar__container-icon"]}>
                </div>

                <div className={styles[`sidebar__container-name${sidebarToggle ? "" : "--expanded"}`]}>
                    <h2>Study App</h2>
                </div>

                <div className={styles[`sidebar__container-menu-toggle`]}>
                    <button onClick={toggleSidebar}>
                        <IconSidebar width={32} height={32} />
                    </button>
                </div>
            </div>
            <div ref={overlayRef} className={styles["sidebar__container-overlay"]}></div>
            <div ref={hoverMenuRef} className={styles["sidebar__container-middle"]}>
                <div className={styles["sidebar__container-menu"]}>
                    <ul className={styles["sidebar__container-menu-list"]}>
                        <li className={styles["sidebar__container-menu-list-item"]}>
                            <Link onClick={closeSidebar} href={"/dashboard/"}><IconGrid width={32} height={32} />Dashboard</Link>
                        </li>
                        <li className={styles["sidebar__container-menu-list-item"]}>
                            <Link onClick={closeSidebar} href={"/dashboard/resources/"}><IconBook width={32} height={32} />Resources</Link>
                        </li>
                        <li className={styles["sidebar__container-menu-list-item"]}>
                            <Link onClick={closeSidebar} href={"#"}><IconSettings width={32} height={32} />Settings</Link>
                        </li>
                        <li className={styles["sidebar__container-menu-list-item"]}>
                            <Link onClick={closeSidebar} href={"#"}><IconLogout width={32} height={32} />Logout</Link>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    </aside>)
}

export default SidebarNavigation;
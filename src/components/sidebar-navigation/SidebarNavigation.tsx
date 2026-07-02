"use client"

import Link from "next/link";
import IconSidebar from "../icons/icon-sidebar/IconSidebar";
import IconGrid from "../icons/icon-grid/IconGrid";
import IconBook from "../icons/icon-book/IconBook";
import IconSettings from "../icons/icon-settings/IconSettings";
import IconLogout from "../icons/icon-logout/IconLogout";
import { useEffect, useRef, useState } from "react";
import styles from './sidebar-navigation.module.css';
import { SignOutButton } from "@clerk/nextjs";
import IconAISpark from "../icons/icon-ai-spark/IconAISpark";
import IconUserProfile from "../icons/icon-user-profile/IconUserProfile";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import 'overlayscrollbars/styles/overlayscrollbars.css';
import { usePathname } from "next/navigation";
import Image from 'next/image'
import logo from '../../../public/learnlobe-logo.svg'




export const SidebarNavigation = () => {
    const pathName = usePathname();
    const [sidebarToggle, setSidebarToggle] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);

    const toggleSidebar = () => {
        setSidebarToggle(!sidebarToggle);
    }

    const closeSidebar = () => {
        if (sidebarToggle) {
            setSidebarToggle(false);
        }
    }


    /**
     * Get the class for the list item based on the current path and sidebar toggle state.
     * @param path 
     * @returns Class name for the list item.
     */
    const getLiClass = (path: string) => {
        const base = styles[`sidebar__container-menu-list-item${sidebarToggle ? "--expanded" : ""}`];
        const active = pathName === path ? styles["sidebar__container-menu-list-item--active"] : "";
        return `${base}${active ? ` ${active}` : ""}`;
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
    })

    return (<aside className={styles[`sidebar${sidebarToggle ? "--expanded" : ""}`]}>
        <div className={styles["sidebar__container"]}>
            <div className={styles["sidebar__container-top"]}>
                <div className={styles["sidebar__container-icon"]}>
                    <Image src={logo} alt="logo"></Image>
                </div>

                <div className={styles[`sidebar__container-name${sidebarToggle ? "--expanded" : ""}`]}>
                    <h2>Study App</h2>
                </div>

                <div className={styles[`sidebar__container-menu-toggle`]}>
                    <button onClick={toggleSidebar}>
                        <IconSidebar width={32} height={32} />
                    </button>
                </div>
            </div>
            <div ref={overlayRef} className={styles["sidebar__container-overlay"]}></div>
            <OverlayScrollbarsComponent 
                element="div"
                options={{ scrollbars: { autoHide: "scroll", theme: "os-theme-dark" } }}
                className={styles[`sidebar__container-middle${sidebarToggle ? "--expanded" : ""}`]}
            >
                <div className={styles[`sidebar__container-menu${sidebarToggle ? "--expanded" : ""}`]}>
                    <ul className={styles["sidebar__container-menu-list"]}>
                        <li className={getLiClass("/dashboard")}>
                            <Link onClick={closeSidebar} href={"/dashboard/"}><IconGrid width={32} height={32} />
                            <span>Dashboard</span>
                            </Link>
                        </li>
                        <li className={getLiClass("/dashboard/resources")}>
                            <Link onClick={closeSidebar} href={"/dashboard/resources/"}><IconBook width={32} height={32} />
                            <span>Resources</span>
                            </Link>
                        </li>
                        <li className={getLiClass("/dashboard/ai/helper")}>
                            <Link onClick={closeSidebar} href={"/dashboard/ai/helper/"}><IconAISpark width={32} height={32} /><span>AI Helper</span></Link>
                        </li>
                        <li className={getLiClass("/dashboard/settings")}>
                            <Link onClick={closeSidebar} href={"/dashboard/settings/"}><IconSettings width={32} height={32} /><span>Settings</span></Link>
                        </li>
                        <li className={getLiClass("/dashboard/settings/user-profile")}>
                            <Link title="User Profile" onClick={closeSidebar} href={"/dashboard/settings/user-profile"}><IconUserProfile width={32} height={32} /><span>User Profile</span></Link>
                        </li>
                        <li className={styles[`sidebar__container-menu-list-item${sidebarToggle ? "--expanded" : ""}`]}>
                            <SignOutButton >
                                <button title="Logout" aria-label="Logout">
                                <IconLogout  width={32} height={32}/><span>Logout</span>       
                                </button>                         
                            </SignOutButton>
                        </li>
                    </ul>
                </div>
            </OverlayScrollbarsComponent>
            <div className={styles["sidebar__container-bottom"]}></div>
        </div>
    </aside>)
}

export default SidebarNavigation;
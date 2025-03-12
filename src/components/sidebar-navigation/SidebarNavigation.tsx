"use client"

import Link from "next/link";
import IconSidebar from "../icons/icon-sidebar/IconSidebar";
import IconGrid from "../icons/icon-grid/IconGrid";
import IconBook from "../icons/icon-book/IconBook";
import IconSettings from "../icons/icon-settings/IconSettings";
import IconLogout from "../icons/icon-logout/IconLogout";
import { useState } from "react";

export const SidebarNavigation = () => 
{

    const [sidebarToggle,setSidebarToggle] = useState(false);

    const toggleSidebar = () => {
        console.log('Toggle Class',sidebarToggle)
        setSidebarToggle(!sidebarToggle)
    }

    return(<aside className={`sidebar${sidebarToggle ? "" : "--expanded"}`}>
        <div className="sidebar__container">
            <div className="sidebar__container-top">

                <div className="sidebar__container-icon">
                </div>

                <div className={`sidebar__container-name${sidebarToggle ? "" : "--expanded"}`}>
                    <h2>Study App</h2>
                </div>

                <div className={`sidebar__container-menu-toggle`}>
                    <button onClick={toggleSidebar}>
                        <IconSidebar width={32} height={32} />
                    </button>
                </div>
            </div>

            <div className="sidebar__container-middle">
                <div className="sidebar__container-menu">
                    <ul className="sidebar__container-menu-list">
                        <li className="sidebar__container-menu-list-item">
                            <Link href={"/dashboard/"}><IconGrid width={32} height={32} />Dashboard</Link>
                        </li>
                        <li className="sidebar__container-menu-list-item">
                            <Link href={"/dashboard/resources/"}><IconBook width={32} height={32} />Resources</Link>
                        </li>
                        <li className="sidebar__container-menu-list-item">
                            <Link href={"#"}><IconSettings width={32} height={32} />Settings</Link>
                        </li>
                        <li className="sidebar__container-menu-list-item"> 
                            <Link href={"#"}><IconLogout width={32} height={32} />Logout</Link>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    </aside>)
}

export default SidebarNavigation;
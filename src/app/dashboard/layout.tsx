import { Metadata } from "next";
import "./layout.css";
import SidebarNavigation from "@/components/sidebar-navigation/SidebarNavigation";


export const metadata: Metadata = {
    title: 'App | LearnLobe',
    description: 'The application for managing your resources for learning.',
    robots: { index: false, follow: false }
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="dashboard">
            <SidebarNavigation />
            <div className="dashboard__main-content">
                <div className="dashboard__widgets-container">
                    {children}
                </div>
            </div>
        </div>
    );
}
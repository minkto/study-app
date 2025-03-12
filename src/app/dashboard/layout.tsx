import "./layout.css";
import SidebarNavigation from "@/components/sidebar-navigation/SidebarNavigation";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="dashboard">
            <SidebarNavigation/>
            
            <div className="dashboard__main-content">
                <p>Dashboard Layout - This is the main content for dashboard.</p>
                <div className="dashboard__widgets-container">
                    {children}
                </div>
            </div>
        </div>
    );
}
import "./layout.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <div className="dashboard">
            <aside className="dashboard__sidebar">
                <div>Dashboard Layout - Side Nav</div>
            </aside>
            <div className="dashboard__main-content">
                <p>Dashboard Layout - This is the main content for dashboard.</p>
                {children}
            </div> 
        </div>
    );
}
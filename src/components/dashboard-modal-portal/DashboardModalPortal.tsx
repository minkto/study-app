import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

const DashboardModalPortal = ({ children, selector = "#dashboard-modal-portal", show = false }: { children: React.ReactNode, selector?: string, show?: boolean }) => {

    const dashboardModalElement = document.querySelector(selector);
       // Only create the portal when component mounts
       useEffect(() => {
        return () => {
            // Cleanup if needed
        };
    }, []);

    if (show) {
        return createPortal(children, dashboardModalElement ?? document.body);
    }

    return null;
}

export default DashboardModalPortal;
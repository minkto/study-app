import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

const DashboardModalPortal = ({ children, selector = "#dashboard-modal-portal", show = false }: { children: React.ReactNode, selector?: string, show?: boolean }) => {

    const [portalNode, setPortalNode] = useState<Element | null>(null);

    // Only create the portal when component mounts
    useEffect(() => {

        const dashboardModalElement = document.querySelector(selector);
        setPortalNode(dashboardModalElement ?? document.body);

        return () => {
            // Cleanup if needed
        };
    }, [selector]);

    if (show && portalNode) {
        return createPortal(children, portalNode);
    }

    return null;
}

export default DashboardModalPortal;
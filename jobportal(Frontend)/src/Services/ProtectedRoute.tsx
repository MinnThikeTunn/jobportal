import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { errorNotification } from "./NotificationService";
import { useEffect, useRef } from "react";

interface ProtectedRouteProps {
    children: JSX.Element;
    allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const token = useSelector((state: any) => state.jwt);
    const hasNotified = useRef(false); // Track if notification has been shown

    useEffect(() => {
        if (token && allowedRoles) {
            const decoded: any = jwtDecode(token);
            if (allowedRoles && !allowedRoles.includes(decoded.accountType)) {
                if (!hasNotified.current) { // Ensure notification shows only once
                    errorNotification('Unauthorized', 'You are not authorized to view this page');
                    hasNotified.current = true; // Mark notification as shown
                }
            }
        }
    }, [token, allowedRoles]); // Run effect when token or allowedRoles change

    if (!token) {
        return <Navigate to="/login" />;
    }

    const decoded: any = jwtDecode(token);
    if (allowedRoles && !allowedRoles.includes(decoded.accountType)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;

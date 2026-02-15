import React from "react";
import { useNavigate } from "react-router-dom";
import { sessionStore } from "../../../core/session/sessionStorage";

type UserRole = "admin" | "attendant" | "auditor" | string;

export const withRole = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: UserRole[],
) => {
  const WrappedComponent = (props: P) => {
    const navigate = useNavigate();
    const user = sessionStore.getUser();

    React.useEffect(() => {
      if (!user) navigate("/session-expired");
      else if (requiredRole && !requiredRole.includes(user.role))
        navigate("/not-authorized");
    }, [user, navigate]);

    if (!user || (requiredRole && !requiredRole.includes(user.role)))
      return null;
    return <Component {...props} />;
  };

  const componentName = Component.displayName || Component.name || "Component";
  WrappedComponent.displayName = `withRole(${componentName})`;

  return WrappedComponent;
};

import React from "react";
import { useNavigate } from "react-router-dom";
import { sessionStore } from "../../../core/session/sessionStorage";

export const withRole = (Component: React.FC<any>, requiredRole?: any[]) => {
  return (props: any) => {
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
};

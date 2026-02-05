import React from "react";
import { useNavigate } from "react-router-dom";
import { sessionStore } from "../../../core/session/sessionStorage";

interface Props {
  children: JSX.Element;
  requiredRole?: string;
}

export const ProtectedResource: React.FC<Props> = ({
  children,
  requiredRole,
}) => {
  const navigate = useNavigate();
  const user = sessionStore.getUser();

  React.useEffect(() => {
    if (!user) {
      navigate("/session-expired"); // redirect SPA
    } else if (requiredRole && user.role !== requiredRole) {
      navigate("/not-authorized");
    }
  }, [user, requiredRole, navigate]);

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null; // não renderiza nada enquanto redireciona
  }

  return children;
};

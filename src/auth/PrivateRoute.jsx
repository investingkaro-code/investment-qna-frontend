import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function PrivateRoute() {
  const { user, ready } = useContext(AuthContext);
  if (!ready) return null; // or a loader
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}


import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
  }, []);
  
  // While checking auth status
  if (isAuthenticated === null) {
    return null;
  }
  
  // Redirect based on auth status
  return isAuthenticated ? 
    <Navigate to="/dashboard" replace /> :
    <Navigate to="/login" replace />;
};

export default Index;

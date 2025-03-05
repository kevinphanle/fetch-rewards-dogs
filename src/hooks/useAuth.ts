import { useState } from "react";

interface LoginCredentials {
  name: string;
  email: string;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleLogin = async ({ name, email }: LoginCredentials) => {
    try {
      const response = await fetch(
        "https://frontend-take-home-service.fetch.com/auth/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      setIsAuthenticated(true);
      setAuthError(null);
      return true;
    } catch (error) {
      setAuthError("Failed to login. Please try again.");
      return false;
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch(
        "https://frontend-take-home-service.fetch.com/auth/logout",
        {
          credentials: "include",
          method: "POST",
        }
      );

      if (response.ok) {
        setIsAuthenticated(false);
        setAuthError(null);
        return true;
      }
      throw new Error("Logout failed");
    } catch (error) {
      setAuthError("Failed to sign out. Please try again.");
      return false;
    }
  };

  return {
    isAuthenticated,
    setIsAuthenticated,
    authError,
    handleLogin,
    handleSignOut,
  };
};

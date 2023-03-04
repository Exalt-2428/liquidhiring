import axios from "axios";
import React, { useState, useEffect, createContext } from "react";

import { useRouter } from "next/router";

interface UserContextValue {
  loading: boolean;
  user: null | { username: string; email: string; first_name: string; last_name: string; resume: File; };
  error: null | string;
  isAuthenticated: boolean;
  updated: boolean;
  uploaded: boolean;
  login: ({ username, password }: { username: any; password: any }) => Promise<void>;
  register: ({ firstName, lastName, email, password }: { firstName: string; lastName: string; email: string; password: string; }) => Promise<void>;
  logout: () => Promise<void>;
  clearErrors: () => void;
  updateProfile: ({ firstName, lastName, email, password }: { firstName: string; lastName: string; email: string; password: string; }, access_token: string) => Promise<void>;
  setUpdated: (updated: boolean) => void;
  setUploaded: (uploaded: boolean) => void;
  uploadResume: (formData: FormData, access_token: string) => Promise<void>;
}

const AuthContext = createContext<UserContextValue>({
  loading: false,
  user: null,
  error: null,
  isAuthenticated: false,
  updated: false,
  uploaded: false,
  login: async () => { },
  register: async () => { },
  logout: async () => { },
  clearErrors: () => { },
  updateProfile: async () => { },
  setUpdated: (updated: boolean) => { },
  setUploaded: (uploaded: boolean) => { },
  uploadResume: async () => { },
});


export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      loadUser();
    }
  }, [user]);

  // Login user
  const login = async ({ username, password }) => {
    try {
      setLoading(true);

      const res = await axios.post("/api/auth/login", {
        username,
        password,
      });

      if (res.data.success) {
        loadUser();
        setIsAuthenticated(true);
        setLoading(false);
        router.push("/");
      }
    } catch (error) {
      setLoading(false);
      setError(
        error.response &&
        (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Register user
  const register = async ({ firstName, lastName, email, password }) => {
    try {
      setLoading(true);

      const res = await axios.post(`${process.env.API_URL}/api/register/`, {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });

      if (res.data.message) {
        setLoading(false);
        router.push("/login");
      }
    } catch (error) {
      console.log(error.response);
      setLoading(false);
      setError(
        error.response &&
        (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Update user
  const updateProfile = async (
    { firstName, lastName, email, password },
    access_token
  ) => {
    try {
      setLoading(true);

      const res = await axios.put(
        `${process.env.API_URL}/api/me/update/`,
        {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (res.data) {
        setLoading(false);
        setUpdated(true);
        setUser(res.data);
      }
    } catch (error) {
      console.log(error.response);
      setLoading(false);
      setError(
        error.response &&
        (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Upload Resume
  const uploadResume = async (formData, access_token) => {
    try {
      setLoading(true);

      const res = await axios.put(
        `${process.env.API_URL}/api/upload/resume/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (res.data) {
        setLoading(false);
        setUploaded(true);
      }
    } catch (error) {
      console.log(error.response);
      setLoading(false);
      setError(
        error.response &&
        (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Load user
  const loadUser = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/auth/user");

      if (res.data.user) {
        setIsAuthenticated(true);
        setLoading(false);
        setUser(res.data.user);
      }
    } catch (error) {
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      setError(
        error.response &&
        (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Logout user
  const logout = async () => {
    try {
      const res = await axios.post("/api/auth/logout");

      if (res.data.success) {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      setError(
        error.response &&
        (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Clear Errors
  const clearErrors = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        error,
        isAuthenticated,
        updated,
        uploaded,
        login,
        register,
        updateProfile,
        logout,
        setUpdated,
        setUploaded,
        uploadResume,
        clearErrors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

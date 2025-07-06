/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getDataPrivate, logoutAPI } from "../utils/api";
import { jwtStorage } from "../utils/jwt_storage";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with your logic
  const [userProfile, setUserProfile] = useState({});
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);

  const navigate = useNavigate();

  const getDataProfile = () => {
    getDataPrivate("/api/v1/protected/profile")
      .then((resp) => {
        console.log("getDataProfile", resp?.user_logged);
        setIsLoadingScreen(false);
        if (resp?.user_logged) {
          setUserProfile(resp?.user_logged);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((err) => {
        setIsLoadingScreen(false);
        setIsLoggedIn(false);
        console.log(err);
      });
  };

  useEffect(() => {
    getDataProfile();
  }, []);

  const login = (access_token) => {
    jwtStorage.storeToken(access_token);
    getDataProfile();
    // Redirect will be handled after profile is loaded
  };

  // Redirect based on user type after profile is loaded
  useEffect(() => {
    if (isLoggedIn && userProfile.tipe_user) {
      if (userProfile.tipe_user === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (userProfile.tipe_user === "staff") {
        navigate("/staff/dashboard", { replace: true });
      } else {
        // Default fallback
        navigate("/dashboard", { replace: true });
      }
    }
  }, [isLoggedIn, userProfile.tipe_user, navigate]);

  const logout = () => {
    logoutAPI()
      .then((resp) => {
        if (resp?.isLoggedOut) {
          jwtStorage.removeItem();
          setIsLoggedIn(false);
          setUserProfile({});
          navigate("/login", { replace: true });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        userProfile,
        isLoadingScreen,
        setIsLoadingScreen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

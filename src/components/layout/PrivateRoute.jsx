/* eslint-disable react/prop-types */
import LoginPage from "../../pages/Login";
import MainLayout from "./Main";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import HamsterLoader from "../loaders/hamster";

const PrivateRoute = ({ component }) => {
  const { isLoggedIn, isLoadingScreen } = useContext(AuthContext);

  if (isLoggedIn && !isLoadingScreen ) {
    return <MainLayout> {component} </MainLayout>;

  } else if (!isLoggedIn && !isLoadingScreen ) {
      return <LoginPage />;     
    }

    return <HamsterLoader />;

};

export default PrivateRoute;

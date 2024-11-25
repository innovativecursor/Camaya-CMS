import React, { useEffect } from "react";
import Login from "../Components/Login/Login";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigate,
} from "react-router-dom";
import Home from "../Components/Home/Home";
import { connect } from "react-redux";
import PrivateRoute from "./PrivateRoute";
import SideDrawer from "../Components/Drawer/SideDrawer";
import { matchRoutes, useLocation } from "react-router-dom";
import Navbar from "../Components/NavigationBar/Navbar";
import DeleteProp from "../Components/deleteProp/DeleteProp";
import ProductTable from "../Components/ProductTable/ProductTable";
import ViewProp from "../Components/viewProp/ViewProp";
import UpdateProp from "../Components/updateProp/UpdateProp";
import Robots from "../Components/Robots/Robots";
import CatalogueManagement from "../Components/catalogueManagement/CatalogueManagement";
import CMS from "../Components/cms/CMS";
import Categories from "../Categories/Categories";
import ResetPassword from "../Components/resetPassword/ResetPassword";
import FilterMenu from "../Components/filterMenu/FilterMenu";
import CreateTestimonials from "../Components/createTestimonials/CreateTestimonials";
import DeleteTestimonials from "../Components/DeleteTestimonials/DeleteTestimonials";
import CreateProduct from "../Components/createProp/CreateProperty";

function Navigation(props) {
  const location = useLocation();
  const navigateTo = useNavigate();
  useEffect(() => {
    if (location.pathname === "/") {
      window.localStorage.clear();
      localStorage.removeItem("access_token");
      navigateTo("/");
      props.loggedOut();
    }
  }, [location.pathname]);

  return (
    <>
      <div>
        {location.pathname !== "/" && props.loggedIn ? (
          <div className="">
            <Navbar />
            <SideDrawer />
          </div>
        ) : (
          ""
        )}

        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/reset/:token" element={<ResetPassword />} />
            <Route element={<PrivateRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/addproperty" element={<CreateProduct />} />
              <Route
                path="/deleteproperty"
                element={<ProductTable pageMode="Delete" type="Property"/>}
              />
              <Route path="/deleteinner" element={<DeleteProp />} />
              <Route
                path="/viewproperty"
                element={<ProductTable pageMode="View" type="Property" />}
              />
              <Route path="/viewinner" element={<ViewProp />} />
              <Route
                path="/updateproperty"
                element={<ProductTable pageMode="Update" type="Property" />}
              />
              <Route path="/updateinner" element={<UpdateProp />} />
              <Route path="/filtermenu" element={<FilterMenu />} />
              <Route
                path="/createTestimonials"
                element={<CreateTestimonials />}
              />
              <Route
                path="/deleteTestimonials"
                element={<ProductTable pageMode="Delete" type="Testimonials" />}
              />
              <Route
                path="/deleteTestimonialsinner"
                element={<DeleteTestimonials />}
              />
            </Route>
            <Route path="*" element={<Robots />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {
    loggedOut: () => dispatch({ type: "LOGGEDOUT" }),
  };
};
const mapStateToProps = (state) => {
  return {
    loggedIn: state?.universalReducer?.isLoggedIn,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Navigation);

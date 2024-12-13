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
import Inquiries from "../Components/Inquiries/Inquiries";
import ResetPassword from "../Components/resetPassword/ResetPassword";
import FilterMenu from "../Components/filterMenu/FilterMenu";
import CreateTestimonials from "../Components/createTestimonials/CreateTestimonials";
import DeleteTestimonials from "../Components/DeleteTestimonials/DeleteTestimonials";
import CreateProduct from "../Components/createProp/CreateProperty";
import CreateAmenities from "../Components/createAmenities/CreateAmenities";
import Updateamenities from "../Components/updateAmenities/UpdateAmenities";
import DeleteAmenities from "../Components/deleteAmenities/DeleteAmenities";
import Hero from "../Components/HeroSection/Hero";

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
              <Route path="/inquiries" element={<Inquiries />} />
              <Route path="/addproperty" element={<CreateProduct />} />
              <Route
                path="/deleteproperty"
                element={<ProductTable pageMode="Delete" type="Property" />}
              />
              <Route path="/deleteinner" element={<DeleteProp />} />
              <Route
                path="/viewproperty"
                element={<ProductTable pageMode="View" type="Property" />}
              />
              <Route
                path="/heroSection"
                element={<Hero pageMode="Update" type="Hero" />}
              />
              <Route path="/viewinner" element={<ViewProp />} />
              <Route
                path="/updateproperty"
                element={<ProductTable pageMode="Update" type="Property" />}
              />
              <Route path="/updateinner" element={<UpdateProp />} />
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
              <Route path="/createAmenities" element={<CreateAmenities />} />
              <Route
                path="/updateAmenities"
                element={<ProductTable pageMode="Update" type="Amenities" />}
              />
              <Route
                path="/updateAmenitiesinner"
                element={<Updateamenities />}
              />
              <Route
                path="/deleteAmenities"
                element={<ProductTable pageMode="Delete" type="Amenities" />}
              />
              <Route
                path="/deleteAmenitiesinner"
                element={<DeleteAmenities />}
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

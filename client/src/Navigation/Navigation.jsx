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
import DeleteInner from "../Components/deleteProd/DeleteInner";
import ProductTable from "../Components/ProductTable/ProductTable";
import ViewInner from "../Components/viewProd/ViewInner";
import UpdateInner from "../Components/updateProd/UpdateInner";
import Robots from "../Components/Robots/Robots";
import CatalogueManagement from "../Components/catalogueManagement/CatalogueManagement";
import CMS from "../Components/cms/CMS";
import Categories from "../Categories/Categories";
import AddProduct from "../Components/createProd/AddProduct";
import ResetPassword from "../Components/resetPassword/ResetPassword";
import FilterMenu from "../Components/filterMenu/FilterMenu";
import Awards from "../Components/CreateAward/CreateAwards";
import CreateAwards from "../Components/CreateAward/CreateAwards";
import UpdateAwards from "../UpdateAwards/UpdateAwards";
import DeleteAwards from "../DeleteAwards/DeleteAwards";

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
              <Route path="/addproduct" element={<AddProduct />} />
              <Route
                path="/deleteproduct"
                element={<ProductTable pageMode="Delete" />}
              />
              <Route path="/deleteinner" element={<DeleteInner />} />
              <Route
                path="/viewproducts"
                element={<ProductTable pageMode="View" />}
              />
              <Route path="/viewinner" element={<ViewInner />} />
              <Route
                path="/updateproduct"
                element={<ProductTable pageMode="Update" />}
              />
              <Route path="/updateinner" element={<UpdateInner />} />
              <Route path="/filtermenu" element={<FilterMenu />} />
              <Route path="/createawards" element={<CreateAwards />} />
              {/* <Route
                path="/updateawards"
                element={<ProductTable pageMode="Update" type="Awards" />}
              /> */}
              {/* <Route path="/updateawardinner" element={<UpdateAwards />} /> */}
              <Route path="/deleteawardinner" element={<DeleteAwards />} />
              <Route
                path="/deleteawards"
                element={<ProductTable pageMode="Delete" type="Awards" />}
              />
              <Route path="/cms" element={<CMS />} />
              <Route path="/categories" element={<Categories />} />
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

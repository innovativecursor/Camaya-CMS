import React, { useState } from "react";
import { Button, Drawer, Radio, Space } from "antd";
import { FaArrowRight } from "react-icons/fa";
import { NavLink } from "react-router-dom";
const menu = [
  {
    text: "Add Product",
    link: "/addproduct",
  },
  {
    text: "Update Product",
    link: "/updateproduct",
  },
  {
    text: "Delete Product",
    link: "/deleteproduct",
  },
  {
    text: "View Products",
    link: "/viewproducts",
  },
  {
    text: "View Users",
    link: "/viewusers",
  },
  {
    text: "Filter Menu",
    link: "/filtermenu",
  },
  {
    text: "Create Award",
    link: "/createawards",
  },
  // {
  //   text: "Update Award",
  //   link: "/updateawards",
  // },
  {
    text: "Delete Award",
    link: "/deleteawards",
  },
  // {
  //   text: "Catalogue Management",
  //   link: "/cataloguemanagement",
  // },
];
function SideDrawer() {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("left");
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <button
        type="primary"
        onClick={showDrawer}
        className="top-1/2 fixed rounded-lg text-6xl z-10"
      >
        <div className="rounded-full bg-slate-500 border-spacing-8 p-2 ml-1">
          <FaArrowRight className="h-10 w-10" />
        </div>
      </button>
      <Drawer
        title="PropShop Worldwide Action Menu"
        placement={placement}
        width={500}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Close Menu</Button>
          </Space>
        }
      >
        <ul>
          {menu.map((el) => {
            return (
              <li onClick={onClose}>
                <NavLink to={el.link}>
                  <div className="card hover:bg-blue-300 hover:text-white text-xl font-medium my-8">
                    {el.text}
                  </div>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </Drawer>
    </>
  );
}

export default SideDrawer;

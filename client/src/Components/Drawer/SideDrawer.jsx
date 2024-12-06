import React, { useState } from "react";
import { Button, Drawer, Radio, Space } from "antd";
import { FaArrowRight } from "react-icons/fa";
import { NavLink } from "react-router-dom";
const menu = [
  {
    text: "Inquiries",
    link: "/inquiries",
  },
  {
    text: "Add Property",
    link: "/addproperty",
  },
  {
    text: "Update Property",
    link: "/updateproperty",
  },
  {
    text: "Delete Property",
    link: "/deleteproperty",
  },
  {
    text: "View Properties",
    link: "/viewproperty",
  },
  {
    text: "Filter Menu",
    link: "/filtermenu",
  },
  {
    text: "Add Testimonials",
    link: "/createTestimonials",
  },
  {
    text: "Delete Testimonial",
    link: "/deleteTestimonials",
  },
  {
    text: "Create Amenities",
    link: "/createAmenities",
  },
  {
    text: "Update Amenities",
    link: "/updateAmenities",
  },
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
        title="Camaya Action Menu"
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

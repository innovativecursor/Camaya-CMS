import React, { useState } from "react";
import { Button, Collapse, Drawer, Radio, Space } from "antd";
import { FaArrowRight } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { Menu } from "../../Constants/Conts";
const { Panel } = Collapse;

const menu = [
  {
    text: "Inquiries",
    link: "/inquiries",
  },
  {
    text: "Hero Section",
    link: "/heroSection",
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
  {
    text: "Delete Amenities",
    link: "/deleteAmenities",
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
        bodyStyle={{ padding: 0 }} // This removes padding in inline styles
        className="!p-0" // This removes padding using Tailwind's utility class with important
      >
        <Collapse accordion className="!not-sr-onlyp-0">
          {Object.entries(Menu).map(([key, actions]) => (
            <Panel
              header={
                <div className="text-lg font-semibold text-blue-600">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </div>
              }
              key={key}
              className="bg-white border-0 rounded-lg mb-2"
            >
              <ul>
                {actions.map((el) => (
                  <li key={el.link} onClick={onClose}>
                    <NavLink to={el.link}>
                      <div className="card hover:bg-blue-300 hover:text-white text-xl font-medium my-8">
                        {el.text}
                      </div>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </Collapse>
      </Drawer>
    </>
  );
}

export default SideDrawer;

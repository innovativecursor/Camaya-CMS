import { Divider } from "antd";
import React from "react";

function PageWrapper(props) {
  return (
    <div className="w-full flex flex-row justify-center items-center md:p-10">
      {/* <div className="card w-full flex justify-center"> */}
        <div
          className={
            props.title === "Products"
              ? "card flex flex-col justify-center items-center"
              : "card flex flex-col justify-center items-center w-11/12"
          }
        >
          <div className="title">
            <h1 className="text-4xl font-bold">{props.title}</h1>
          </div>
          <Divider />
          {props.children}
        </div>
      {/* </div> */}
    </div>
  );
}

export default PageWrapper;

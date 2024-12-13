import React from "react";
import GlobalForm from "../GlobalForm/GlobalForm";

function Hero(props) {
  return (
    <div>
      {" "}
      <GlobalForm pageMode={props?.pageMode} type={props?.type} />
    </div>
  );
}

export default Hero;

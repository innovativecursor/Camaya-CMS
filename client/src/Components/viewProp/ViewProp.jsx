import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import GlobalForm from "../GlobalForm/GlobalForm";

function ViewProp() {
  const location = useLocation();
  const [record, setRecord] = useState(location.state);
  useEffect(() => {
    if (location?.state) {
      "Location state", location.state;
      let asd = { ...location.state };
      setRecord(asd);
    }
  }, [location]);

  return (
    <>
      {record ? (
        <GlobalForm pageMode="View" record={record} type="Property" />
      ) : null}
    </>
  );
}

export default ViewProp;

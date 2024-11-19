import React, { useEffect, useState } from "react";
import GlobalForm from "../Components/GlobalForm/GlobalForm";
import { useLocation } from "react-router-dom";

function UpdateAwards() {
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
        <GlobalForm pageMode="Update" type="Awards" record={record} />
      ) : null}
    </>
  );
}

export default UpdateAwards;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import GlobalForm from "../Components/GlobalForm/GlobalForm";

function DeleteAwards() {
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
        <GlobalForm pageMode="Delete" type="Awards" record={record} />
      ) : null}
    </>
  );
}

export default DeleteAwards;

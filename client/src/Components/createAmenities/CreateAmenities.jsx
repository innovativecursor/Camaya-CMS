import React, { useState } from "react";
import PageWrapper from "../PageContainer/PageWrapper";
import { Form, Input, InputNumber, Spin, Upload } from "antd";
import Creatable from "react-select/creatable";
import TextArea from "antd/es/input/TextArea";
import { PlusOutlined } from "@ant-design/icons";
import GlobalForm from "../GlobalForm/GlobalForm";

function CreateAmenities(props) {
  return (
    <>
      <GlobalForm pageMode="Add" type="Amenities" />
    </>
  );
}

export default CreateAmenities;

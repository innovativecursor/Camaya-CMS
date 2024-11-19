import React, { useEffect, useState } from "react";
import PageWrapper from "../PageContainer/PageWrapper";
import { Form, Input } from "antd";
import { getAxiosCall, postAxiosCall } from "../../Axios/UniversalAxiosCalls";
import Swal from "sweetalert2";
import Creatable from "react-select/creatable";
function CatalogueManagement() {
  //   const [bodyStyle, setBodyStyle] = useState("");
  //   const [genre, setGenre] = useState("");
  const [inputs, setInputs] = useState({});
  const [location, setLocation] = useState([]);
  const [boothSize, setBoothSize] = useState([]);
  const [functionalReq, setFunctionalReq] = useState([]);
  const [locationButton, setLocationButton] = useState("Save Data");
  const [boothSizeButton, setBoothSizeButton] = useState("Save Data");
  const [functionalReqButton, setFunctionalReqButton] = useState("Save Data");
  useEffect(() => {}, []);

  return (
    <div>
      <PageWrapper title="Catalogue Management">
        <Form
          // onFinish={savestuff}
          style={{ width: "50%" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Add location
              </label>
              <Creatable
                required
                isClearable
                isMulti={false}
                onChange={(e) => {
                  let finalText = location?.filter(
                    (el) => el?.value === e?.value
                  );
                  if (finalText?.length != 0) {
                    setLocationButton("Delete Data");
                  } else {
                    setLocationButton("Save Data");
                  }
                  setInputs({ ...inputs, location: e.value });
                }}
                options={location.length != 0 ? location : []}
                isSearchable
                styles={{ width: "100%" }}
                value={{
                  label: inputs?.location,
                  value: inputs?.location,
                }}
              />
            </div>
            <div className="actionButtons w-full flex justify-center">
              <button
                className="my-4 text-black p-4 font-semibold hover:bg-orange-400 hover:text-white rounded-lg bg-indigo-200"
                type="button"
                // onClick={}
                disabled={inputs?.locationType ? false : true}
              >
                {locationButton}
              </button>
            </div>
            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700"
              >
                Add a Booth Size
              </label>
              <Creatable
                placeholder="The Theme of the Tattoo"
                required
                isMulti={false}
                onChange={(e) => {
                  let finalText = boothSize.filter(
                    (el) => el.value === e.value
                  );
                  if (finalText?.length != 0) {
                    setBoothSizeButton("Delete Data");
                  } else {
                    setBoothSizeButton("Save Data");
                  }
                  setInputs({ ...inputs, boothSize: e.value });
                }}
                isClearable
                options={boothSize.length != 0 ? boothSize : []}
                isSearchable
                value={{ label: inputs?.boothSize, value: inputs?.boothSize }}
              />
            </div>
            <div className="acitonButtons w-full flex justify-center">
              <button
                className="my-4 text-black p-4 font-semibold hover:bg-orange-400 hover:text-white rounded-lg bg-indigo-200"
                type="button"
                // onClick={}
                // disabled={inputs?.boothsize ? false : true}
              >
                {locationButton}
              </button>
            </div>
            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700"
              >
                Add functional filter requirements
              </label>
              <Creatable
                placeholder="Functional Requirements"
                required
                isMulti={false}
                onChange={(e) => {
                  let finalText = functionalReq?.filter(
                    (el) => el?.value === e?.value
                  );
                  if (finalText?.length != 0) {
                    setFunctionalReqButton("Delete Data");
                  } else {
                    setFunctionalReqButton("Save Data");
                  }
                  setInputs({ ...inputs, functionalReq: e?.value });
                }}
                isClearable
                options={functionalReq.length != 0 ? functionalReq : []}
                isSearchable
                value={{
                  label: inputs?.functionalReq,
                  value: inputs?.functionalReq,
                }}
              />
            </div>
            <div className="acitonButtons w-full flex justify-center">
              <button
                className="my-4 text-black p-4 font-semibold hover:bg-orange-400 hover:text-white rounded-lg bg-indigo-200"
                type="button"
                // onClick={saveboothSize}
                disabled={inputs?.genre ? false : true}
              >
                {boothSizeButton}
              </button>
            </div>
            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700"
              >
                Add Budget Range
              </label>
              <Creatable
                placeholder="Functional Requirements"
                required
                isMulti={false}
                onChange={(e) => {
                  let finalText = functionalReq?.filter(
                    (el) => el?.value === e?.value
                  );
                  if (finalText?.length != 0) {
                    setFunctionalReqButton("Delete Data");
                  } else {
                    setFunctionalReqButton("Save Data");
                  }
                  setInputs({ ...inputs, functionalReq: e?.value });
                }}
                isClearable
                options={functionalReq.length != 0 ? functionalReq : []}
                isSearchable
                value={{
                  label: inputs?.functionalReq,
                  value: inputs?.functionalReq,
                }}
              />
            </div>
            <div className="acitonButtons w-full flex justify-center">
              <button
                className="my-4 text-black p-4 font-semibold hover:bg-orange-400 hover:text-white rounded-lg bg-indigo-200"
                type="button"
                // onClick={saveboothSize}
                disabled={inputs?.genre ? false : true}
              >
                {boothSizeButton}
              </button>
            </div>
            {/* <div className="flex gap-2 flex-col">
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700"
              >
                Add Budget Range (in US $)
              </label>
              <div className="flex gap-4 flex-row">
                <div className="">
                  <label
                    htmlFor="text"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Min Value
                  </label>
                  <Input
                    required
                    type="text"
                    id="sku"
                    name="sku"
                    className="mt-1 p-2 block w-full border rounded-md"
                  />
                </div>
                <div className="">
                  <label
                    htmlFor="text"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Max Value
                  </label>
                  <Input
                    required
                    type="text"
                    id="sku"
                    name="sku"
                    className="mt-1 p-2 block w-full border rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="acitonButtons w-full flex justify-center">
              <button
                className="my-4 text-black p-4 font-semibold hover:bg-orange-400 hover:text-white rounded-lg bg-indigo-200"
                type="button"
                // onClick={saveGenre}
                disabled={inputs?.genre ? false : true}
              >
                Save Data
              </button>
            </div> */}
          </div>
        </Form>
      </PageWrapper>
    </div>
  );
}

export default CatalogueManagement;

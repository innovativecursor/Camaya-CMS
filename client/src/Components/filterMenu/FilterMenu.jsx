import React, { useEffect, useState } from "react";
import PageWrapper from "../PageContainer/PageWrapper";
import { Checkbox, Form, InputNumber, Spin } from "antd";
import Select from "react-select";
import { getAxiosCall } from "../../Axios/UniversalAxiosCalls";
import ProductTable from "../ProductTable/ProductTable";

function FilterMenu() {
  const [inputs, setInputs] = useState({});
  const [checkboxValues, setCheckboxValues] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [boothSizeOptions, setBoothSizeOptions] = useState([]);
  const [budgetOptions, setBudgetOptions] = useState([]);
  const [secondaryOptions, setSecondaryOptions] = useState([]);
  const [checkboxOptions, setcheckboxOptions] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(null);

  useEffect(() => {
    callingOptions();
  }, []);

  const callingOptions = async () => {
    try {
      const resLocation = await getAxiosCall("/locationOptions");
      if (resLocation) {
        const collection = resLocation.data?.map((el) => ({
          label: el,
          value: el,
        }));
        setLocationOptions(collection);
      }

      const resBooth = await getAxiosCall("/boothsizeOptions");
      if (resBooth) {
        const collection = resBooth.data?.map((el) => ({
          label: el,
          value: el,
        }));
        setBoothSizeOptions(collection);
      }

      const resBudget = await getAxiosCall("/budgetOptions");
      if (resBudget) {
        setBudgetOptions(resBudget?.data);
      }
      const secondaryOptions = await getAxiosCall("/secondaryOptions");
      if (secondaryOptions) {
        setSecondaryOptions(secondaryOptions?.data);
      }
      const functionalRequirements = await getAxiosCall("/functionalReq");
      if (functionalRequirements) {
        setcheckboxOptions(functionalRequirements?.data);
      }
    } catch (error) {
      console.error("Failed to fetch options", error);
    }
  };

  const onChange = (checkedValues) => {
    setCheckboxValues(checkedValues);
    const updatedInputs = checkboxOptions.reduce((acc, option) => {
      acc[option.value] = checkedValues.includes(option.value);
      return acc;
    }, {});
    setInputs((prevInputs) => ({
      ...prevInputs,
      ...updatedInputs,
    }));
  };

  const handleSubmit = async () => {
    try {
      const queryParams = new URLSearchParams(inputs).toString();
      const response = await getAxiosCall(`/products?${queryParams}`);
      if (response) {
        setFilteredProducts(response.data.products);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  return (
    <PageWrapper title="Filter Exhibitions">
      <div className="container mx-auto p-4 text-xl">
        <Form onFinish={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Location (City, Country)
              </label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                name="location"
                onChange={(e) => {
                  setInputs({ ...inputs, location: e ? e.value : "" });
                }}
                options={locationOptions.length ? locationOptions : []}
                value={{
                  label: inputs?.location,
                  value: inputs?.location,
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Booth Size (For example: 10X20)
              </label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                name="booth_size"
                onChange={(e) => {
                  setInputs({ ...inputs, booth_size: e ? e.value : "" });
                }}
                options={boothSizeOptions.length ? boothSizeOptions : []}
                value={{
                  label: inputs?.booth_size,
                  value: inputs?.booth_size,
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Budget Range (in US$)
              </label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                name="budget"
                onChange={(e) => {
                  setInputs({
                    ...inputs,
                    budget: e ? JSON.stringify(e.value) : "",
                  });
                }}
                options={budgetOptions.length ? budgetOptions : []}
                value={
                  inputs.budget
                    ? budgetOptions.find(
                        (option) =>
                          JSON.stringify(option.value) === inputs.budget
                      )
                    : null
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Closed Meeting Room
              </label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                name="closed_meeting_room"
                options={secondaryOptions}
                onChange={(e) => {
                  setInputs({
                    ...inputs,
                    closed_meeting_room: e ? Number(e.value) : "",
                  });
                }}
                value={{
                  label: inputs?.closed_meeting_room,
                  value: inputs?.closed_meeting_room,
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number of Demo Stations
              </label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                name="demo_stations"
                options={secondaryOptions}
                onChange={(e) => {
                  setInputs({
                    ...inputs,
                    demo_stations: e ? Number(e.value) : "",
                  });
                }}
                value={{
                  label: inputs?.demo_stations,
                  value: inputs?.demo_stations,
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Open Discussion Areas
              </label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                name="open_discussion_area"
                options={secondaryOptions}
                onChange={(e) => {
                  setInputs({
                    ...inputs,
                    open_discussion_area: e ? Number(e.value) : "",
                  });
                }}
                value={{
                  label: inputs?.open_discussion_area,
                  value: inputs?.open_discussion_area,
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mt-4">
              Filter by Functional Requirements
            </label>
            <br />
            <Checkbox.Group
              options={checkboxOptions}
              onChange={onChange}
              value={checkboxValues}
            />
            <br />
          </div>
          <div className="actionButtons w-full flex justify-center">
            <button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out items-center justify-center"
              type="submit"
            >
              Filter Data
            </button>
          </div>
        </Form>
      </div>
      <ProductTable pageMode="View" filteredProducts={filteredProducts} />
    </PageWrapper>
  );
}

export default FilterMenu;

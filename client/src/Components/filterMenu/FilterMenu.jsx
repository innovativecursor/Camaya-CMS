import React, { useEffect, useState } from "react";
import PageWrapper from "../PageContainer/PageWrapper";
import { Checkbox, Form, InputNumber, Spin } from "antd";
import Select from "react-select";
import { getAxiosCall } from "../../Axios/UniversalAxiosCalls";
import ProductTable from "../ProductTable/ProductTable";

function FilterMenu() {
  const [inputs, setInputs] = useState({});
  const [propertyOptions, setPropertyOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [pricingOptions, setPricingOptions] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(null);

  useEffect(() => {
    callingOptions();
  }, []);

  const callingOptions = async () => {
    try {
      const resProp = await getAxiosCall("/propertyOptions");
      if (resProp) {
        const collection = resProp.data?.map((el) => ({
          label: el,
          value: el,
        }));
        setPropertyOptions(collection);
      }
      const resLocation = await getAxiosCall("/locationOptions");
      if (resLocation) {
        const collection = resLocation.data?.map((el) => ({
          label: el,
          value: el,
        }));
        setLocationOptions(collection);
      }

      const resPrice = await getAxiosCall("/pricingOptions");
      if (resPrice) {
        const collection = resPrice.data?.map((el) => ({
          label: el,
          value: el,
        }));
        setPricingOptions(collection);
      }
    } catch (error) {
      console.error("Failed to fetch options", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const queryParams = new URLSearchParams(inputs).toString();
      const response = await getAxiosCall(`/properties?${queryParams}`);
      if (response) {
        setFilteredProducts(response.data.properties);
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
                Property
              </label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                name="property"
                onChange={(e) => {
                  setInputs({ ...inputs, prop_name: e ? e.value : "" });
                }}
                options={propertyOptions.length ? propertyOptions : []}
                value={{
                  label: inputs?.prop_name,
                  value: inputs?.prop_name,
                }}
              />
            </div>
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
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <Select
                className="basic-single"  
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                name="price"
                onChange={(e) => {
                  setInputs({ ...inputs, price: e ? e.value : "" });
                }}
                options={pricingOptions.length ? pricingOptions : []}
                value={{
                  label: inputs?.price,
                  value: inputs?.price,
                }}
              />
            </div>
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

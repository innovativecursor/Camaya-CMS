import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import PageWrapper from "../PageContainer/PageWrapper";
import {
  Button,
  Cascader,
  Checkbox,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Slider,
  Space,
  Spin,
  Switch,
  TreeSelect,
  Upload,
} from "antd";
import Creatable from "react-select/creatable";
import Select from "react-select";
import {
  deleteAxiosCall,
  getAxiosCall,
  postAxiosCall,
  updateAxiosCall,
} from "../../Axios/UniversalAxiosCalls";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const { TextArea } = Input;
function GlobalForm(props) {
  const [loading, setLoading] = useState(false);
  const [imageArray, setImageArray] = useState([]);
  const [checkboxValues, setCheckboxValues] = useState();
  const [checkboxWebsiteValues, setCheckboxWebsiteValues] = useState();
  const [inputs, setInputs] = useState({});
  const [locationOptions, setLocationOptions] = useState();
  const [boothSizeOptions, setBoothSizeOptions] = useState();
  const [budgetOptions, setBudgetOptions] = useState();
  const [imageClone, setImageClone] = useState(props?.record?.pictures);
  const [awardImages, setAwardImages] = useState(props?.record?.award_pictures);
  const [options, setOptions] = useState([]);
  const [websiteInfoOptions, setWebsiteInfoOptions] = useState([]);
  // const [yearOptions, setYearOptions] = useState();
  const NavigateTo = useNavigate();
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 100 }, (_, i) => {
    const year = currentYear - i;
    return { value: year, label: year.toString() };
  });

  useEffect(() => {
    callingOptions();
    if (props?.record) {
      setInputs(props.record);
    }
  }, []);
  // loading the functional Req and then loading the values
  useEffect(() => {
    if (props?.record) {
      const trueFunctionalRequirements = extractTrueFunctionalRequirements(
        props?.record,
        options
      );
      setCheckboxValues(trueFunctionalRequirements);
    }
  }, [options]);
  // loading the Website Info Req and then loading the values
  useEffect(() => {
    if (props?.record) {
      const trueFunctionalRequirements = extractTrueFunctionalRequirements(
        props?.record,
        websiteInfoOptions
      );
      setCheckboxWebsiteValues(trueFunctionalRequirements);
    }
  }, [websiteInfoOptions]);
  function extractTrueFunctionalRequirements(input, options) {
    const result = [];
    if (options.length != 0) {
      options.forEach((option) => {
        const key = option?.value;
        if (input[key] === true) {
          result.push(key);
        }
      });

      return result;
    }
  }
  const callingOptions = async () => {
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
      const collection = resBudget.data?.map((el) => ({
        label: el,
        value: el,
      }));
      setBudgetOptions(collection);
    }
    const functionalRequirements = await getAxiosCall("/functionalReq");
    if (functionalRequirements) {
      setOptions(functionalRequirements?.data);
    }
    const webInfo = await getAxiosCall("/webInfo");
    if (webInfo) {
      setWebsiteInfoOptions(webInfo?.data);
    }
  };
  const onChange = (checkedValues) => {
    setCheckboxValues(checkedValues);
    // Create an updated inputs object based on checkedValues
    const updatedInputs = options.reduce((acc, option) => {
      acc[option.value] = checkedValues.includes(option.value);
      return acc;
    }, {});
    setInputs((prevInputs) => ({
      ...prevInputs,
      ...updatedInputs,
    }));
  };
  const onChange_webInfo = (checkedValues) => {
    setCheckboxWebsiteValues(checkedValues);

    // Create an updated inputs object based on checkedValues
    const updatedInputs = websiteInfoOptions.reduce((acc, option) => {
      acc[option.value] = checkedValues.includes(option.value);
      return acc;
    }, {});
    setInputs((prevInputs) => ({
      ...prevInputs,
      ...updatedInputs,
    }));
  };
  // const options = [
  //   {
  //     label: "Bar Area",
  //     value: "bar_area",
  //   },
  //   {
  //     label: "Hanging sign",
  //     value: "hanging_sign",
  //   },
  //   {
  //     label: "LED Video Wall",
  //     value: "led_video_wall",
  //   },
  //   {
  //     label: "Lounge Area",
  //     value: "longue_area",
  //   },
  //   {
  //     label: "Product Display",
  //     value: "product_display",
  //   },
  //   {
  //     label: "Reception Counter",
  //     value: "reception_counter",
  //   },
  //   {
  //     label: "Semi Closed Meeting Area",
  //     value: "semi_closed_meeting_area",
  //   },
  //   {
  //     label: "Storage Room",
  //     value: "storage_room",
  //   },
  //   {
  //     label: "Theatre Style Demo",
  //     value: "theatre_style_demo",
  //   },
  //   {
  //     label: "Touch Screen Kiosk",
  //     value: "touch_screen_kiosk",
  //   },
  // ];
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const convertAllToBase64 = async () => {
    if (props.pageMode === "Add") {
      if (imageArray?.length != 0) {
        let B64Array = [];
        let asd;
        for (let i = 0; i < imageArray?.length; i++) {
          const base64String = await getBase64(imageArray[i]?.originFileObj);
          B64Array.push(base64String);
        }
        let dummyObj = { pictures: [...B64Array] };

        asd = Object.assign(inputs, { pictures: dummyObj?.pictures });
        setInputs({ ...inputs, pictures: asd });
      }
    } else {
      if (imageArray?.length != 0) {
        let B64Array = [];
        let asd;
        for (let i = 0; i < imageArray.length; i++) {
          const base64String = await getBase64(imageArray[i]?.originFileObj);
          B64Array.push(base64String);
        }
        let dummyObj = [...(inputs && inputs?.pictures)];

        dummyObj = [...dummyObj, ...B64Array];
        asd = Object.assign(inputs, { pictures: dummyObj });
        setInputs({ ...inputs, pictures: asd });
      }
    }
  };
  // A submit form used for both (i.e.. Products & Awards)
  const submitForm = async () => {
    if (!props.type) {
      if (!inputs?.location || !inputs?.booth_size || !inputs?.budget) {
        Swal.fire({
          title: "error",
          text: "Location, Booth Size and Budget are mandatory fields",
          icon: "error",
          confirmButtonText: "Alright!",
          allowOutsideClick: false,
        });
        return;
      }
    } else {
      if (!inputs?.award_title || !inputs?.award_year) {
        Swal.fire({
          title: "error",
          text: "Award Title and Award Year are mandatory fields",
          icon: "error",
          confirmButtonText: "Alright!",
          allowOutsideClick: false,
        });
        return;
      }
    }
    try {
      switch (props.pageMode) {
        case "Add":
          if (imageArray.length == 0) {
            Swal.fire({
              title: "error",
              text: "Add at least one Picture to proceed!",
              icon: "error",
              confirmButtonText: "Alright!",
              allowOutsideClick: false,
            });
            return;
          }
          // Converting images to base64
          await convertAllToBase64();
          let answer;
          if (!props?.type) {
            answer = await postAxiosCall("/createproduct", inputs);
          } else {
            answer = await postAxiosCall("/addAward", inputs);
          }
          if (answer) {
            Swal.fire({
              title: "Success",
              text: answer?.message,
              icon: "success",
              confirmButtonText: "Great!",
              allowOutsideClick: false,
            }).then(() => {
              window.location.reload(true);
            });
            setInputs({});
          }
          break;
        case "Update":
          if (imageArray.length == 0 && imageClone.length == 0) {
            Swal.fire({
              title: "error",
              text: "Add at least one Picture to proceed!",
              icon: "error",
              confirmButtonText: "Alright!",
              allowOutsideClick: false,
            });
            return;
          }
          //merging the new images (if uploaded)
          await convertAllToBase64();

          const updatedResult = await updateAxiosCall(
            "/products",
            props?.record?.prd_id,
            inputs
          );
          if (updatedResult) {
            Swal.fire({
              title: "Success",
              text: updatedResult?.message,
              icon: "success",
              confirmButtonText: "Great!",
              allowOutsideClick: false,
            }).then(() => {
              setInputs();
              NavigateTo("/updateproduct");
            });
          }
          break;
        case "Delete":
          Swal.fire({
            title: "info",
            text: "Are You Sure You want to Delete This Product",
            icon: "info",
            confirmButtonText: "Delete",
            showCancelButton: true,
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              remove();
            }
          });
          break;
        default:
          break;
      }
    } catch (error) {
      Swal.fire({
        title: "error",
        text: error,
        icon: "error",
        confirmButtonText: "Alright!",
        allowOutsideClick: false,
      });
    }
  };
  const remove = async () => {
    let answer;
    if (props?.type != "Awards" && props?.type) {
      answer = await deleteAxiosCall("/products", props?.record?.prd_id);
    } else {
      answer = await deleteAxiosCall("/deleteAward", props?.record?.award_id);
    }
    if (answer) {
      Swal.fire({
        title: "Success",
        text: answer?.message,
        icon: "success",
        confirmButtonText: "Great!",
        allowOutsideClick: false,
      });
      setInputs();
      NavigateTo("/deleteproduct");
    }
  };
  const deleteImage = async (imageIndex) => {
    const dupli = inputs?.pictures;
    dupli?.splice(imageIndex, 1);
    setInputs({ ...inputs, pictures: dupli });
  };
  const deleteModal = (index) => {
    Swal.fire({
      title: "info",
      text: "Are You Sure You want to Delete This Picture",
      icon: "info",
      confirmButtonText: "Delete",
      showCancelButton: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteImage(index);
      }
    });
  };

  return (
    <>
      {props?.type != "Awards" ? (
        <PageWrapper title={`${props?.pageMode} Product`}>
          <div className="container mx-auto p-4 text-xl">
            <Spin spinning={loading}>
              <Form onFinish={submitForm}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Product Name
                    </label>
                    <Input
                      disabled={
                        props?.pageMode === "Delete" ||
                        props?.pageMode === "View"
                          ? true
                          : false
                      }
                      required
                      type="text"
                      id="product_name"
                      placeholder="Product Name"
                      name="product_name"
                      className="mt-1 p-2 block w-full border rounded-md"
                      onChange={(e) => {
                        setInputs({
                          ...inputs,
                          [e.target.name]: e.target.value,
                        });
                      }}
                      value={inputs?.product_name}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Location (City,Country)
                    </label>
                    <Creatable
                      isDisabled={
                        props?.pageMode === "Delete" ||
                        props?.pageMode === "View"
                          ? true
                          : false
                      }
                      placeholder="Location"
                      required
                      isMulti={false}
                      onChange={(e) => {
                        setInputs({ ...inputs, location: e.value });
                      }}
                      isClearable
                      options={
                        locationOptions?.length != 0 ? locationOptions : []
                      }
                      isSearchable
                      value={{
                        label: inputs?.location,
                        value: inputs?.location,
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Booth Size (For eg: 10X20)
                    </label>
                    <Creatable
                      isDisabled={
                        props?.pageMode === "Delete" ||
                        props?.pageMode === "View"
                          ? true
                          : false
                      }
                      placeholder="Booth Size"
                      required
                      isMulti={false}
                      onChange={(e) => {
                        setInputs({
                          ...inputs,
                          booth_size: e.value?.toUpperCase(),
                        });
                      }}
                      isClearable
                      options={
                        boothSizeOptions?.length != 0 ? boothSizeOptions : []
                      }
                      isSearchable
                      value={{
                        label: inputs?.booth_size?.toUpperCase(),
                        value: inputs?.booth_size?.toUpperCase(),
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Budget (in US$)
                    </label>
                    <InputNumber
                      disabled={
                        props?.pageMode === "Delete" ||
                        props?.pageMode === "View"
                          ? true
                          : false
                      }
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                      placeholder="Budget"
                      className="w-full rounded-md"
                      size="large"
                      required
                      isMulti={false}
                      onChange={(e) => {
                        setInputs({ ...inputs, budget: e });
                      }}
                      isClearable
                      options={budgetOptions?.length != 0 ? budgetOptions : []}
                      isSearchable
                      value={inputs?.budget}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Closed Meeting Room
                    </label>
                    <InputNumber
                      disabled={
                        props?.pageMode === "Delete" ||
                        props?.pageMode === "View"
                          ? true
                          : false
                      }
                      placeholder="Closed Meeting Room"
                      size="large"
                      className="w-full rounded-md"
                      min={1}
                      max={10}
                      onChange={(e) => {
                        setInputs({ ...inputs, closed_meeting_room: e });
                      }}
                      value={inputs?.closed_meeting_room}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Number of Demo Stations
                    </label>
                    <InputNumber
                      disabled={
                        props?.pageMode === "Delete" ||
                        props?.pageMode === "View"
                          ? true
                          : false
                      }
                      size="large"
                      placeholder="Demo Stations"
                      className="w-full rounded-md"
                      min={1}
                      max={10}
                      onChange={(e) => {
                        setInputs({ ...inputs, demo_stations: e });
                      }}
                      value={inputs?.demo_stations}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Open Discussion Areas
                    </label>
                    <InputNumber
                      disabled={
                        props?.pageMode === "Delete" ||
                        props?.pageMode === "View"
                          ? true
                          : false
                      }
                      size="large"
                      placeholder="Open Discussion Areas"
                      className="w-full rounded-md"
                      min={1}
                      max={10}
                      onChange={(e) => {
                        setInputs({ ...inputs, open_discussion_area: e });
                      }}
                      value={inputs?.open_discussion_area}
                    />
                  </div>
                </div>

                <div className="my-5">
                  <label className="block text-sm font-medium text-gray-700">
                    Filter by Functional Requirements
                  </label>
                  <br />
                  <Checkbox.Group
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    options={options}
                    onChange={onChange}
                    value={checkboxValues}
                  />
                  <br />
                </div>
                <div className="my-5">
                  <label className="block text-sm font-medium text-gray-700">
                    Website Placement info
                  </label>
                  <br />
                  <Checkbox.Group
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    options={websiteInfoOptions}
                    onChange={onChange_webInfo}
                    value={checkboxWebsiteValues}
                  />
                  <br />
                </div>
                <div className="my-5">
                  <label className="block text-sm font-medium text-gray-700">
                    Key highlights
                  </label>
                  <TextArea
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    type="text"
                    id="key_highlights"
                    name="key_highlights"
                    className="mt-1 p-2 block  w-full border rounded-md"
                    style={{ minHeight: "15rem" }}
                    onChange={(e) => {
                      setInputs({ ...inputs, [e.target.name]: e.target.value });
                    }}
                    value={inputs?.key_highlights}
                  />
                </div>
                <div className="my-5">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <TextArea
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    required
                    type="text"
                    id="description"
                    name="description"
                    className="mt-1 p-2 block w-full border rounded-md"
                    style={{ minHeight: "15rem" }}
                    onChange={(e) => {
                      setInputs({ ...inputs, [e.target.name]: e.target.value });
                    }}
                    value={inputs?.description}
                  />
                </div>
                {/* Upload Pictures */}
                {props.pageMode === "Add" || props.pageMode === "Update" ? (
                  <div className="my-5">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Upload Pictures
                    </label>
                    <Upload
                      action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                      // action="/upload.do"
                      listType="picture-card"
                      multiple={false}
                      name="productImages"
                      fileList={imageArray}
                      maxCount={4}
                      onChange={(e) => {
                        setImageArray(e.fileList);
                      }}
                    >
                      <div>
                        <PlusOutlined />
                        <div
                          style={{
                            marginTop: 8,
                          }}
                        >
                          Upload
                        </div>
                      </div>
                    </Upload>
                  </div>
                ) : (
                  ""
                )}
                {/* Pictures */}
                {props?.pageMode !== "Add" ? (
                  <div className="my-5">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Pictures
                    </label>
                    <div className="w-full flex flex-row">
                      {imageClone?.map((el, index) => (
                        <div className="card" key={index}>
                          <div className="flex h-60 justify-center">
                            <img
                              src={el?.url}
                              alt="asd4e"
                              className="object-contain"
                            />
                          </div>
                          {props.pageMode !== "View" &&
                          props.pageMode !== "Delete" ? (
                            <div className="flex flex-row justify-center items-end">
                              <button
                                className="my-4 text-black p-4 font-semibold bg-orange-400 hover:text-white rounded-lg"
                                onClick={() => deleteModal(index)}
                                type="button"
                              >
                                Delete Picture
                              </button>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {props.pageMode === "View" ? (
                  ""
                ) : (
                  <div className="acitonButtons w-full flex justify-center">
                    <button
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out items-center justify-center"
                      type="submit"
                    >
                      {props.pageMode} Data
                    </button>
                  </div>
                )}
              </Form>
            </Spin>
          </div>
        </PageWrapper>
      ) : (
        <PageWrapper title={`${props?.pageMode} Awards`}>
          <div className="container mx-auto p-4 text-xl">
            <Form onFinish={submitForm}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Award Title
                  </label>
                  <Input
                    name="award_title"
                    required
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                    }
                    onChange={(e) => {
                      setInputs({ ...inputs, [e.target.name]: e.target.value });
                    }}
                    value={inputs?.award_title}
                  />
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Award Year (For eg: 2021)
                  </label>
                  <Select
                    isDisabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                    }
                    placeholder="Year"
                    required
                    isMulti={false}
                    onChange={(e) => {
                      setInputs({ ...inputs, award_year: Number(e.value) });
                    }}
                    onCreateOption={(inputValue) => {
                      const intValue = parseInt(inputValue, 10);
                      if (!isNaN(intValue) && intValue <= currentYear) {
                        setInputs({ ...inputs, award_year: intValue });
                      } else {
                        // Optionally, you can show a message to the user that only integers up to the current year are allowed.
                        alert(`Please enter a valid year up to ${currentYear}`);
                      }
                    }}
                    isClearable
                    options={yearOptions}
                    isSearchable
                    formatCreateLabel={(inputValue) => `Add ${inputValue}`}
                    value={
                      inputs?.award_year
                        ? { label: inputs.award_year, value: inputs.award_year }
                        : null
                    }
                  />
                </div>
              </div>
              <div className="my-5">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <TextArea
                  disabled={
                    props?.pageMode === "Delete" || props?.pageMode === "View"
                      ? true
                      : false
                  }
                  type="text"
                  id="award_desc"
                  name="award_desc"
                  className="mt-1 p-2 block w-full border rounded-md"
                  onChange={(e) => {
                    setInputs({ ...inputs, [e.target.name]: e.target.value });
                  }}
                  value={inputs?.award_desc}
                />
              </div>
              {/* Upload Pictures */}
              {props.pageMode === "Add" || props.pageMode === "Update" ? (
                <div className="my-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload Pictures
                  </label>
                  <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    // action="/upload.do"
                    listType="picture-card"
                    multiple={false}
                    name="productImages"
                    fileList={imageArray}
                    maxCount={4}
                    onChange={(e) => {
                      setImageArray(e.fileList);
                    }}
                  >
                    <div>
                      <PlusOutlined />
                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        Upload
                      </div>
                    </div>
                  </Upload>
                </div>
              ) : (
                ""
              )}
              {/* Pictures */}
              {props?.pageMode !== "Add" ? (
                <div className="my-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pictures
                  </label>
                  <div className="w-full flex flex-row">
                    {awardImages?.map((el, index) => (
                      <div className="card" key={index}>
                        <div className="flex h-60 justify-center">
                          <img
                            src={el?.url}
                            alt="asd4e"
                            className="object-contain"
                          />
                        </div>
                        {props.pageMode !== "View" &&
                        props.pageMode !== "Delete" ? (
                          <div className="flex flex-row justify-center items-end">
                            <button
                              className="my-4 text-black p-4 font-semibold bg-orange-400 hover:text-white rounded-lg"
                              onClick={() => deleteModal(index)}
                              type="button"
                            >
                              Delete Picture
                            </button>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                ""
              )}

              <div className="acitonButtons w-full flex justify-center">
                <button
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out items-center justify-center"
                  type="submit"
                >
                  {props.pageMode} Data
                </button>
              </div>
            </Form>
          </div>
        </PageWrapper>
      )}
    </>
  );
}

export default GlobalForm;

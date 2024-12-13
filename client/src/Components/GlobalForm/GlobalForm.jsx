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
  const [inputs, setInputs] = useState({});
  const [location, setLocation] = useState({});
  const [stationOptions, setStationOptions] = useState();
  const [imageClone, setImageClone] = useState(props?.record?.pictures);
  const [menuOptions, setMenuOptions] = useState([]);
  const [amenities, setAmenities] = useState();
  const [company_testimonialImage, setCompany_testimonialImage] = useState(
    props?.record?.pictures
  );
  const NavigateTo = useNavigate();
  useEffect(() => {
    callingOptions();
    if (props?.record) {
      setInputs(props.record);
    }
    if (props?.type == "Hero") {
      callHero();
    }
  }, []);
  // useEffect(() => {
  //   if (props?.type == "Hero") {
  //     callHero();
  //   }
  // }, [props?.type]);
  const callHero = async () => {
    const answer = await getAxiosCall("/fetchHero");
    setImageClone(answer?.data);
  };
  const callingOptions = async () => {
    if (props?.type != "Amenities") {
      const resLocation = await getAxiosCall("/stationOptions");
      if (resLocation) {
        const collection = resLocation.data?.map((el) => ({
          label: el,
          value: el,
        }));
        setStationOptions(collection);
      }
    } else {
      const resMenuOptions = await getAxiosCall("/fetchMenuItems");
      if (resMenuOptions) {
        const collection = resMenuOptions.data?.map((el) => ({
          label: el.menu_name,
          value: el.menu_id,
        }));
        setMenuOptions(collection);
      }
    }
  };
  const fetchAmenities = async (val) => {
    const resami = await getAxiosCall("/getAmenitiesByMenuId", {
      menu_id: val,
    });
    if (resami) {
      const collection = resami.data?.map((el) => ({
        label: el?.amenity_name,
        value: el?.amenity_name,
      }));
      setAmenities(collection);
    }
  };
  const beforeUpload = (file) => {
    const isValidType = ["image/png", "image/jpeg", "image/webp"].includes(
      file.type
    );

    if (!isValidType) {
      message.error("You can only upload PNG, JPG, JPEG, or WEBP files!");
      return;
    }

    return isValidType; // Return false to prevent the upload if the file type is not valid
  };
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
        if (props?.type == "Hero") {
          let dummyObj = { pictures: [...B64Array] };

          asd = Object.assign(inputs, { pictures: dummyObj?.pictures });
          setInputs({ ...inputs, pictures: asd });
        } else {
          let dummyObj = [...(inputs && inputs?.pictures)];

          dummyObj = [...dummyObj, ...B64Array];
          asd = Object.assign(inputs, { pictures: dummyObj });
          setInputs({ ...inputs, pictures: asd });
        }
      }
    }
  };
  // A submit form used for both (i.e.. Products & Awards)
  const submitForm = async () => {
    if (!props.type) {
      if (!inputs?.station_number || !inputs?.location) {
        Swal.fire({
          title: "error",
          text: "Station Name and Location are mandatory fields",
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
          if (imageArray.length == 0 && props?.type !== "Testimonials") {
            Swal.fire({
              title: "error",
              text: "Add at least one Picture to proceed!",
              icon: "error",
              confirmButtonText: "Alright!",
              allowOutsideClick: false,
            });
          } else {
            // Converting images to base64
            await convertAllToBase64();
          }
          if (props.type === "Testimonials") {
            let dummyinput = inputs;
            if (inputs?.pictures?.length === 0 || !inputs?.pictures) {
              dummyinput = { ...inputs, pictures: [] };
            }
            let answer;
            answer = await postAxiosCall("/createTestimonial", dummyinput);
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
          }

          if (props.type === "Property") {
            let dummyinput = inputs;
            if (inputs?.pictures?.length === 0 || !inputs?.pictures) {
              dummyinput = { ...inputs, pictures: [] };
            }
            let answer;

            answer = await postAxiosCall("/createProperty", dummyinput);
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
          }
          if (props.type === "Amenities") {
            let dummyinput = inputs;
            if (inputs?.pictures?.length === 0 || !inputs?.pictures) {
              dummyinput = { ...inputs, pictures: [] };
            }
            let answer;

            answer = await postAxiosCall("/createAmenity", dummyinput);
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
          } else {
            //merging the new images (if uploaded)
            await convertAllToBase64();
          }
          if (props.type === "Property") {
            const updatedResult = await updateAxiosCall(
              "/property",
              props?.record?.prop_id,
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
                NavigateTo("/updateproperty");
              });
            }
          }
          if (props.type === "Amenities") {
            const updatedResult = await updateAxiosCall(
              "/updateAmenity",
              props?.record?.amenity_id,
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
                NavigateTo("/updateAmenities");
              });
            }
          }
          if (props.type == "Hero") {
            let answer = await postAxiosCall("/updateHero", inputs);
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
    if (props?.type === "Property" && props?.type) {
      answer = await deleteAxiosCall("/property", props?.record?.prop_id);
    } else if (props?.type === "Amenities") {
      answer = await deleteAxiosCall(
        "/deleteAmenity",
        props?.record?.amenity_id
      );
    } else if (props?.type === "Testimonials") {
      answer = await deleteAxiosCall(
        "/deleteTestimonial",
        props?.record?.testimonial_id
      );
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
      NavigateTo(
        props?.type === "Testimonials"
          ? "/deleteTestimonials"
          : props?.type === "Property"
          ? "/deleteproperty"
          : "/deleteAmenities"
      );
    }
  };
  const deleteImage = async (imageIndex) => {
    let answer = await deleteAxiosCall(
      "/deleteHero",
      imageClone[imageIndex]?.public_id
    );

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
  };
  const deleteFnc = async (imageIndex) => {
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
        if (props?.type == "Hero") {
          deleteImage(index);
        } else {
          deleteFnc(index);
        }
      }
    });
  };

  return (
    <>
      {props?.type == "Property" ? (
        <PageWrapper title={`${props?.pageMode} Property`}>
          <div className="container mx-auto p-4 text-xl">
            <Spin spinning={loading}>
              <Form onFinish={submitForm}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location
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
                      id="location"
                      placeholder="Enter Name of the Location Example: Mariveles,Batan"
                      name="location"
                      className="mt-1 p-2 block w-full border rounded-md"
                      onChange={(e) => {
                        setInputs({
                          ...inputs,
                          [e.target.name]: e.target.value,
                        });
                      }}
                      value={inputs?.location}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Station Number
                    </label>
                    <Creatable
                      isDisabled={
                        props?.pageMode === "Delete" ||
                        props?.pageMode === "View"
                          ? true
                          : false
                      }
                      placeholder="Add Station Number"
                      required
                      isMulti={false}
                      onChange={(e) => {
                        if (e && /^[0-9]*$/.test(e.value)) {
                          setInputs({
                            ...inputs,
                            station_number: Number(e.value),
                          });
                        } else {
                          // Optional: Notify the user about invalid input
                          console.error("Only numeric values are allowed");
                        }
                      }}
                      isClearable
                      options={
                        stationOptions?.length !== 0 ? stationOptions : []
                      }
                      isSearchable
                      value={{
                        label: inputs?.station_number,
                        value: inputs?.station_number,
                      }}
                      formatCreateLabel={(inputValue) => {
                        // Prevent creating non-numeric options
                        return /^[0-9]*$/.test(inputValue)
                          ? inputValue
                          : "Invalid input";
                      }}
                    />
                  </div>
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
                      maxCount={1}
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
                    <div className="grid grid-cols-1 lg:grid lg:grid-cols-3 gap-y-4 gap-x-4">
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
      ) : props?.type === "Amenities" ? (
        <PageWrapper title={`${props?.pageMode} Amenities`}>
          <div className="container mx-auto p-4 text-xl">
            <Form onFinish={submitForm}>
              <div className="grid grid-cols-1 my-2 sm:grid-cols-2 md:grid-cols-2 gap-6">
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Menu
                  </label>
                  <Creatable
                    placeholder="Menu"
                    isDisabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    required
                    isMulti={false}
                    onChange={(e) => {
                      setInputs({ ...inputs, menu_name: e.label });
                      fetchAmenities(e.value);
                    }}
                    isClearable
                    options={menuOptions?.length != 0 ? menuOptions : []}
                    isSearchable
                    value={{
                      label: inputs?.menu_name,
                      value: inputs?.menu_id,
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 my-2 sm:grid-cols-2 md:grid-cols-2 gap-6">
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Name of the Amenity
                  </label>
                  <Creatable
                    isDisabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    required
                    isMulti={false}
                    onChange={(e) => {
                      setInputs({ ...inputs, amenity_name: e.value });
                    }}
                    isClearable
                    options={amenities?.length != 0 ? amenities : []}
                    isSearchable
                    value={{
                      label: inputs?.amenity_name,
                      value: inputs?.amenity_name,
                    }}
                  />
                </div>
              </div>
              <div className="my-5">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <TextArea
                  disabled={props?.pageMode === "Delete" ? true : false}
                  type="text"
                  id="amenity_desc"
                  name="amenity_desc"
                  className="mt-1 p-2 block w-full border rounded-md"
                  onChange={(e) => {
                    setInputs({ ...inputs, [e.target.name]: e.target.value });
                  }}
                  value={inputs?.amenity_desc}
                  required
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
          </div>
        </PageWrapper>
      ) : props?.type === "Hero" ? (
        <PageWrapper title={`${props?.pageMode} Pictures`}>
          <div className="container mx-auto p-4 text-xl">
            <Form onFinish={submitForm}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"></div>
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
                    maxCount={1}
                    beforeUpload={beforeUpload} // Add the beforeUpload function
                    accept=".png, .jpg, .jpeg, .webp" // Restrict file types for the file dialog
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
                  <div className="grid grid-cols-1 lg:grid lg:grid-cols-3 gap-y-4 gap-x-4">
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
          </div>
        </PageWrapper>
      ) : (
        <PageWrapper title={`${props?.pageMode} Testimonials`}>
          <div className="container mx-auto p-4 text-xl">
            <Form onFinish={submitForm}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Reviewer's Name
                  </label>
                  <Input
                    name="reviewer_name"
                    disabled={props?.pageMode === "Delete"}
                    onChange={(e) => {
                      setInputs({ ...inputs, [e.target.name]: e.target.value });
                    }}
                    required
                    value={inputs?.reviewer_name}
                  />
                </div>
              </div>
              <div className="my-5">
                <label className="block text-sm font-medium text-gray-700">
                  Review
                </label>
                <TextArea
                  disabled={props?.pageMode === "Delete" ? true : false}
                  type="text"
                  id="review"
                  name="review"
                  className="mt-1 p-2 block w-full border rounded-md"
                  onChange={(e) => {
                    setInputs({ ...inputs, [e.target.name]: e.target.value });
                  }}
                  value={inputs?.review}
                  required
                />
              </div>
              {/* Upload Pictures */}
              {props.pageMode === "Add" ? (
                <div className="my-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload Customer's Picture
                  </label>
                  <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    // action="/upload.do"
                    listType="picture-card"
                    multiple={false}
                    name="productImages"
                    fileList={imageArray}
                    maxCount={1}
                    beforeUpload={beforeUpload} // Add the beforeUpload function
                    accept=".png, .jpg, .jpeg, .webp" // Restrict file types for the file dialog
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
              {props.pageMode !== "Add" && inputs?.pictures?.length !== 0 ? (
                <div className="my-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pictures
                  </label>
                  <div className="w-full flex flex-row">
                    {company_testimonialImage?.map((el, index) => (
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

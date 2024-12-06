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
  const [locationOptions, setLocationOptions] = useState();
  const [pricingOptions, setPricingOptions] = useState();
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
  }, []);

  const callingOptions = async () => {
    if (props?.type != "Amenities") {
      const resLocation = await getAxiosCall("/locationOptions");
      if (resLocation) {
        const collection = resLocation.data?.map((el) => ({
          label: el,
          value: el,
        }));
        setLocationOptions(collection);
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
      debugger;
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
      if (!inputs?.prop_name || !inputs?.location || !inputs?.price) {
        Swal.fire({
          title: "error",
          text: "Property Name, Location and Price are mandatory fields",
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
    if (props?.type != "Testimonials" && props?.type) {
      answer = await deleteAxiosCall("/property", props?.record?.prop_id);
    } else {
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
      NavigateTo("/deleteproperty");
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
      {props?.type == "Property" ? (
        <PageWrapper title={`${props?.pageMode} Property`}>
          <div className="container mx-auto p-4 text-xl">
            <Spin spinning={loading}>
              <Form onFinish={submitForm}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Property
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
                      id="prop_name"
                      placeholder="Property Name"
                      name="prop_name"
                      className="mt-1 p-2 block w-full border rounded-md"
                      onChange={(e) => {
                        setInputs({
                          ...inputs,
                          [e.target.name]: e.target.value,
                        });
                      }}
                      value={inputs?.prop_name}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Location
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
                      Price/SQM
                    </label>
                    <InputNumber
                      disabled={
                        props?.pageMode === "Delete" ||
                        props?.pageMode === "View"
                          ? true
                          : false
                      }
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                      placeholder="Price"
                      className="w-full rounded-md"
                      size="large"
                      required
                      isMulti={false}
                      onChange={(e) => {
                        setInputs({ ...inputs, price: e });
                      }}
                      isClearable
                      options={
                        pricingOptions?.length != 0 ? pricingOptions : []
                      }
                      isSearchable
                      value={inputs?.price}
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

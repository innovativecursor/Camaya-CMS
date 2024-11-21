import React, { useEffect, useState } from "react";
import GlobalForm from "../GlobalForm/GlobalForm";
import { Table } from "antd";
import PageWrapper from "../PageContainer/PageWrapper";
import { getAxiosCall } from "../../Axios/UniversalAxiosCalls";
import { useNavigate } from "react-router-dom";

function ProductTable(props) {
  const columns = [
    {
      title: "Prop ID",
      dataIndex: "prop_id",
      key: "prop_id",
      fixed: "left",
    },
    {
      title: "Property Name",
      dataIndex: "prop_name",
      key: "prop_name",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
  ];
  const testimonials_col = [
    {
      title: "Testimonial Id",
      dataIndex: "testimonial_id",
      key: "testimonial_id",
      fixed: "left",
    },

    {
      title: "Reviewer Name",
      dataIndex: "reviewer_name",
      key: "reviewer_name",
    },
  ];
  const [result, setResult] = useState(null);
  const [switchRoutes, setSwitchRoutes] = useState(false);
  const navigateTo = useNavigate();
  useEffect(() => {
    if (!props.filteredProducts) {
      answer();
    } else {
      setResult(props?.filteredProducts);
    }
  }, [props]);

  const answer = async () => {
    if (props?.type == "Testimonials" && props?.type) {
      const result = await getAxiosCall("/fetchTestimonials");
      setResult(result?.data);
    } else {

      const result = await getAxiosCall("/properties");
      setResult(result?.data?.properties);
    }
  };
  return (
    <>
      {props?.type != "Testimonials" ? (
        <PageWrapper title={`${props.pageMode} Properties`}>
          <Table
            columns={columns}
            dataSource={result}
            size="large"
            // style={{
            //   width: "100rem",
            // }}
            onRow={(record, rowIndex) => {
              return {
                onClick: () => {
                  navigateTo(
                    props.pageMode === "View"
                      ? "/viewinner"
                      : props.pageMode === "Delete"
                      ? "/deleteinner"
                      : "/updateinner",
                    { state: record }
                  );
                },
              };
            }}
            scroll={{
              x: 1000,
              y: 1500,
            }}
          />
        </PageWrapper>
      ) : (
        <PageWrapper title={`${props.type}`}>
        <Table
          columns={testimonials_col}
          dataSource={result}
          size="large"
          onRow={(record) => ({
            onClick: () => {
              navigateTo("/deleteTestimonialsinner", { state: record });
            },
          })}
          scroll={{ x: 1000, y: 1500 }}
        />
      </PageWrapper>
      )}
    </>
  );
}

export default ProductTable;

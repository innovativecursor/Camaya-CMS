import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { postAxiosCall } from "../../Axios/UniversalAxiosCalls";
import { Button, Input } from "antd";
import Swal from "sweetalert2";
import logo from "../../assets/Images/propshop_black.svg";
import background from "../../assets/Images/background.jpg";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigateTo = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Passwords do not match",
        icon: "error",
        confirmButtonText: "Alright!",
        allowOutsideClick: false,
      });
      return;
    }
    if (!password || !confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Please fill in password and confirm Password",
        icon: "error",
        confirmButtonText: "Alright!",
        allowOutsideClick: false,
      });
      return;
    }
    try {
      const response = await postAxiosCall("/resetPassword", {
        resetToken: token,
        newPassword: password,
      });

      if (response) {
        Swal.fire({
          title: "Success",
          text: response?.message,
          icon: "success",
          confirmButtonText: "Alright!",
          allowOutsideClick: false,
        }).then(() => {
          navigateTo("/");
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error?.message,
        icon: "error",
        confirmButtonText: "Alright!",
        allowOutsideClick: false,
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "80%",
          maxWidth: "500px",
          padding: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "10px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          webkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img src={logo} alt="Logo" style={{ width: "150px" }} />
        </div>
        <div
          className="text-3xl mb-4 font-semibold"
          style={{ textAlign: "center", color: "#000" }}
        >
          Change Password
        </div>
        <div className="credentials card shadow-lg">
          <div className="uName my-4">
            <div className="password my-4">
              <div className="text-xl my-2 font-medium">New Password</div>
              <Input.Password
                placeholder="Password"
                type="password"
                size="large"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="password my-4">
              <div className="text-xl my-2 font-medium">Confirm Password</div>
              <Input.Password
                placeholder="Password"
                type="password"
                size="large"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-center items-center flex-row mt-6">
              <Button
                type="primary"
                className="flex text-white bg-black justify-around items-center flex-row"
                size="large"
                style={{
                  width: "45%",
                }}
                onClick={handleSubmit}
              >
                Change Password
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

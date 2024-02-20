// axiosInstance.js

import axios from "axios";

const axiosInstance = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Hàm để lưu accessToken và refreshToken vào localStorage
const saveTokensToLocalStorage = (accessToken, refreshToken) => {
  localStorage.setItem("token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
};

// Hàm để lấy accessToken từ localStorage
const getAccessTokenFromLocalStorage = () => {
  return localStorage.getItem("token");
};

// Interceptor để xử lý trước khi gửi yêu cầu
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const accessToken = getAccessTokenFromLocalStorage();

//     if (accessToken) {
//       // Thêm accessToken vào header Authorization để gửi cùng mỗi yêu cầu
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Interceptor để xử lý trước khi nhận phản hồi từ server
axiosInstance.interceptors.response.use(
  (response) => {
    // Trả về phản hồi nếu thành công
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    //console.log("12345678");
    if (error.response.status === 401 && !originalRequest._retry) {
      // Nếu nhận được lỗi 401 (Unauthorized) và chưa retry trước đó
      originalRequest._retry = true;
      //   console.log("12345678");
      const refreshToken = localStorage.getItem("refresh_token");
      console.log("refresh token: " + refreshToken);
      if (!refreshToken) {
        // Nếu không có refreshToken, chuyển hướng người dùng đến trang đăng nhập
        console.error("Refresh token is missing. Please login again.");
        return Promise.reject(error);
      }

      try {
        // Gửi yêu cầu để refresh accessToken bằng refreshToken
        const option = {
          method: "post",
          url: "/api/v1/auth/token",
          data: {
            refresh_token: refreshToken,
          },
        };
        const refreshResponse = await axiosInstance(option);
        // const refreshResponse = await axiosInstance.post('/token', {
        //     refreshToken: refreshToken,
        // });
        // console.log("***********************", refreshResponse);
        const newAccessToken = refreshResponse.data.newAccessToken;
        const newRefreshToken = refreshResponse.data.newRefreshToken;

        // Lưu lại accessToken và refreshToken mới vào localStorage
        saveTokensToLocalStorage(newAccessToken, newRefreshToken);

        // Thử gửi lại yêu cầu ban đầu với accessToken mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Xử lý lỗi khi refresh token không thành công
        console.error(
          "Unable to refresh token. Please login again.",
          refreshError
        );
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

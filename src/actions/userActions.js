import * as jwt from "jsonwebtoken";
import actionLoginTypes from "../constants/actionTypes";

export const logInUserAction = ({ email, password, callback }) => {
  return {
    type: actionLoginTypes.LOG_IN,
    email,
    password,
    callback,
  };
};

export const signUpUserAction = ({
  name,
  email,
  number,
  password,
  callback,
}) => {
  return {
    type: actionLoginTypes.SIGN_UP,
    name,
    email,
    number,
    password,
    callback,
  };
};

// clear store data and local storage and log user out
export const logOutUserAction = ({ callback }) => {
  return {
    type: actionLoginTypes.LOG_OUT,
    callback,
  };
};

export const forgotPasswordAction = ({ callback, email }) => {
  return {
    type: actionLoginTypes.FORGOT_PASSWORD,
    email,
    callback,
  };
};

export const verifyOTPAction = ({ callback, otp, email, password }) => {
  return {
    type: actionLoginTypes.VERIFY_OTP,
    email,
    otp,
    callback,
    password,
  };
};

export const resetPasswordAction = ({
  callback,
  email,
  accessToken,
  password,
}) => {
  return {
    type: actionLoginTypes.RESET_PASSWORD,
    email,
    accessToken,
    password,
    callback,
  };
};

export const verifyVehicleAction = ({ callback, accessToken, ...data }) => {
  return {
    type: actionLoginTypes.VERIFY_VEHICLE,
    accessToken,
    callback,
    ...data,
  };
};

export const getMechanicsAction = ({ callback, accessToken }) => {
  return {
    type: actionLoginTypes.GET_MECHANICS,
    accessToken,
    callback,
  };
};

export const getServicesAction = ({ callback, accessToken }) => {
  return {
    type: actionLoginTypes.GET_SERVICES,
    accessToken,
    callback,
  };
};

export const getVehiclesAction = ({ callback, accessToken, email }) => {
  return {
    type: actionLoginTypes.GET_VEHICLES,
    accessToken,
    callback,
    email,
  };
};

export const resendMailAction = ({ callback, accessToken }) => {
  return {
    type: actionLoginTypes.RESEND_MAIL,
    accessToken,
    callback,
  };
};

export const contactMechanicAction = ({ callback, accessToken, ...data }) => {
  return {
    type: actionLoginTypes.CONTACT_MECHANIC,
    accessToken,
    callback,
    ...data,
  };
};

export const changeEmailAction = ({ callback, accessToken, ...data }) => {
  return {
    type: actionLoginTypes.CHANGE_EMAIL,
    accessToken,
    callback,
    ...data,
  };
};

export const verifyTokenAction = ({ callback, accessToken, ...data }) => {
  return {
    type: actionLoginTypes.VERIFY_TOKEN,
    accessToken,
    callback,
    ...data,
  };
};

export const getProductsAction = ({ callback, accessToken }) => {
  return {
    type: actionLoginTypes.GET_PRODUCTS,
    accessToken,
    callback,
  };
};

export const buyProductAction = ({ callback, accessToken, ...data }) => {
  return {
    type: actionLoginTypes.BUY_PRODUCT,
    accessToken,
    callback,
    ...data,
  };
};

export const getOrdersAction = ({ callback, accessToken }) => {
  return {
    type: actionLoginTypes.GET_ORDERS,
    accessToken,
    callback,
  };
};

export const returnOrderAction = ({ callback, accessToken, ...data }) => {
  return {
    type: actionLoginTypes.RETURN_ORDER,
    accessToken,
    callback,
    ...data,
  };
};

export const uploadProfilePicAction = ({ callback, accessToken, ...data }) => {
  return {
    type: actionLoginTypes.UPLOAD_PROFILE_PIC,
    accessToken,
    callback,
    ...data,
  };
};

export const uploadVideoAction = ({ accessToken, callback, ...data }) => {
  return {
    type: actionLoginTypes.UPLOAD_VIDEO,
    accessToken,
    callback,
    ...data,
  };
};

export const refreshLocationAction = ({ accessToken, callback, ...data }) => {
  return {
    type: actionLoginTypes.REFRESH_LOCATION,
    accessToken,
    callback,
    ...data,
  };
};

export const changeVideoNameAction = ({ accessToken, callback, ...data }) => {
  return {
    type: actionLoginTypes.CHANGE_VIDEO_NAME,
    accessToken,
    callback,
    ...data,
  };
};

export const getPostsAction = ({ accessToken, callback }) => {
  return {
    type: actionLoginTypes.GET_POSTS,
    accessToken,
    callback,
  };
};

export const addPostAction = ({ accessToken, callback, ...data }) => {
  return {
    type: actionLoginTypes.ADD_POST,
    accessToken,
    callback,
    ...data,
  };
};

export const getPostByIdAction = ({ accessToken, callback, postId }) => {
  return {
    type: actionLoginTypes.GET_POST_BY_ID,
    accessToken,
    callback,
    postId,
  };
};

export const addCommentAction = ({
  accessToken,
  callback,
  postId,
  comment,
}) => {
  return {
    type: actionLoginTypes.ADD_COMMENT,
    accessToken,
    callback,
    postId,
    comment,
  };
};

export const applyCouponAction = ({ accessToken, callback, ...data }) => {
  return {
    type: actionLoginTypes.APPLY_COUPON,
    accessToken,
    callback,
    ...data,
  };
};

export const convertVideoAction = ({ accessToken, callback }) => {
  return {
    type: actionLoginTypes.CONVERT_VIDEO,
    accessToken,
    callback,
  };
};

export const isAccessTokenValid = (token) => {
  const decoded = jwt.decode(token);
  const currentTime = Math.floor(new Date().getTime() / 1000);
  if (decoded && currentTime < decoded.exp) return true;
  return false;
};

export const formatDateFromIso = (isoDate) => {
  const date = new Date(isoDate);
  return date.toDateString();
};

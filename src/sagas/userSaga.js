import { put, takeLatest } from "redux-saga/effects";
import { APIService, requestURLS } from "../constants/APIConstant";
import actionLoginTypes from "../constants/actionTypes";

/**
 * request for login
 * @param {email, password, callback} param
 * email: user email,
 * password: user password,
 * callback : callback method
 */
export function* logIn(param) {
  const { email, password, callback } = param;
  let recievedResponse = {};
  try {
    const postUrl = APIService.USER_MICRO_SERVICES + requestURLS.LOGIN;
    let headers = {
      "Content-Type": "application/json",
    };
    const responseJSON = yield fetch(postUrl, {
      headers,
      method: "POST",
      body: JSON.stringify({ email, password }),
    }).then((response) => {
      recievedResponse = response;
      if (recievedResponse.ok) return response.json();
      return response;
    });

    if (!recievedResponse.ok) {
      throw responseJSON;
    }

    const getUrl = APIService.USER_MICRO_SERVICES + requestURLS.GET_USER;
    headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${responseJSON.token}`,
    };
    const userResponseJSON = yield fetch(getUrl, {
      headers,
      method: "GET",
    }).then((response) => {
      recievedResponse = response;
      return response.json();
    });
    if (!recievedResponse.ok) {
      throw responseJSON;
    }
    yield put({
      type: actionLoginTypes.LOGGED_IN,
      payload: { token: responseJSON.token, user: userResponseJSON },
    });

    callback("success", responseJSON.data);
  } catch (e) {
    callback("error", "Invalid Username or Password");
  }
}

/**
 * request for new signup
 * @param {email, password, callback} param
 * name: user name,
 * email: user email,
 * number: user number,
 * password: user password,
 * callback : callback method
 */
export function* signUp(param) {
  const { name, email, number, password, callback } = param;
  let recievedResponse = {};
  try {
    const getUrl = APIService.USER_MICRO_SERVICES + requestURLS.SIGNUP;
    const headers = {
      "Content-Type": "application/json",
    };
    const responseJSON = yield fetch(getUrl, {
      headers,
      method: "POST",
      body: JSON.stringify({ name, email, number, password }),
    }).then((response) => {
      recievedResponse = response;
      if (recievedResponse.ok) return response;
      return response.json();
    });
    if (recievedResponse.ok) {
      callback("success", "User Registered Successfully!");
    } else {
      callback("error", responseJSON.message);
    }
  } catch (e) {
    callback("error", "Could not sign up");
  }
}

/**
 * send OTP for forgot password
 * @param {data, callback} param
 * email: user email,
 * callback : callback method
 */
export function* forgotPassword(param) {
  const { callback, email } = param;

  try {
    let recievedResponse = {};
    const getUrl = `${
      APIService.USER_MICRO_SERVICES + requestURLS.FORGOT_PASSWORD
    }?email=${email}`;
    const headers = {
      "Content-Type": "application/json",
    };
    const responseJSON = yield fetch(getUrl, {
      headers,
      method: "GET",
      // body: JSON.stringify({email}),
    }).then((response) => {
      recievedResponse = response;
      if (recievedResponse.ok) return response;
      return response.json();
    });
    if (recievedResponse.ok) {
      callback("success");
    } else {
      callback("error", responseJSON.message);
    }
  } catch (e) {
    callback("error", "Could not send OTP");
  }
}

/**
 * verify OTP for forgot password
 * @param {data, callback} param
 * email: user email,
 * otp: otp recieved through mail,
 * password: new password
 * callback : callback method
 */
export function* verifyOTP(param) {
  const { callback, email, otp, password } = param;
  try {
    let recievedResponse = {};
    const getUrl = APIService.USER_MICRO_SERVICES + requestURLS.VERIFY_OTP;
    const headers = {
      "Content-Type": "application/json",
    };
    const responseJSON = yield fetch(getUrl, {
      headers,
      method: "POST",
      body: JSON.stringify({ email, otp, password }),
    }).then((response) => {
      recievedResponse = response;
      if (recievedResponse.ok) return response;
      return response.json();
    });
    if (recievedResponse.ok) {
      callback("success");
    } else {
      if (recievedResponse.status === 503)
        callback("redirect", responseJSON.message);
      else  
        callback("error", responseJSON.message);
    }
  } catch (e) {
    callback("error", "Could not verify OTP");
  }
}

/**
 * change user password
 * @param {password, accessToken callback} param
 * accessToken: access token of the user
 * password: new password
 * callback : callback method
 */
export function* resetPassword(param) {
  const { accessToken, password, callback } = param;
  try {
    let recievedResponse = {};

    const getUrl = APIService.USER_MICRO_SERVICES + requestURLS.RESET_PASSWORD;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    yield fetch(getUrl, {
      headers,
      method: "POST",
      body: JSON.stringify({ password }),
    }).then((response) => {
      recievedResponse = response;
      return response;
    });

    if (recievedResponse.ok) {
      callback("success");
    } else {
      callback("failure", "Could not reset your password");
    }
  } catch (e) {
    callback("failure", "Could not reset your password");
  }
}

/**
 * request for changing email
 * @param {new_email, old_email, accessToken callback} param
 * accessToken: access token of the user
 * new_email: new email id entered by the user
 * old_email: old email id of the user
 * callback : callback method
 */
export function* changeEmail(param) {
  const { accessToken, callback, old_email, new_email } = param;
  try {
    let recievedResponse = {};

    const getUrl = APIService.USER_MICRO_SERVICES + requestURLS.CHANGE_EMAIL;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const responseJSON = yield fetch(getUrl, {
      headers,
      method: "POST",
      body: JSON.stringify({ old_email, new_email }),
    }).then((response) => {
      recievedResponse = response;
      return response.json();
    });

    if (recievedResponse.ok) {
      callback("success", responseJSON);
    } else {
      callback("failure", responseJSON.message);
    }
  } catch (e) {
    callback("failure", "Could not send token to email address");
  }
}

/**
 * verify token and change email
 * @param {new_email, token, accessToken callback} param
 * accessToken: access token of the user
 * new_email: new email id entered by the user
 * token: token sent to new_email id
 * callback : callback method
 */
export function* verifyToken(param) {
  const { accessToken, callback, new_email, token } = param;
  try {
    let recievedResponse = {};

    const getUrl = APIService.USER_MICRO_SERVICES + requestURLS.VERIFY_TOKEN;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const responseJSON = yield fetch(getUrl, {
      headers,
      method: "POST",
      body: JSON.stringify({ new_email, token }),
    }).then((response) => {
      recievedResponse = response;
      return response.json();
    });

    if (recievedResponse.ok) {
      callback("success", responseJSON.message);
    } else {
      callback("failure", responseJSON.message);
    }
  } catch (e) {
    callback("failure", "Could not change email id");
  }
}

/**
 * verify vehicle details entered by user and add this vehicle to this uder
 * @param { pincode, vehicleNumber, accessToken, callback} param
 * pincode: pincode of the vehicle entered
 * vehicleNumber: vehicle number entered by the user
 * accessToken: access token of the user
 * callback : callback method
 */
export function* verifyVehicle(param) {
  const { accessToken, callback, pinCode, vin } = param;
  try {
    let recievedResponse = {};
    const getUrl = APIService.USER_MICRO_SERVICES + requestURLS.ADD_VEHICLE;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const ResponseJson = yield fetch(getUrl, {
      headers,
      method: "POST",
      body: JSON.stringify({ vin, pincode: pinCode }),
    }).then((response) => {
      recievedResponse = response;
      return response.json();
    });

    if (recievedResponse.ok) {
      callback("success", ResponseJson.message);
    } else {
      callback("failure", ResponseJson.message);
    }
  } catch (e) {
    callback("failure", "Internal Server error! Wrong VIN!");
  }
}

/**
 * get the list of mechanics
 * @param { accessToken, callback} param
 * accessToken: access token of the user
 * callback : callback method
 */
export function* getMechanics(param) {
  const { accessToken, callback } = param;
  try {
    let recievedResponse = {};
    const getUrl =
      APIService.MERCHANT_MICRO_SERVICES + requestURLS.GET_MECHANICS;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const ResponseJson = yield fetch(getUrl, {
      headers,
      method: "GET",
    }).then((response) => {
      recievedResponse = response;
      return response.json();
    });

    if (recievedResponse.ok) {
      callback("success", ResponseJson.mechanics);
    } else {
      callback("failure", ResponseJson.message);
    }
  } catch (e) {
    callback("failure", "Could not get mechanic details");
  }
}

/**
 * get the list of products
 * @param { accessToken, callback} param
 * accessToken: access token of the user
 * callback : callback method
 */
export function* getProducts(param) {
  const { accessToken, callback } = param;
  try {
    let recievedResponse = {};
    const getUrl =
      APIService.MERCHANT_MICRO_SERVICES + requestURLS.GET_PRODUCTS;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const ResponseJson = yield fetch(getUrl, {
      headers,
      method: "GET",
    }).then((response) => {
      recievedResponse = response;
      return response.json();
    });

    if (recievedResponse.ok) {
      yield put({
        type: actionLoginTypes.BALANCE_CHANGED,
        payload: { availableCredit: ResponseJson.credit },
      });
      callback("success", ResponseJson);
    } else {
      callback("failure", ResponseJson.message);
    }
  } catch (e) {
    callback("failure", "Could not get product details");
  }
}

/**
 * buy a product
 * @param { accessToken, callback, product_id} param
 * accessToken: access token of the user
 * callback : callback method
 * product_id: id of the product which is to be bought
 */
export function* buyProduct(param) {
  const { accessToken, callback, productId } = param;
  try {
    let recievedResponse = {};
    const getUrl = APIService.MERCHANT_MICRO_SERVICES + requestURLS.BUY_PRODUCT;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const ResponseJson = yield fetch(getUrl, {
      headers,
      method: "POST",
      body: JSON.stringify({ product_id: productId, quantity: 1 }),
    }).then((response) => {
      recievedResponse = response;
      return response.json();
    });

    if (recievedResponse.ok) {
      yield put({
        type: actionLoginTypes.BALANCE_CHANGED,
        payload: { availableCredit: ResponseJson.credit },
      });
      callback("success", ResponseJson.message);
    } else {
      callback("failure", ResponseJson.message);
    }
  } catch (e) {
    callback("failure", "Try again after sometime...");
  }
}

/**
 * get the list of orders ordered by this user
 * @param { accessToken, callback} param
 * accessToken: access token of the user
 * callback : callback method
 */
export function* getOrders(param) {
  const { accessToken, callback } = param;
  try {
    let recievedResponse = {};
    const getUrl = APIService.MERCHANT_MICRO_SERVICES + requestURLS.GET_ORDERS;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const ResponseJson = yield fetch(getUrl, {
      headers,
      method: "GET",
    }).then((response) => {
      recievedResponse = response;
      return response.json();
    });

    if (recievedResponse.ok) {
      callback("success", ResponseJson);
    } else {
      callback("failure", ResponseJson.message);
    }
  } catch (e) {
    callback("failure", "Could not get orders");
  }
}

/**
 * return an order
 * @param { accessToken, callback, orderId } param
 * accessToken: access token of the user
 * callback : callback method
 * orderId: id of the order to be returned
 */
export function* returnOrder(param) {
  const { accessToken, callback, orderId } = param;
  try {
    let recievedResponse = {};
    const getUrl =
      APIService.MERCHANT_MICRO_SERVICES + requestURLS.RETURN_ORDER;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const ResponseJson = yield fetch(`${getUrl}?order_id=${orderId}`, {
      headers,
      method: "POST",
    }).then((response) => {
      recievedResponse = response;
      return response.json();
    });

    if (recievedResponse.ok) {
      callback("success", ResponseJson);
    } else {
      callback("failure", ResponseJson.message);
    }
  } catch (e) {
    callback("failure", "Could not get orders");
  }
}

/**
 * get the list of services alloted to this mechanic
 * @param { accessToken, callback} param
 * accessToken: access token of the user
 * callback : callback method
 */
export function* getServices(param) {
  const { accessToken, callback } = param;
  try {
    let recievedResponse = {};
    const getUrl =
      APIService.MERCHANT_MICRO_SERVICES + requestURLS.GET_SERVICES;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const ResponseJson = yield fetch(getUrl, {
      headers,
      method: "GET",
    }).then((response) => {
      recievedResponse = response;
      return response.json();
    });

    if (recievedResponse.ok) {
      callback("success", ResponseJson.service_requests);
    } else {
      callback("failure", ResponseJson.message);
    }
  } catch (e) {
    callback("failure", "Could not get mechanic details");
  }
}

/**
 * get the list of vehicles of the current user
 * @param { accessToken, callback} param
 * accessToken: access token of the user
 * callback : callback method
 */
export function* getVehicles(param) {
  const { accessToken, callback } = param;
  try {
    let recievedResponse = {};
    let getUrl = APIService.USER_MICRO_SERVICES + requestURLS.GET_USER;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const userResponseJSON = yield fetch(getUrl, {
      headers,
      method: "GET",
    }).then((response) => {
      recievedResponse = response;
      return response.json();
    });
    if (!recievedResponse.ok) {
      throw userResponseJSON;
    }
    yield put({
      type: actionLoginTypes.FETCHED_USER,
      payload: userResponseJSON,
    });
    getUrl = APIService.USER_MICRO_SERVICES + requestURLS.GET_VEHICLES;
    const ResponseJson = yield fetch(getUrl, {
      headers,
      method: "GET",
    }).then((response) => {
      recievedResponse = response;
      return response.json();
    });

    if (recievedResponse.ok) {
      callback("success", ResponseJson);
    } else {
      callback("failure", ResponseJson.error);
    }
  } catch (e) {
    callback("failure", "Could not get vehicles");
  }
}

/**
 * contact Mechanic API
 * @param { accessToken, callback, VIN, mechanic, problem_details } param
 * accessToken: access token of the user
 * callback : callback method
 * VIN: vehicle identification number
 * mechanic: mechanic_code to whom service is to be given
 * problem_details: Problem about the car
 */
export function* contactMechanic(param) {
  const { accessToken, callback, mechanicCode, problemDetails, vin } = param;
  try {
    let recievedResponse = {};
    const getUrl =
      APIService.MERCHANT_MICRO_SERVICES + requestURLS.CONTACT_MECHANIC;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const ResponseJson = yield fetch(getUrl, {
      headers,
      method: "POST",
      body: JSON.stringify({
        mechanic_code: mechanicCode,
        problem_details: problemDetails,
        vin,
        mechanic_api:
          APIService.MERCHANT_MICRO_SERVICES + requestURLS.RECEIVE_REPORT,
        repeat_request_if_failed: false,
        number_of_repeats: 1,
      }),
    }).then((response) => {
      recievedResponse = response;
      return response.json();
    });

    if (recievedResponse.ok) {
      callback("success", ResponseJson.response_from_mechanic_api);
    } else {
      callback("failure", ResponseJson.message);
    }
  } catch (e) {
    callback("failure", "Could not contact mechanic");
  }
}

/**
 * Upload profile pic
 * @param { accessToken, callback, file } param
 * accessToken: access token of the user
 * callback : callback method
 * file: image file
 */
export function* uploadProfilePic(param) {
  const { accessToken, callback, file } = param;
  try {
    let recievedResponse = {};
    const getUrl =
      APIService.USER_MICRO_SERVICES + requestURLS.UPLOAD_PROFILE_PIC;
    const headers = {
      // "Content-Type": "multipart/form-data;",
      Authorization: `Bearer ${accessToken}`,
    };
    const formData = new FormData();
    formData.append("file", file);
    const ResponseJson = yield fetch(getUrl, {
      headers,
      method: "POST",
      body: formData,
    }).then((response) => {
      recievedResponse = response;
      return response.json();
    });
    if (recievedResponse.ok) {
      yield put({
        type: actionLoginTypes.PROFILE_PIC_CHANGED,
        payload: { profilePicUrl: ResponseJson.picture },
      });
      callback("success", ResponseJson.message);
    } else {
      callback("failure", ResponseJson.message);
    }
  } catch (e) {
    callback("failure", "Could not upload Picture");
  }
}

/**
 * Upload car video
 * @param { accessToken, callback, file } param
 * accessToken: access token of the user
 * callback : callback method
 * file: video file
 */
export function* uploadVideo(param) {
  const { accessToken, callback, file } = param;
  try {
    let recievedResponse = {};
    const getUrl = APIService.USER_MICRO_SERVICES + requestURLS.UPLOAD_VIDEO;
    const headers = {
      // "Content-Type": "multipart/form-data;",
      Authorization: `Bearer ${accessToken}`,
    };
    const formData = new FormData();
    formData.append("file", file);
    const ResponseJson = yield fetch(getUrl, {
      headers,
      method: "POST",
      body: formData,
    }).then((response) => {
      recievedResponse = response;
      return response.json();
    });

    if (recievedResponse.ok) {
      yield put({
        type: actionLoginTypes.VIDEO_CHANGED,
        payload: { videoUrl: ResponseJson.profileVideo },
      });
      callback("success", ResponseJson.message);
    } else {
      callback("failure", ResponseJson.message);
    }
  } catch (e) {
    callback("failure", "Could not change video");
  }
}

/**
 * change Video Name
 * @param { accessToken, callback, videoName } param
 * accessToken: access token of the user
 * callback : callback method
 * videoName : new video name
 */
export function* changeVideoName(param) {
  const { accessToken, callback, videoName } = param;
  try {
    let recievedResponse = {};
    const getUrl =
      APIService.USER_MICRO_SERVICES + requestURLS.CHANGE_VIDEO_NAME;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const ResponseJson = yield fetch(getUrl, {
      headers,
      method: "PUT",
      body: JSON.stringify({ videoName }),
    }).then((response) => {
      recievedResponse = response;
      return response.json();
    });

    if (recievedResponse.ok) {
      yield put({
        type: actionLoginTypes.VIDEO_NAME_CHANGED,
        payload: { videoName: ResponseJson.video_name },
      });
      callback("success", ResponseJson);
    } else {
      callback("failure", ResponseJson.message);
    }
  } catch (e) {
    callback("failure", "Could not change video");
  }
}

/**
 * resend vehicle details
 * @param { accessToken, callback } param
 * accessToken: access token of the user
 * callback : callback method
 */
export function* resendMail(param) {
  const { accessToken, callback } = param;
  try {
    let recievedResponse = {};
    const getUrl = APIService.USER_MICRO_SERVICES + requestURLS.RESEND_MAIL;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const ResponseJson = yield fetch(getUrl, {
      headers,
      method: "GET",
    }).then((response) => {
      recievedResponse = response;
      return response.json();
    });

    if (recievedResponse.ok) {
      callback("success", ResponseJson.message);
    } else {
      callback("failure", ResponseJson.message);
    }
  } catch (e) {
    callback("failure", "Internal Error");
  }
}

/**
 * change location of the vehicle
 * @param { accessToken, callback, vehicle_id } param
 * accessToken: access token of the user
 * callback : callback method
 * vehicle_id: vehicle_id of the vehicle whose location is to be changed
 */
export function* refreshLocation(param) {
  const { accessToken, callback, carId } = param;
  try {
    let recievedResponse = {};
    const getUrl =
      APIService.USER_MICRO_SERVICES + requestURLS.REFRESH_LOCATION;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const ResponseJson = yield fetch(getUrl.replace("<carId>", carId), {
      headers,
      method: "GET",
    }).then((response) => {
      recievedResponse = response;
      return response.json();
    });

    if (recievedResponse.ok) {
      callback("success", ResponseJson.vehicleLocation);
    } else {
      callback("failure", ResponseJson.message);
    }
  } catch (e) {
    callback("failure", "Could not refresh location");
  }
}

/**
 * get the list of posts
 * @param { accessToken, callback} param
 * accessToken: access token of the user
 * callback : callback method
 */
export function* getPosts(param) {
  const { accessToken, callback } = param;
  try {
    let recievedResponse = {};
    const getUrl = APIService.FORUM_MICRO_SERVICES + requestURLS.GET_POSTS;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const ResponseJson = yield fetch(getUrl, {
      headers,
      method: "GET",
    }).then((response) => {
      recievedResponse = response;
      return response.json();
    });

    if (recievedResponse.ok) {
      callback("success", ResponseJson);
    } else {
      callback("failure", ResponseJson.message);
    }
  } catch (e) {
    callback("failure", "Could not get posts");
  }
}

/**
 * get the posts
 * @param { accessToken, callback, postId } param
 * accessToken: access token of the user
 * callback : callback method
 */
export function* getPostById(param) {
  const { accessToken, callback, postId } = param;
  try {
    let recievedResponse = {};
    const getUrl = APIService.FORUM_MICRO_SERVICES + requestURLS.GET_POST_BY_ID;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const ResponseJson = yield fetch(getUrl.replace("<postId>", postId), {
      headers,
      method: "GET",
    }).then((response) => {
      recievedResponse = response;
      return response.json();
    });

    if (recievedResponse.ok) {
      callback("success", ResponseJson);
    } else {
      callback("failure", ResponseJson.message);
    }
  } catch (e) {
    callback("failure", "Could not get post");
  }
}

/**
 * add new post
 * @param { accessToken, callback, post } param
 * accessToken: access token of the user
 * callback : callback method
 * post: post object to be added
 */
export function* addPost(param) {
  const { accessToken, callback, post } = param;
  try {
    let recievedResponse = {};
    const getUrl = APIService.FORUM_MICRO_SERVICES + requestURLS.ADD_NEW_POST;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    yield fetch(getUrl, {
      headers,
      method: "POST",
      body: JSON.stringify(post),
    }).then((response) => {
      recievedResponse = response;
      return response.json();
    });

    if (recievedResponse.ok) {
      callback("success");
    } else {
      callback("failure", "Could not add new post");
    }
  } catch (e) {
    callback("failure", "Could not add new post");
  }
}

/**
 * add new comment for the post
 * @param { accessToken, callback, postId, comment } param
 * accessToken: access token of the user
 * callback : callback method
 * post: post object to be added
 */
export function* addComment(param) {
  const { accessToken, callback, postId, comment } = param;
  try {
    let recievedResponse = {};
    const getUrl = APIService.FORUM_MICRO_SERVICES + requestURLS.ADD_COMMENT;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const JsonResponse = yield fetch(getUrl.replace("<postId>", postId), {
      headers,
      method: "POST",
      body: JSON.stringify({ content: comment }),
    }).then((response) => {
      recievedResponse = response;
      return response.json();
    });

    if (recievedResponse.ok) {
      callback("success", JsonResponse);
    } else {
      callback("failure", "Could not add comment");
    }
  } catch (e) {
    callback("failure", "Could not add comment");
  }
}

/**
 * validate the coupon and increase user credit
 * @param { accessToken, callback, couponCode} param
 * accessToken: access token of the user
 * callback : callback method
 * couponCode: coupon code of the coupon
 */
export function* applyCoupon(param) {
  const { accessToken, callback, couponCode } = param;
  try {
    let recievedResponse = {};
    let getUrl = APIService.FORUM_MICRO_SERVICES + requestURLS.VALIDATE_COUPON;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const CouponJson = yield fetch(`${getUrl}?coupon_code=${couponCode}`, {
      headers,
      method: "GET",
    }).then((response) => {
      recievedResponse = response;
      if (recievedResponse.ok) return response.json();
      return response;
    });

    if (!recievedResponse.ok) {
      callback("failure", "Invalid Coupon Code");
    } else {
      getUrl = APIService.MERCHANT_MICRO_SERVICES + requestURLS.APPLY_COUPON;
      const ResponseJson = yield fetch(getUrl, {
        headers,
        method: "POST",
        body: JSON.stringify(CouponJson),
      }).then((response) => {
        recievedResponse = response;
        return response.json();
      });
      if (recievedResponse.ok) {
        yield put({
          type: actionLoginTypes.BALANCE_CHANGED,
          payload: { availableCredit: ResponseJson.credit },
        });
        callback("success", ResponseJson.message);
      } else {
        callback("failure", ResponseJson.message);
      }
    }
  } catch (e) {
    callback("failure", "Could not validate coupon");
  }
}

/**
 * convert video
 * @param { accessToken, callback } param
 * accessToken: access token of the user
 * callback : callback method
 */
export function* convertVideo(param) {
  const { accessToken, callback } = param;
  try {
    let recievedResponse = {};
    const getUrl = APIService.USER_MICRO_SERVICES + requestURLS.CONVERT_VIDEO;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const ResponseJson = yield fetch(`${getUrl}?video_id=${159}`, {
      headers,
      method: "GET",
    }).then((response) => {
      recievedResponse = response;
      return response.json();
    });

    if (recievedResponse.ok) {
      callback("success", ResponseJson.message);
    } else {
      callback("failure", "Could not convert video");
    }
  } catch (e) {
    callback("failure", "Could not convert video");
  }
}

export function* userActionWatcher() {
  yield takeLatest(actionLoginTypes.LOG_IN, logIn);
  yield takeLatest(actionLoginTypes.SIGN_UP, signUp);
  yield takeLatest(actionLoginTypes.VERIFY_OTP, verifyOTP);
  yield takeLatest(actionLoginTypes.FORGOT_PASSWORD, forgotPassword);
  yield takeLatest(actionLoginTypes.RESET_PASSWORD, resetPassword);
  yield takeLatest(actionLoginTypes.CHANGE_EMAIL, changeEmail);
  yield takeLatest(actionLoginTypes.VERIFY_TOKEN, verifyToken);
  yield takeLatest(actionLoginTypes.VERIFY_VEHICLE, verifyVehicle);
  yield takeLatest(actionLoginTypes.RESEND_MAIL, resendMail);
  yield takeLatest(actionLoginTypes.GET_MECHANICS, getMechanics);
  yield takeLatest(actionLoginTypes.GET_SERVICES, getServices);
  yield takeLatest(actionLoginTypes.GET_VEHICLES, getVehicles);
  yield takeLatest(actionLoginTypes.GET_PRODUCTS, getProducts);
  yield takeLatest(actionLoginTypes.BUY_PRODUCT, buyProduct);
  yield takeLatest(actionLoginTypes.GET_ORDERS, getOrders);
  yield takeLatest(actionLoginTypes.RETURN_ORDER, returnOrder);
  yield takeLatest(actionLoginTypes.CONTACT_MECHANIC, contactMechanic);
  yield takeLatest(actionLoginTypes.UPLOAD_PROFILE_PIC, uploadProfilePic);
  yield takeLatest(actionLoginTypes.UPLOAD_VIDEO, uploadVideo);
  yield takeLatest(actionLoginTypes.CHANGE_VIDEO_NAME, changeVideoName);
  yield takeLatest(actionLoginTypes.REFRESH_LOCATION, refreshLocation);
  yield takeLatest(actionLoginTypes.GET_POSTS, getPosts);
  yield takeLatest(actionLoginTypes.GET_POST_BY_ID, getPostById);
  yield takeLatest(actionLoginTypes.ADD_POST, addPost);
  yield takeLatest(actionLoginTypes.ADD_COMMENT, addComment);
  yield takeLatest(actionLoginTypes.APPLY_COUPON, applyCoupon);
  yield takeLatest(actionLoginTypes.CONVERT_VIDEO, convertVideo);
}

import actionLoginTypes from "../constants/actionTypes";

const initialData = {
  isLoggedIn: false,
  accessToken: "",
  userData: {},
};

const userReducer = (state = initialData, action) => {
  switch (action.type) {
    case actionLoginTypes.LOGGED_IN:
      return {
        ...state,
        accessToken: action.payload.token,
        userData: action.payload.user,
        isLoggedIn: true,
        fetchingData: false,
      };
    case actionLoginTypes.FETCHED_USER:
      return {
        ...state,
        userData: action.payload,
      };
    case actionLoginTypes.LOG_OUT:
      return initialData;
    case actionLoginTypes.FETCHED_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload,
      };
    case actionLoginTypes.PROFILE_PIC_CHANGED:
      return {
        ...state,
        userData: {
          ...state.userData,
          picture_url: action.payload.profilePicUrl,
        },
      };
    case actionLoginTypes.VIDEO_CHANGED:
      return {
        ...state,
        userData: {
          ...state.userData,
          video_url: action.payload.videoUrl,
        },
      };
    case actionLoginTypes.VIDEO_NAME_CHANGED:
      return {
        ...state,
        userData: {
          ...state.userData,
          video_name: action.payload.videoName,
        },
      };
    case actionLoginTypes.BALANCE_CHANGED:
      return {
        ...state,
        userData: {
          ...state.userData,
          available_credit: action.payload.availableCredit,
        },
      };
    default:
      return state;
  }
};
export default userReducer;

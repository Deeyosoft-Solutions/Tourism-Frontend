import { configureStore } from "@reduxjs/toolkit";
import { authApiSlice } from "../Services/auth/authApiSlice";
import { userApi } from '../Services/userApiSlice';
import { resetPasswordApi } from "../Services/resetPasswordApi";
import { protectedApi } from "../Services/auth/admin-authApi";
import authReducer from "../Features/slice/authSlice";
import { siteSettingsApi } from '../Services/SiteSettingApi';
import { categoryApi } from "../Services/categoryApiSlice";
import { productApi } from "../Services/productApiSlice";
import { registerApiSlice } from "../Services/registerApiSlice";
import { cartApi } from "../Services/cartSlice";
import { feedbackApi } from './../Services/feedbackApiSlice';
import { destinationApi } from "../Services/destinationApiSlice";
import { travelPackageApi } from "../Services/travelPackageApiSlice";
import { departuresApi } from "../Services/departuresApiSlice";
import { accommodationCategoryApi } from "../Services/accomodationCategoryApiSlice";
import { accommodationApi } from "../Services/accomodationApiSlice";
import { accommodationBookingApi } from "../Services/accommodationBooking";
import { travelBookingsApi } from "../Services/travelBookings";

export const store = configureStore({
  reducer: {
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [resetPasswordApi.reducerPath]: resetPasswordApi.reducer,
    [protectedApi.reducerPath]: protectedApi.reducer,
    [siteSettingsApi.reducerPath]: siteSettingsApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [registerApiSlice.reducerPath]: registerApiSlice.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [feedbackApi.reducerPath]:feedbackApi.reducer,
    [destinationApi.reducerPath]: destinationApi.reducer,
    [accommodationCategoryApi.reducerPath]: accommodationCategoryApi.reducer,
    [accommodationApi.reducerPath]: accommodationApi.reducer,
    [travelPackageApi.reducerPath]: travelPackageApi.reducer,
    [departuresApi.reducerPath]: departuresApi.reducer,
    [accommodationBookingApi.reducerPath]: accommodationBookingApi.reducer,
    [travelBookingsApi.reducerPath]: travelBookingsApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApiSlice.middleware, 
      userApi.middleware,
      protectedApi.middleware,
      resetPasswordApi.middleware,
      siteSettingsApi.middleware,
      categoryApi.middleware,
      productApi.middleware,
      registerApiSlice.middleware,
      cartApi.middleware,
      feedbackApi.middleware,
      destinationApi.middleware,
      accommodationCategoryApi.middleware,
      accommodationApi.middleware,
      travelPackageApi.middleware,
      departuresApi.middleware,
      accommodationBookingApi.middleware,
      travelBookingsApi.middleware
    ),
});

export default store;

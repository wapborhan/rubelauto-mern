import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./feature/user/userSlice";
import userApi from "./feature/api/userApi";
import incomeApi from "./feature/api/incomeApi";
import costApi from "./feature/api/costApi";
import leadApi from "./feature/api/leadApi";
import supplierApi from "./feature/api/supplierApi";
import productApi from "./feature/api/productApi";
import purchaseApi from "./feature/api/purchaseApi";
import accountApi from "./feature/api/accountApi";
import showroomApi from "./feature/api/showroomApi";
import customerApi from "./feature/api/customerApi";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  blacklist: [
    incomeApi.reducerPath,
    costApi.reducerPath,
    leadApi.reducerPath,
    supplierApi.reducerPath,
    productApi.reducerPath,
    purchaseApi.reducerPath,
    customerApi.reducerPath,
    accountApi.reducerPath,
    showroomApi.reducerPath,
  ],
};

// Combine reducers
const rootReducer = combineReducers({
  userStore: userSlice,
  [userApi.reducerPath]: userApi.reducer,
  [incomeApi.reducerPath]: incomeApi.reducer,
  [costApi.reducerPath]: costApi.reducer,
  [leadApi.reducerPath]: leadApi.reducer,
  [supplierApi.reducerPath]: supplierApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [purchaseApi.reducerPath]: purchaseApi.reducer,
  [customerApi.reducerPath]: customerApi.reducer,
  [accountApi.reducerPath]: accountApi.reducer,
  [showroomApi.reducerPath]: showroomApi.reducer,
});

// Apply persistReducer to rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  // reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(
      userApi.middleware,
      incomeApi.middleware,
      costApi.middleware,
      leadApi.middleware,
      supplierApi.middleware,
      productApi.middleware,
      purchaseApi.middleware,
      customerApi.middleware,
      accountApi.middleware,
      showroomApi.middleware
    ),
});

// Persistor
export const persistor = persistStore(store);

export default store;

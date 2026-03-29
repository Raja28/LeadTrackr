
import adminReducer from "./adminSlice";

import { configureStore, combineReducers } from "@reduxjs/toolkit";


import { persistReducer, persistStore } from "redux-persist";
// import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import storage from "redux-persist/lib/storage";

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";


// const storage =
//   typeof window !== "undefined"
//     ? createWebStorage("local")
//     : createNoopStorage();

const rootReducer = combineReducers({
  admin: adminReducer,
});

const persistConfig = {
  key: "root",
  storage: storage.default ? storage.default : storage,
  whitelist: ["admin"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
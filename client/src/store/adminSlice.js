import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const initialState = {
    admin: null,
    isAuthenticated: false,
    status: "idle",
}

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setAdmin: (state, action) => {
            state.admin = action.payload;
            state.isAuthenticated = true;
            state.status = "idle";
        },
        logout: (state) => {
            state.admin = null;
            state.isAuthenticated = false;
            state.status = "idle";
        },
        setStatus: (state, action) => {
            if (action.payload !== state.status) {
                state.status = action.payload;
            }
        },

    },
});

export const adminRegister = (name, email, password) => async (dispatch) => {
    try {
        dispatch(setStatus("loading"));
        await axios.post(`${import.meta.env.VITE_BASE_URL}/api/admin/auth/register`, { name, email, password });
        toast.success("Admin registered successfully.");
        dispatch(adminLogin(email, password));

        return { success: true };
    } catch (error) {
        dispatch(setStatus("idle"));
        console.log(error);
        toast.error(error.response.data.message);
        return { error: true, message: error.response.data.message };
    }
}

export const adminLogin = (email, password) => async (dispatch) => {
    try {
        dispatch(setStatus("loading"));
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/admin/auth/login`,
            { email, password }, { withCredentials: true });
        toast.success("Logged in successfully");
        dispatch(setAdmin(response.data?.admin));
        return { success: true };
    } catch (error) {
        console.log(error);
        dispatch(setStatus("idle"));
        toast.error(error.response.data.message);
        return { error: true, message: error.response.data.message };
    }
}

export const adminLogout = () => async (dispatch) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/admin/auth/logout`, 
            {}, 
            { withCredentials: true } 
        );

        if (response.data.success) { 
            dispatch(logout());
            toast.success("Logged out successfully");
        }
    } catch (error) {
      
        const msg = error.response?.data?.message || "Logout failed";
        toast.error(msg);
    }
}

export const { setAdmin, logout, setStatus } = adminSlice.actions;
export default adminSlice.reducer;
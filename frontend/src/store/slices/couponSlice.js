import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const initialState = {
    coupons: [],
    appliedCoupon: null, // for validation result
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
};

/* =====================================================
   VALIDATE COUPON
===================================================== */
export const validateCoupon = createAsyncThunk(
    "coupons/validate",
    async ({ code, orderAmount }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;

            const response = await axios.post(
                `${API_URL}/coupons/validate`,
                { code, orderAmount },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to validate coupon"
            );
        }
    }
);

/* =====================================================
   GET ALL COUPONS (ADMIN)
===================================================== */
export const getAllCoupons = createAsyncThunk(
    "coupons/getAll",
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;

            const response = await axios.get(`${API_URL}/coupons`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data;

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch coupons"
            );
        }
    }
);

/* =====================================================
   CREATE COUPON
===================================================== */
export const createCoupon = createAsyncThunk(
    "coupons/create",
    async (couponData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;

            const response = await axios.post(
                `${API_URL}/coupons`,
                couponData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to create coupon"
            );
        }
    }
);

/* =====================================================
   UPDATE COUPON
===================================================== */
export const updateCoupon = createAsyncThunk(
    "coupons/update",
    async ({ id, couponData }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;

            const response = await axios.put(
                `${API_URL}/coupons/${id}`,
                couponData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to update coupon"
            );
        }
    }
);

/* =====================================================
   DELETE COUPON
===================================================== */
export const deleteCoupon = createAsyncThunk(
    "coupons/delete",
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;

            await axios.delete(`${API_URL}/coupons/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return id;

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to delete coupon"
            );
        }
    }
);

/* =====================================================
   SLICE
===================================================== */
const couponSlice = createSlice({
    name: "coupons",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = "";
        },
        removeCoupon: (state) => {
            state.appliedCoupon = null;
        },
    },
    extraReducers: (builder) => {
        builder

            /* ===== VALIDATE ===== */
            .addCase(validateCoupon.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(validateCoupon.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.appliedCoupon = action.payload.data;
            })
            .addCase(validateCoupon.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            /* ===== GET ALL ===== */
            .addCase(getAllCoupons.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllCoupons.fulfilled, (state, action) => {
                state.isLoading = false;
                state.coupons = action.payload.data;
            })
            .addCase(getAllCoupons.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            /* ===== CREATE ===== */
            .addCase(createCoupon.fulfilled, (state, action) => {
                state.coupons.unshift(action.payload.data);
                state.message = action.payload.message;
            })

            /* ===== UPDATE ===== */
            .addCase(updateCoupon.fulfilled, (state, action) => {
                state.coupons = state.coupons.map((coupon) =>
                    coupon._id === action.payload.data._id
                        ? action.payload.data
                        : coupon
                );
                state.message = action.payload.message;
            })

            /* ===== DELETE ===== */
            .addCase(deleteCoupon.fulfilled, (state, action) => {
                state.coupons = state.coupons.filter(
                    (coupon) => coupon._id !== action.payload
                );
                state.message = "Coupon deleted successfully";
            });
    },
});

export const { reset, removeCoupon } = couponSlice.actions;
export default couponSlice.reducer;

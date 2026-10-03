import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import auth from "../../../provider/firebase.config";

const initialState = {
  name: "",
  photo: "",
  email: "",
  joinDate: "",
  mobile: "",
  showRoom: "",
  designation: "",
  bloodGroup: "",
  address: "",
  userType: "",
  isUpdated: "",
  isLoading: true,
  isError: false,
  successMessage: null,
  errorMessage: null,
};

export const createUser = createAsyncThunk(
  "userSlice/createUser",
  async ({ name, email, photoURL, password }) => {
    const data = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL,
    });

    return {
      name: data?.user?.displayName,
      photo: data?.user?.photoURL,
      email: data?.user?.email,
    };
  }
);
export const loginUser = createAsyncThunk(
  "userSlice/loginUser",
  async ({ email, password }) => {
    await signInWithEmailAndPassword(auth, email, password);
  }
);

export const logOutUser = createAsyncThunk("userSlice/logOutUser", async () => {
  await signOut(auth);
});

// export const forgotPassword = createAsyncThunk(
//   "userSlice/forgotPassword",
//   async (email) => {
//     await sendPasswordResetEmail(auth, email);
//   }
// );

export const forgotPassword = createAsyncThunk(
  "userSlice/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      if (!email || !email.includes("@")) {
        throw new Error("Invalid email address format.");
      }
      await sendPasswordResetEmail(auth, email);
      return "Password reset email sent.";
    } catch (error) {
      console.error("Firebase error:", error.code, error.message);
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.name = payload?.name;
      state.photo = payload?.photo;
      state.email = payload?.email;
      state.joinDate = payload?.joinDate;
      state.mobile = payload?.mobile;
      state.showRoom = payload?.showRoom;
      state.designation = payload?.designation;
      state.bloodGroup = payload?.bloodGroup;
      state.address = payload?.address;
      state.userType = payload?.userType;
      state.isUpdated = payload?.isUpdated;
    },
    toggleLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.name = "";
        state.email = "";
        state.photo = "";
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(createUser.fulfilled, (state, { payload }) => {
        state.name = payload?.name;
        state.email = payload?.email;
        state.photo = payload?.photo;
        state.isLoading = false;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(createUser.rejected, (state, action) => {
        state.name = "";
        state.email = "";
        state.photo = "";
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.error?.message;
      });
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.name = payload?.name;
      state.photo = payload?.photo;
      state.email = payload?.email;
      state.joinDate = payload?.joinDate;
      state.mobile = payload?.mobile;
      state.showRoom = payload?.showRoom;
      state.designation = payload?.designation;
      state.bloodGroup = payload?.bloodGroup;
      state.address = payload?.address;
      state.userType = payload?.userType;
      state.isUpdated = payload?.isUpdated;
    });
    builder.addCase(logOutUser.fulfilled, (state) => {
      state.name = "";
      state.photo = "";
      state.email = "";
      state.joinDate = "";
      state.mobile = "";
      state.showRoom = "";
      state.designation = "";
      state.bloodGroup = "";
      state.address = "";
      state.userType = "";
      state.isUpdated = "";
    });
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      });
  },
});

export const { setUser, toggleLoading } = userSlice.actions;

export default userSlice.reducer;

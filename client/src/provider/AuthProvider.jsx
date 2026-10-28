import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import auth from "./firebase.config";
import { useDispatch } from "react-redux";
import { setUser, toggleLoading } from "../redux/feature/user/userSlice";
import { useGetUserByEmailQuery } from "../redux/feature/api/userApi";

const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const dispatch = useDispatch();

  // 1. Listen to Firebase auth state changes
  useEffect(() => {
    dispatch(toggleLoading(true));
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
      setAuthInitialized(true);
      if (!currentUser) {
        dispatch(
          setUser({
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
          })
        );
        dispatch(toggleLoading(false));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  // 2. Query user profile from MongoDB backend only when Firebase email is available
  const {
    data: user,
    isLoading: isUserLoading,
    isFetching: isUserFetching,
    isError,
  } = useGetUserByEmailQuery(firebaseUser?.email, {
    skip: !firebaseUser?.email,
  });

  // 3. Update Redux store when backend user data arrives
  useEffect(() => {
    if (!authInitialized || !firebaseUser) return;

    if (!isUserLoading && !isUserFetching) {
      if (user?.data) {
        dispatch(
          setUser({
            name: user.data.name || firebaseUser.displayName || "",
            photo: user.data.photo || firebaseUser.photoURL || "",
            email: user.data.email || firebaseUser.email || "",
            joinDate: user.data.joinDate || "",
            mobile: user.data.mobile || "",
            showRoom: user.data.showRoom || "",
            designation: user.data.designation || "",
            bloodGroup: user.data.bloodGroup || "",
            address: user.data.address || "",
            userType: user.data.userType || "",
            isUpdated: user.data.isUpdated || false,
          })
        );
      } else {
        // Fallback: in case MongoDB doesn't have the profile document yet
        dispatch(
          setUser({
            name: firebaseUser.displayName || "",
            photo: firebaseUser.photoURL || "",
            email: firebaseUser.email || "",
            joinDate: "",
            mobile: "",
            showRoom: "",
            designation: "",
            bloodGroup: "",
            address: "",
            userType: "",
            isUpdated: false,
          })
        );
      }
      dispatch(toggleLoading(false));
    } else if (isError) {
      // If backend request fails, fall back to Firebase basic user data
      dispatch(
        setUser({
          name: firebaseUser.displayName || "",
          photo: firebaseUser.photoURL || "",
          email: firebaseUser.email || "",
          joinDate: "",
          mobile: "",
          showRoom: "",
          designation: "",
          bloodGroup: "",
          address: "",
          userType: "",
          isUpdated: false,
        })
      );
      dispatch(toggleLoading(false));
    }
  }, [
    authInitialized,
    firebaseUser,
    user,
    isUserLoading,
    isUserFetching,
    isError,
    dispatch,
  ]);

  return children;
};

export default AuthProvider;

import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import auth from "./firebase.config";
import { useDispatch } from "react-redux";
import { setUser, toggleLoading } from "../redux/feature/user/userSlice";
import {
  useGetUserByEmailQuery,
  useSetUserMutation,
} from "../redux/feature/api/userApi";

const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const dispatch = useDispatch();
  const [createUserInDb] = useSetUserMutation();
  const createdRef = useRef(false);

  // 1. Listen to Firebase auth state changes
  useEffect(() => {
    dispatch(toggleLoading(true));
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
      setAuthInitialized(true);
      if (!currentUser) {
        createdRef.current = false;
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
    refetchOnMountOrArgChange: true,
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
            userType: user.data.userType || "user",
            isUpdated: user.data.isUpdated || false,
          })
        );
      } else {
        // Auto-register first time Google user in MongoDB with default role 'user'
        if (!createdRef.current && firebaseUser.email) {
          createdRef.current = true;
          const newUserData = {
            name: firebaseUser.displayName || "Google User",
            photo: firebaseUser.photoURL || "",
            email: firebaseUser.email,
            joinDate: new Date(),
            mobile: "",
            showRoom: "",
            designation: "",
            bloodGroup: "",
            address: "",
            userType: "user",
            isUpdated: false,
          };
          createUserInDb(newUserData);
        }

        dispatch(
          setUser({
            name: firebaseUser.displayName || "",
            photo: firebaseUser.photoURL || "",
            email: firebaseUser.email || "",
            joinDate: new Date().toISOString(),
            mobile: "",
            showRoom: "",
            designation: "",
            bloodGroup: "",
            address: "",
            userType: "user",
            isUpdated: false,
          })
        );
      }
      dispatch(toggleLoading(false));
    } else if (isError) {
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
          userType: "user",
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
    createUserInDb,
    dispatch,
  ]);

  return children;
};

export default AuthProvider;

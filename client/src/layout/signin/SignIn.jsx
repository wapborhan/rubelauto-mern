import {
  Link,
  useLocation,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/feature/user/userSlice";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, name } = useSelector((state) => state.userStore);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (name && email) {
      navigate("/dashboard");
    }
  }, [navigate, email, name]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const result = await dispatch(loginUser({ email, password }));

      console.log("Login successful:", result);

      navigate(location?.state?.from || "/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden bg-white rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-lg z-10  mx-auto">
      <div className="p-4 py-6 text-white bg-blue-500 md:w-6/12 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly lg:order-1 md:order-1 order-2">
        <div className="my-3 text-4xl font-bold tracking-wider text-center">
          <Link to="/">
            <img
              src="/images/logo/logo-squire.png"
              alt="Rubel Auto"
              className="w-40 bg-white p-2 rounded-lg mx-auto"
            />
          </Link>
        </div>
        {/* <p className="mt-6 p-3 font-normal text-justify text-gray-300 md:mt-0">
          <b>Rubel Auto</b> is a trusted dealer of Runner Automobiles PLC.
        </p> */}

        <p className="flex flex-col items-center justify-center mt-10 text-center">
          <span>কোন অ্যাকাউন্ট নেই?</span>
          <Link to="/auth/signup" className="underline">
            শুরু করুন
          </Link>
        </p>
      </div>
      <div className="p-5 bg-white md:flex-1 lg:order-2 md:order-2 order-1">
        <h3 className="my-4 text-2xl font-semibold text-gray-700">
          অ্যাকাউন্ট লগইন
        </h3>
        <form onSubmit={handleLogin} className="flex flex-col space-y-5">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-semibold text-gray-500">ইমেইল</label>
            <input
              type="email"
              name="email"
              placeholder="আপনার ইমেইল @domain.com"
              autoFocus
              className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between relative">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-500"
              >
                পাসওয়ার্ড
              </label>
              <Link
                to="/auth/forgot-password"
                className="underline    text-[#198754]"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="পাসওয়ার্ড"
                className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200 w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <i className="pi pi-eye-slash"></i>
                ) : (
                  <i className="pi pi-eye"></i>
                )}
              </button>
            </div>
          </div>{" "}
          <div className=" flex  justify-center gap-3">
            <Button
              type="submit"
              label="লগিন করুণ"
              icon="pi pi-check"
              loading={loading}
              // onClick={load}
              className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4"
            >
              {/* {loading ? (
                  <span className="flex justify-center gap-3">
                    <span>Logging in...</span>
                  </span>
                ) : (
                  "Log in"
                )} */}
            </Button>
          </div>
          {/* <div className="flex flex-col space-y-5">
              <span className="flex items-center justify-center space-x-2">
                <span className="h-px bg-gray-400 w-14"></span>
                <span className="font-normal text-gray-500">or login with</span>
                <span className="h-px bg-gray-400 w-14"></span>
              </span>
              <div className="flex flex-col space-y-4">
                <SocialSignIn />
              </div>
            </div> */}
        </form>
      </div>
    </div>
  );
};

export default SignIn;

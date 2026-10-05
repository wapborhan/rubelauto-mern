import { useEffect, useRef } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "primereact/toast";

const PrivateRoute = ({ children }) => {
  const toast = useRef(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, isUpdated, userType, isLoading } = useSelector(
    (state) => state.userStore,
  );

  useEffect(() => {
    if (
      toast.current &&
      email &&
      !isUpdated &&
      location.pathname !== "/auth/signin"
    ) {
      toast.current.show({
        severity: "error",
        summary: "নোটিশ",
        sticky: true,
        detail: "Message Content",
        life: 3000,
        content: () => (
          <>
            আপনার প্রোফাইল একটিভ নেই, একটিভ করতে আপনার হেড অফিসে
            <div className="message">
              <a
                href="https:api.whatsapp.com/send?phone=8801907093959&text=Need to Acive my Account."
                className="blantershow-chat flex gap-2 border-2 rounded-full py-2 px-5 cursor-pointer hover:bg-green-600 hover:text-white  transition-all"
                style="display: flex; gap: 10px; border: 1px solid #888; padding: 5px 10px; border-radius: 30px ;margin-top:10px ; width: fit-content;
                        margin: 20px auto;"
                title="Show Chat"
                target="__BLANK"
              >
                <svg width="20" viewBox="0 0 24 24">
                  <defs />
                  <path
                    fill="#eceff1"
                    d="M20.5 3.4A12.1 12.1 0 0012 0 12 12 0 001.7 17.8L0 24l6.3-1.7c2.8 1.5 5 1.4 5.8 1.5a12 12 0 008.4-20.3z"
                  />
                  <path
                    fill="#4caf50"
                    d="M12 21.8c-3.1 0-5.2-1.6-5.4-1.6l-3.7 1 1-3.7-.3-.4A9.9 9.9 0 012.1 12a10 10 0 0117-7 9.9 9.9 0 01-7 16.9z"
                  />
                  <path
                    fill="#fafafa"
                    d="M17.5 14.3c-.3 0-1.8-.8-2-.9-.7-.2-.5 0-1.7 1.3-.1.2-.3.2-.6.1s-1.3-.5-2.4-1.5a9 9 0 01-1.7-2c-.3-.6.4-.6 1-1.7l-.1-.5-1-2.2c-.2-.6-.4-.5-.6-.5-.6 0-1 0-1.4.3-1.6 1.8-1.2 3.6.2 5.6 2.7 3.5 4.2 4.2 6.8 5 .7.3 1.4.3 1.9.2.6 0 1.7-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4z"
                  />
                </svg>
                Whatsapp করুণ
              </a>
            </div>
          </>
        ),
      });

      // dispatch(logOutUser());
    }
  }, [isUpdated, dispatch, location.pathname, email]);

  useEffect(() => {
    if (userType === "user" && location.pathname !== "/profile/edit") {
      navigate("/profile/edit");
    }
  }, [userType, isUpdated, navigate, location.pathname]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (email) {
    return children;
  }

  return (
    <>
      <Toast
        ref={toast}
        pt={{
          message: ({ index }) => ({
            className: `bg-yellow-${((index > 5 && 5) || index || 1) * 100}`,
          }),
        }}
      />
      <Navigate to="/auth/signin" state={{ from: location.pathname }} replace />
    </>
  );
};

export default PrivateRoute;

PrivateRoute.propTypes = { children: PropTypes.node.isRequired };

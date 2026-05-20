import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigation } from "react-router-dom";
// import Footer from "./Footer";
import MySidebar from "./MySidebar";

import Header from "./Header";
import Loading from "../components/shared/Loading";
import { useSelector } from "react-redux";
import Footer from "./Footer";

const Root = () => {
  const navigation = useNavigation();
  const [collapsed, setCollapsed] = useState(false);
  const [broken, setBroken] = useState(false);
  const [toggled, setToggled] = useState(false);
  const { isLoading } = useSelector((state) => state.userStore);
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [location]);

  if (loading) {
    return (
      <div className="flex w-screen h-screen justify-center items-center ">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div id="wrapper" className="flex">
        <div className="sidebars">
          <MySidebar
            collapsed={collapsed}
            setBroken={setBroken}
            setToggled={setToggled}
            toggled={toggled}
            broken={broken}
          />
        </div>
        <div id="content-wrapper" className="flex flex-col w-full">
          <div id="content w-full relative" className="content">
            <Header
              collapsed={collapsed}
              setBroken={setBroken}
              setCollapsed={setCollapsed}
              setToggled={setToggled}
              toggled={toggled}
              broken={broken}
            />
            <div className="p-5">
              {navigation.state === "loading" && (
                <div className="flex justify-center items-center h-full">
                  <Loading />
                </div>
              )}
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loading />
                </div>
              ) : (
                <Outlet />
              )}
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Root;

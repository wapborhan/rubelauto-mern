import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigation } from "react-router-dom";
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
      <div className="flex w-screen h-screen justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div id="wrapper" className="flex min-h-screen bg-gray-50">
      {/* Pinned Sticky Sidebar */}
      <div className="sidebars h-screen sticky top-0 shrink-0 z-40">
        <MySidebar
          collapsed={collapsed}
          setBroken={setBroken}
          setToggled={setToggled}
          toggled={toggled}
          broken={broken}
        />
      </div>

      {/* Main Content Area */}
      <div
        id="content-wrapper"
        className="flex flex-col flex-1 min-w-0 h-screen overflow-y-auto"
      >
        <Header
          collapsed={collapsed}
          setBroken={setBroken}
          setCollapsed={setCollapsed}
          setToggled={setToggled}
          toggled={toggled}
          broken={broken}
        />
        <main className="flex-1 p-4 md:p-6">
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
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Root;

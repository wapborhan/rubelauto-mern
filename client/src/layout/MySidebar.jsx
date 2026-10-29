import { useEffect, useState, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { menuData } from "./menuData";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import Logo from "../assets/images/logo/logo-squire.png";
import { useSelector } from "react-redux";

const MySidebar = ({ collapsed, setBroken, setToggled, toggled, broken }) => {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const { showRoom, userType } = useSelector((state) => state.userStore);
  const location = useLocation();

  // Filter menu items by permissions / showroom
  const filteredMenu = useMemo(() => {
    if (showRoom === "Parts" && userType !== "admin") {
      return menuData.filter((item) =>
        ["পার্টস", "ড্যাশবোর্ড", "অ্যাপ সেতিংস"].includes(item.label)
      );
    }
    return menuData;
  }, [showRoom, userType]);

  // Automatically open the matching submenu based on current route
  useEffect(() => {
    filteredMenu.forEach((item, index) => {
      if (item.subMenu) {
        const isMatch = item.subMenu.some(
          (subItem) => location.pathname === subItem.path
        );
        if (isMatch) {
          setOpenSubMenu(index);
        }
      }
    });
  }, [location.pathname, filteredMenu]);

  const handleSubMenuClick = (index) => {
    setOpenSubMenu(openSubMenu === index ? null : index);
  };

  const menuItemStyles = {
    root: {
      fontSize: "13.5px",
      fontWeight: 500,
      margin: "2px 0",
    },
    icon: ({ active }) => ({
      color: active ? "#2563eb" : "#64748b",
      fontSize: "16px",
      minWidth: "24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    SubMenuExpandIcon: {
      color: "#94a3b8",
      fontSize: "12px",
    },
    subMenuContent: {
      backgroundColor: "#f8fafc",
      borderLeft: "2px solid #e2e8f0",
      marginLeft: "18px",
      paddingLeft: "4px",
      marginTop: "2px",
      marginBottom: "4px",
      borderRadius: "0 6px 6px 0",
    },
    button: ({ active, level }) => ({
      color: active ? "#1d4ed8" : "#334155",
      backgroundColor: active
        ? level === 0
          ? "#eff6ff"
          : "#dbeafe"
        : "transparent",
      borderRadius: "8px",
      padding: level === 0 ? "8px 12px" : "6px 12px",
      height: level === 0 ? "42px" : "36px",
      transition: "all 0.15s ease-in-out",
      fontWeight: active ? 600 : 500,
      "&:hover": {
        backgroundColor: active
          ? level === 0
            ? "#dbeafe"
            : "#bfdbfe"
          : "#f1f5f9",
        color: "#0f172a",
        "& .ps-menu-icon": {
          color: "#2563eb",
        },
      },
    }),
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };

  return (
    <Sidebar
      collapsed={collapsed}
      toggled={toggled}
      onBackdropClick={() => setToggled(false)}
      onBreakPoint={setBroken}
      breakPoint="md"
      rootStyles={{
        height: "100vh",
        position: "sticky",
        top: 0,
        zIndex: 40,
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e2e8f0",
        "& .ps-sidebar-container": {
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ffffff",
          overflow: "hidden",
        },
      }}
    >
      <div className="flex flex-col h-full overflow-hidden bg-white">
        {/* Top Header / Logo */}
        <div className="h-16 px-4 flex items-center justify-center border-b border-gray-100 shrink-0 bg-white shadow-2xs">
          <NavLink to="/dashboard" className="flex items-center gap-2">
            <img
              src={Logo}
              alt="Rubel Auto"
              className="h-10 w-auto object-contain transition-transform hover:scale-105"
            />
            {!collapsed && (
              <span className="font-extrabold text-gray-800 text-base tracking-tight">
                Rubel Auto
              </span>
            )}
          </NavLink>
        </div>

        {/* Scrollable Navigation Area (Scrolls vertically when long) */}
        <div className="flex-1 overflow-y-auto sidebar-scroll py-3 px-2">
          <Menu menuItemStyles={menuItemStyles}>
            {filteredMenu.map((item, index) => {
              if (item.subMenu) {
                const isSubActive = item.subMenu.some(
                  (subItem) => location.pathname === subItem.path
                );

                return (
                  <SubMenu
                    key={index}
                    label={item.label}
                    icon={<i className={`pi ${item.icon}`}></i>}
                    open={openSubMenu === index}
                    active={isSubActive}
                    onClick={() => handleSubMenuClick(index)}
                  >
                    {item.subMenu.map((subItem, subIndex) => {
                      const isItemActive = location.pathname === subItem.path;

                      return (
                        <MenuItem
                          key={subIndex}
                          component={<NavLink to={subItem.path} />}
                          active={isItemActive}
                        >
                          {subItem.label}
                        </MenuItem>
                      );
                    })}
                  </SubMenu>
                );
              }

              const isItemActive = location.pathname === item.path;

              return (
                <MenuItem
                  key={index}
                  icon={<i className={`pi ${item.icon}`}></i>}
                  component={<NavLink to={item.path} />}
                  active={isItemActive}
                >
                  {item.label}
                </MenuItem>
              );
            })}
          </Menu>
        </div>

        {/* Bottom Showroom & Role Status */}
        <div className="p-3 border-t border-gray-100 shrink-0 bg-gray-50/70">
          <div className="flex items-center gap-2.5 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              <i className="pi pi-building text-xs"></i>
            </div>
            {!collapsed && (
              <div className="overflow-hidden min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate">
                  {showRoom || "প্রধান কার্যালয়"}
                </p>
                <p className="text-[10px] text-gray-500 capitalize truncate">
                  {userType ? `স্ট্যাটাস: ${userType}` : "স্টাফ"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default MySidebar;

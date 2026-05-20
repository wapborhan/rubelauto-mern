import { createBrowserRouter } from "react-router-dom";
import * as All from "../pages";
import Redirect from "../pages/Redirect";
import Root from "../layout/Root";
import SignIn from "../layout/signin/SignIn";
import SignUp from "../layout/signup/SignUp";
import PrivateRoute from "../provider/PrivateRoute";
import AuthLay from "../layout/AuthLay";
import ForgotPassword from "../layout/forgot-password/ForgotPassword";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Redirect />,
    errorElement: "Error",
  },
  {
    path: "/auth",
    element: <AuthLay />,
    children: [
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Root />
      </PrivateRoute>
    ),
    errorElement: "Error",
    children: [
      {
        path: "/dashboard",
        element: <All.Dashboard />,
      },
      // Contact
      {
        path: "/contact",
        children: [
          {
            path: "lead/add",
            element: <All.AddLead />,
          },
          {
            path: "lead/add/guarantor/:id",
            element: <All.AddGuarantor />,
          },
          {
            path: "lead/edit/guarantor/:id",
            element: <All.EditGuarantor />,
          },
          {
            path: "lead/view",
            element: <All.ViewLead />,
          },
          {
            path: "lead/view/:id",
            element: <All.LeadDetails />,
          },
          {
            path: "lead/edit/:id",
            element: <All.EditLead />,
          },
          {
            path: "supplier/add",
            element: <All.AddSupplier />,
          },
          {
            path: "supplier/view",
            element: <All.ViewSupplier />,
          },
          {
            path: "supplier/parts/view",
            element: <All.ViewSupplier />,
          },

          {
            path: "supplier/view/:id",
            element: <All.SupplierDetails />,
          },
          {
            path: "supplier/edit/:id",
            element: <All.UpdateSupplier />,
          },
          {
            path: "supplier/payment/:id",
            element: <All.SupplierPayment />,
          },
        ],
      },
      // Product
      {
        path: "/products/",
        children: [
          {
            path: "add",
            element: <All.AddProduct />,
          },
          {
            path: "view",
            element: <All.ViewProduct />,
          },
          {
            path: "edit/:id",
            element: <All.EditProduct />,
          },
        ],
      },
      // Purchase
      {
        path: "/purchase/",
        children: [
          {
            path: "add",
            element: <All.AddPurchase />,
          },
          {
            path: "parts/add",
            element: <All.PartsPurchase />,
          },
          {
            path: "view",
            element: <All.ViewPurchase />,
          },
          {
            path: "parts/view",
            element: <All.PartsViewPurchase />,
          },
        ],
      },
      // Sale
      {
        path: "/sale",
        children: [
          {
            path: ":status",
            element: <All.AddSale />,
          },
          {
            path: "return",
            element: "Coming...",
          },
        ],
      },
      // Customer
      {
        path: "/customer",
        children: [
          {
            path: ":status",
            element: <All.Customer />,
          },

          {
            path: "view/:cardNo",
            element: <All.CustomerDetails />,
          },
          {
            path: "payment/:cardNo",
            element: <All.Payment />,
          },
          {
            path: "seized/:cardNo",
            element: <All.Seized />,
          },
          {
            path: "paid/:cardNo",
            element: <All.Paid />,
          },
          {
            path: "due/:cardno",
            element: "Coming Soon",
          },
        ],
      },
      {
        path: "/parts/customer",
        element:
          "Under Constraction দোকানের নাম,ঠিকানা,মালিকের নাম,মোবাইল নাম্বার,খাতার পেজ নাম্বার,openingBalance,",
      },
      // Documents
      {
        path: "/documents",
        children: [
          {
            path: "",
            element: <All.Documents />,
          },
        ],
      },
      {
        path: "/showroom",
        children: [
          // {
          //   path: "add",
          //   element: <All.AddShowroom />,
          // },
          {
            path: "list",
            element: <All.ViewShowroom />,
          },
        ],
      },
      // account
      {
        path: "/account",
        children: [
          {
            path: "income/add",
            element: <All.AddIncome />,
          },
          {
            path: "income/view",
            element: <All.ViewIncome />,
          },
          {
            path: "cost/add",
            element: <All.AddCost />,
          },
          {
            path: "cost/view",
            element: <All.ViewCost />,
          },
          {
            path: "list",
            element: <All.AccountLists />,
          },
          {
            path: "transfer",
            element: <All.Transfer />,
          },
        ],
      },
      // Staff
      {
        path: "/staff",
        errorElement: "404",
        children: [
          {
            path: "add",
            element: "Under Constraction",
          },
          {
            path: "view",
            element: <All.ViewStaff />,
          },
          {
            path: "edit/:email",
            element: <All.EditStaff />,
          },
        ],
      },
      // Profile
      {
        path: "/profile",
        errorElement: "404",
        // element: <StaffDetails />,
        children: [
          {
            path: "view",
            element: <All.Profile />,
          },
          {
            path: "edit",
            element: <All.Settings />,
          },
          {
            path: "details",
            element: <All.StaffDetails />,
          },
        ],
      },
    ],
  },
  {
    path: "/memo",
    element: <Root />,
    children: [{ path: "", element: <All.Memo /> }],
  },
]);

export default routes;

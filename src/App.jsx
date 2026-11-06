import { Layout } from "./layouts/Layout.jsx";
import ProductList from "./pages/ProductList.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

export default function App() {
  const pathname = window.location.pathname;

  return (
    <Layout>
      {pathname === "/dang-ky" ? <RegisterPage /> : pathname === "/dang-nhap" ? <LoginPage /> : <ProductList />}
    </Layout>
  );
}

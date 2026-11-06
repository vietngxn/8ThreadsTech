import { Layout } from "./layouts/Layout.jsx";
import ProductList from "./pages/ProductList.jsx";
import LoginPage from "./pages/LoginPage.jsx";

export default function App() {
  const isLoginPage = window.location.pathname === "/dang-nhap";

  return (
    <Layout>
      {isLoginPage ? <LoginPage /> : <ProductList />}
    </Layout>
  );
}

import { Layout } from "./layouts/Layout.jsx";
import ProductList from "./pages/ProductList.jsx";
import LoginPage from "./pages/LoginPage.jsx";

export default function App() {
  return (
    <Layout>
      <ProductList />
    </Layout>
  );
}

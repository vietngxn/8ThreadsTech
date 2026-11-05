import { Layout } from "./layouts/Layout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";

export default function App() {
  return (
    <Layout>
      <ProductDetailPage />
    </Layout>
  );
}

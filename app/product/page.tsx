import ProductTemplate, { productMetadata } from "@/components/templates/ProductTemplate";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return productMetadata("product");
}

export default function ProductPage() {
  return <ProductTemplate slug="product" />;
}

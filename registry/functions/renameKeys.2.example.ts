import { renameKeys } from "./renameKeys";

const product = {
  productId: 101,
  productName: "Laptop",
  productPrice: 1200,
};

const renamedProduct = renameKeys(product, [
  { from: "productId", to: "id" },
  { from: "productName", to: "name" },
]);

console.log(renamedProduct);
// Output: { productPrice: 1200, id: 101, name: "Laptop" }

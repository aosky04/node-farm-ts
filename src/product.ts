import fs from 'node:fs';
import { parseJSON } from './utils.js';

/**
 * Represents a single farm product.
 */
type Product = {
  id: number;
  productName: string;
  image: string;
  from: string;
  nutrients: string;
  quantity: string;
  price: string;
  organic: boolean;
  description: string;
};

/**
 * Reads and parses the list of products from the `products.json` file.
 *
 * Each item in the returned array represents a single {@link Product}.
 *
 * @returns An array of {@link Product} objects.
 */
export const getProductsData = (): Product[] => {
  const productsData = fs.readFileSync(
    `${import.meta.dirname}/dev-data/products.json`,
    'utf-8'
  );

  return parseJSON<Product[]>(productsData);
};

export const parseProductTemplate = (
  template: string,
  product: Product
): string => {
  let html = template
    .replaceAll(/{%PRODUCT_ID%}/g, product.id.toString())
    .replaceAll(/{%PRODUCT_NAME%}/g, product.productName)
    .replaceAll(/{%PRODUCT_IMAGE%}/g, product.image)
    .replaceAll(/{%PRODUCT_FROM%}/g, product.from)
    .replaceAll(/{%PRODUCT_NUTRIENTS%}/g, product.nutrients)
    .replaceAll(/{%PRODUCT_QUANTITY%}/g, product.quantity)
    .replaceAll(/{%PRODUCT_PRICE%}/g, product.price)
    .replaceAll(/{%PRODUCT_DESCRIPTION%}/g, product.description);

  if (!product.organic) {
    html = html.replaceAll(/{%PRODUCT_ORGANIC%}/g, 'not-organic');
  } else {
    html = html.replaceAll(/{%PRODUCT_ORGANIC%}/g, '');
  }

  return html;
};

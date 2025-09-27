import http from 'node:http';
import fs from 'node:fs';
import { StatusCodes } from 'http-status-codes';
import { getProductsData, parseProductTemplate } from './product.js';

// Read and parse env vars
const HOST = process.env.HOST ?? '127.0.0.1';
const PORT = parseInt(process.env.PORT ?? '3000', 10);

// Get products data
const productsObj = getProductsData();

// Read HTML templates
const tempCard = fs.readFileSync(
  `${import.meta.dirname}/templates/template-card.html`,
  'utf-8'
);

const tempOverview = fs.readFileSync(
  `${import.meta.dirname}/templates/template-overview.html`,
  'utf-8'
);

const tempProduct = fs.readFileSync(
  `${import.meta.dirname}/templates/template-product.html`,
  'utf-8'
);

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Parse request URL
  const { pathname, searchParams } = new URL(
    req.url!,
    `http://${req.headers.host}`
  );

  // Handle Overview page
  if (pathname === '/' || pathname === '/overview') {
    const htmlCards = productsObj
      .map((product) => parseProductTemplate(tempCard, product))
      .join('');

    const htmlOverview = tempOverview.replace(/{%TEMPLATE_CARDS%}/, htmlCards);

    return res
      .writeHead(StatusCodes.OK, { 'Content-Type': 'text/html' })
      .end(htmlOverview);

    // Handle Product page
  } else if (pathname === '/product') {
    const productId = searchParams.get('id');

    if (!productId)
      return res
        .writeHead(StatusCodes.BAD_REQUEST, {
          'Content-Type': 'application/json',
        })
        .end(
          JSON.stringify({
            status: 'fail',
            message: 'Query string must include a product ID',
          })
        );

    const product = productsObj[+productId];

    if (!product)
      return res
        .writeHead(StatusCodes.BAD_REQUEST, {
          'Content-Type': 'application/json',
        })
        .end(
          JSON.stringify({
            status: 'fail',
            message: `No product found with ID '${productId}'`,
          })
        );

    const htmlProduct = parseProductTemplate(tempProduct, product);

    return res
      .writeHead(StatusCodes.OK, { 'Content-Type': 'text/html' })
      .end(htmlProduct);

    // Handle API endpoint
  } else if (pathname === '/api') {
    return res
      .writeHead(StatusCodes.OK, { 'Content-Type': 'application/json' })
      .end(
        JSON.stringify({
          status: 'success',
          message: 'Retrieved all products data',
          data: productsObj,
        })
      );

    // Handle 404 Not Found
  } else {
    return res
      .writeHead(StatusCodes.NOT_FOUND, { 'Content-Type': 'text/html' })
      .end('<h1>Page not found</h1>');
  }
});

// Listening to requests
server.listen(PORT, HOST, () => {
  console.log(`Listening to requests at http://${HOST}:${PORT}`);
});

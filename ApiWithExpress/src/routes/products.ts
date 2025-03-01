import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
const productsFilePath = path.join(
  __dirname,
  '../responses/productsResponse.json'
);

// Función para leer productos desde el archivo JSON
const readProducts = (): any[] => {
  try {
    const data = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo el archivo JSON:', error);
    return [];
  }
};

// Función para escribir productos en el archivo JSON
const writeProducts = (products: any[]) => {
  try {
    fs.writeFileSync(
      productsFilePath,
      JSON.stringify(products, null, 2),
      'utf8'
    );
  } catch (error) {
    console.error('Error escribiendo en el archivo JSON:', error);
  }
};

// Funcion para simular un pequeño delay en la respuesta
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const getProducts = async (req: Request, res: Response) => {
  await delay(3000);
  const products = readProducts();
  res.status(200).json(products);
};

const createProduct = async (req: Request, res: Response) => {
  const { description, stock, price } = req.body;

  if (!description || !stock || !price) {
    res.status(400).json({ error: 'Missing fields' });
    return;
  }

  const products = readProducts();

  const lastCode = products.length > 0 ? products[products.length - 1].code : 0;
  const newCode = (Number(lastCode) + 1).toString();
  const newProduct = {
    stock,
    price,
    description,
    code: newCode,
  };
  products.push(newProduct);
  writeProducts(products);

  await delay(3000);
  res.status(201).json(newProduct);
};

const updateProduct = async (req: Request, res: Response) => {
  const { code } = req.params;
  const updates = req.body;

  await delay(3000);

  const products = readProducts();
  const product = products.find((product) => product.code === code);

  if (!product) {
    res.status(404).json({ message: 'Producto no encontrado.' });
    return;
  }

  Object.assign(product, updates);

  writeProducts(products);

  res.status(201).json({ ...product, ...updates });
};

const deleteProduct = async (req: Request, res: Response) => {
  const { code } = req.params;
  let products = readProducts();

  const index = products.findIndex((product) => product.code === code);

  if (index === -1) {
    res.status(404).json({ message: 'Producto no encontrado.' });
    return;
  }

  const deletedProduct = products.splice(index, 1)[0];

  writeProducts(products);

  res
    .status(200)
    .json({ message: 'Producto eliminado con éxito', deletedProduct });
};

export default { getProducts, createProduct, updateProduct, deleteProduct };

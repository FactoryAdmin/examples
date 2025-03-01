//importamos el framework express
import express, { Express, Request, Response } from 'express';
import users from './routes/users';
import products from './routes/products';
// creamos una instancia de express
const app = express();
//especificamos el puerto en el que se ejecutara el servidor
const port = 4000;
//Seteamos el puerto en el que se ejecutara el servidor
app.set('port', port);

// Middleware para parsear automáticamente (o convierta) el cuerpo de las peticiones HTTP que llegan en formato JSON a un objeto JavaScript que puedas manejar en tu código.
app.use(express.json());

// Middleware para configurar el CORS
app.use((req, res, next) => {
  //Permite que cualquier dominio (*) pueda hacer solicitudes a este servidor.
  res.header('Access-Control-Allow-Origin', '*');
  //Define qué cabeceras están permitidas en las solicitudes.
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, *'
  );
  //Indica qué métodos HTTP están permitidos.
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  //Llama a la siguiente función en la cadena de middlewares para que Express continúe procesando la solicitud.
  next();
});

//definimos las rutas

app.post('/users/login/', users.userAuth);
app.get('/products/', products.getProducts);
app.post('/products/', products.createProduct);
app.patch('/products/:code', products.updateProduct);
app.delete('/products/:code', products.deleteProduct);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

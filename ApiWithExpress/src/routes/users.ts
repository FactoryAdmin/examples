import { Request, Response } from 'express';
import { users } from '../responses/usersResponse';

// Funcion para simular un pequeño delay en la respuesta
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const userAuth = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const isvalidUser = users.find(
    (user) => user.username === username && user.password === password
  );

  console.log(isvalidUser);

  if (!isvalidUser) {
    res.status(401).send({ message: 'Credenciales incorrectas' });
    return;
  }

  const { role } = isvalidUser;

  await delay(3000);

  res.status(200).send({
    role,
    username,
  });
};

export default { userAuth };

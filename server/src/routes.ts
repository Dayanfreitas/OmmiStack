import express, { Router, request, response } from 'express';
import knex from  './database/connection'
const routes = express.Router();

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const pointsController = new PointsController();
const itemsController = new ItemsController();

// Params: Parâmetros que vem na própria rota que identificam um recurso.
// Query: Parâmetros opcionais
// Body: Parâmetros para criação/atualização de informações

routes.get('/items', itemsController.index);

routes.post('/points', pointsController.create);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

export default routes;

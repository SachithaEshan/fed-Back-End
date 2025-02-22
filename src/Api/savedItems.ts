import express, { RequestHandler } from 'express';
import { isAuthenticated } from './middleware/authentication-middleware';
import { addFavorite, removeFavorite, getFavorites } from '../Application/savedItems';

const router = express.Router();

router.get('/', isAuthenticated, getFavorites as RequestHandler);
router.post('/', isAuthenticated, addFavorite as RequestHandler);
router.delete('/:id', isAuthenticated, removeFavorite as RequestHandler);

export default router;
import express from 'express';
import { isAuthenticated } from '../Api/middleware/authentication-middleware';
import { addFavorite, removeFavorite, getFavorites } from '../Application/savedItems';

const router = express.Router();

router.get('/', isAuthenticated, getFavorites);
router.post('/', isAuthenticated, addFavorite);
router.delete('/:id', isAuthenticated, removeFavorite);

export default router;
import express from 'express';
import asyncHandler from 'express-async-handler';
import { isAuthenticated } from './middleware/authentication-middleware';
import { addFavorite, removeFavorite, getFavorites } from '../Application/savedItems';

const router = express.Router();

router.get('/', isAuthenticated, asyncHandler(getFavorites));
router.post('/', isAuthenticated, asyncHandler(addFavorite));
router.delete('/:id', isAuthenticated, asyncHandler(removeFavorite));

export default router;
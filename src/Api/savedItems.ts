import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import { isAuthenticated } from './middleware/authentication-middleware';
import { addFavorite, removeFavorite, getFavorites } from '../Application/savedItems';

const router = express.Router();

// Cast the handlers to RequestHandler to ensure type compatibility
const typedGetFavorites: RequestHandler = getFavorites;
const typedAddFavorite: RequestHandler = addFavorite;
const typedRemoveFavorite: RequestHandler = removeFavorite;

router.get('/', isAuthenticated, asyncHandler(typedGetFavorites));
router.post('/', isAuthenticated, asyncHandler(typedAddFavorite));
router.delete('/:id', isAuthenticated, asyncHandler(typedRemoveFavorite));

export default router;
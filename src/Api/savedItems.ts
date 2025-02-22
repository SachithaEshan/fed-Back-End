import express, { Request } from 'express';
import asyncHandler from 'express-async-handler';
import { isAuthenticated } from './middleware/authentication-middleware';
import { addFavorite, removeFavorite, getFavorites } from '../Application/savedItems';

const router = express.Router();

router.get('/', isAuthenticated, asyncHandler(async (req: Request, res, next) => getFavorites(req, res, next)));
router.post('/', isAuthenticated, asyncHandler(async (req: Request, res, next) => addFavorite(req, res, next)));
router.delete('/:id', isAuthenticated, asyncHandler(async (req: Request, res, next) => removeFavorite(req, res, next)));

export default router;
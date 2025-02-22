import express from 'express';
import asyncHandler from 'express-async-handler';
import { requireAuth } from '@clerk/express';
import { addFavorite, removeFavorite, getFavorites } from '../Application/savedItems';

const router = express.Router();

// Use Clerk's requireAuth directly
const isAuthenticated = requireAuth();

router.get('/', isAuthenticated, asyncHandler(getFavorites));
router.post('/', isAuthenticated, asyncHandler(addFavorite));
router.delete('/:id', isAuthenticated, asyncHandler(removeFavorite));

export default router;
// Router Setup (e.g., searchRoutes.js)
const express = require('express');
const {
    createFavourites,
    getSearches,
    getSearch,
    deleteFavourite,
    updateFavourite, 
    saveSearch, 
} = require('../controller/searchController');

const router = express.Router();

router.post('/', saveSearch); 

// GET all searches
router.get('/', getSearches);

// GET a single search
router.get('/:id', getSearch);

// POST a new search
router.post('/favourties', createFavourites);

// DELETE a search
router.delete('/:id', deleteFavourite);

// UPDATE a search
router.patch('/:id', updateFavourite);

module.exports = router;
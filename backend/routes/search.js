// Router Setup (e.g., searchRoutes.js)
const express = require('express');
const {
    createFavourites,
    getSearches,
    getSearch,
    deleteFavourite,
    updateFavourite, 
    saveSearch, 
    getUserSearchHistory,
    clearSearchHistory
} = require('../controller/searchController');


const router = express.Router();

router.post('/', saveSearch); 

// GET all searches
router.get('/', getSearches);

// GET a single search
router.get('/:username', getSearch);

// POST a new search
router.post('/favourties', createFavourites);

// DELETE a search
router.delete('/:id', deleteFavourite);

// UPDATE a search
router.patch('/:id', updateFavourite);

//get search history
router.get('/history/:username', getUserSearchHistory); 

router.delete('/clearhistory/:username',clearSearchHistory);

module.exports = router;
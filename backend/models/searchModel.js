const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const searchSchema = new Schema({
    start_location: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Export the Search model
const Search = mongoose.model("Search", searchSchema);
module.exports = Search;
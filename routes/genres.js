const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const express = require('express');
const { required } = require('@hapi/joi');
const router = express.Router();

// Schema
// const genreSchema = mongoose.Schema({
//   name: {
//     type: String,
//     required: required,
//     minlength: 5,
//     maxlength: 50,
//   },
// });

// Schema
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
});

// Model
const Genre = mongoose.model('Genre', genreSchema);

// Get List of genres
router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

// Get a single genre
router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) {
    res.status(404).send('The genre with the given ID not found!');
  }

  res.send(genre);
});

// Post genres
router.post('/', async (req, res) => {
  const { error } = schemaValidator(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let genre = new Genre({
    name: req.body.name,
  });
  genre = await genre.save();
  genre.save();
  res.send(genre);
});

// Update genre
router.put('/:id', async (req, res) => {
  const genreFound = await Genre.findByIdAndRemove(req.params.id);

  if (!genreFound) {
    return res.status(404).send('The genre with given ID was not found!');
  }

  const { error } = schemaValidator(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );

  res.send(genre);
});

// Delete genre
router.delete('/:id', async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  // const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre) {
    return res.status(404).send('The genre with given ID was not found!');
  }
  res.send(genre);
});

function schemaValidator(data) {
  const schema = Joi.object({
    id: Joi.number(),
    name: Joi.string().min(3).max(50).required(),
  });
  return schema.validate(data);
}

module.exports = router;

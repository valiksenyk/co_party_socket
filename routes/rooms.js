const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Room = require('../models/room');


/* GET rooms listing. */
router.get('/', async (req, res, next) => {
    Room.find()
        .select('name users')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                rooms: docs
            }

            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', async (req, res) => {
    Room.find({name: req.body.name})
        .exec()
        .then(doc => {
            if (doc.length >= 1) {
                return res.status(409).json({
                    message: 'Room with this name already exist'
                });
            } else {
                const room = new Room({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name
                })
                    .save()
                    .then(result => {
                        res.status(200).json({
                            _id: result._id,
                            name: result.name
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    })
            }
        })
})

module.exports = router;

const express = require('express');
const router = express.Router();
const { Course, User } = require('../models');

//GET/api/courses - Get all courses
router.get('/course', async (req, res) => {
    try {
    const course = await Course.findAll({
        include: [{ model: User, as: 'user'}]
    });
    res.status(200).json(course);
}catch (error) {
    res.status(500).json({ message: error.message });
}
});

//GET /api/courses/:id - Get a specific course
router.get('/course/:id', async(req, res) => {
    try {
        const course = await Course.findOne({
            where: { id: req.params.id },
            include: [{ model: User, as: 'user '}]
        });
    if (course){
        res.status(200).json(course);
    } else {
        res.status(404).json({ message: 'Course not found'});
    }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/course -Create a new course
router.post('/', async (req, res) => {
    try {
        const newCourse = await Course.create(req.body);
        res.status(201).location(`/api/course/${newCourse.id}`).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });
    } else {
        res.status(500).json({ message: error.message });
    }
}
});

// PUT /api/courses/:id - Update a course
router.put('/:id', async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            await course.update(req.body);
            res.status(204).end();
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });
    } else {
        res.status(500).json({ message: error.message });
    }
    }
}); 

// DELETE /api/course/:id - Delete a course
router/this.delete('/:id', async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            await course.destroy();
            res.status(204).end();
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { Course, User } = require('../models');
const { authenticateUser } = require('../middleware/auth-user');
const { asyncHandler } = require('../middleware/async-handler');

//GET/api/courses - Get all courses
router.get('/', asyncHandler(async (req, res) => {
    //get all courses with associated user data
    const courses = await Course.findAll({
        //Include only necessary user attributes
        include: [{ model: User, attributes: ['id', 'firstName', 'lastName', 'emailAddress'] }],
    });
    //return courses
    res.status(200).json(courses);
    //} catch (error) {
    //handle errors
    //res.status(500).json({ message: error.message });
    //}
}));

//GET /api/courses/:id - Get a specific course 
router.get('/:id', asyncHandler(async (req, res) => {
    //find the course by ID with user data
    const course = await Course.findByPk(req.params.id, {
        include: {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'emailAddress'] //Include only necessary user attirbutes
        }
    });
    //check if course exists
    if (!course) {
        //return course
        res.status(200).json(course);
    } else {
        //return if course not found
        return res.status(404).json({ message: 'Course not found' });
    }
}));

// POST /api/course -Create a new course
router.post('/', authenticateUser, asyncHandler(async (req, res) => {
    try {
        //create a new course
        const course = await Course.create(req.body);

        //set location header to the URI for the newly created course
        res.location(`/api/courses/${course.id}`).status(201).end();
    } catch (error) {
        //handle validation errors
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            //handle other errors
            res.status(500).json({ message: error.message });
        }
    }
}));

// PUT /api/courses/:id - Update a course
router.put('/:id', authenticateUser, asyncHandler(async (req, res) => {
    try {
        //find the course by ID
        const course = await Course.findByPk(req.params.id);

        //check if course exists
        if (course) {
            //update the course
            await course.update(req.body);
            //return 204 status code and no content
            res.status(204).end();
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        //handle validation errors
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            //handle other errors
            res.status(500).json({ message: error.message });
        }
    }
}));

// DELETE /api/course/:id - Delete a course
router.delete('/:id', authenticateUser, asyncHandler(async (req, res) => {
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
}));

module.exports = router;
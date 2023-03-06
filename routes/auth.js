const router = require('express').Router();
const User = require('../models/User');
const authService = require('../services/authService');
const {COOKIE_SESSION_NAME} = require('../constants');

//Register
router.post('/register', async (req,res) => {
    const newUser = new User({
        email: req.body.email,
        password: req.body.password,
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
    } catch (err) {
        res.status(500).json(err)
        console.log(err);
    }
});

//Login
router.post('/login', async (req,res) => {
    const { email , password } = req.body;

    try {
        const user = await authService.login(email, password);

        const token = await authService.createToken(user);
    
        console.log('Token ' + token);
        res.cookie(COOKIE_SESSION_NAME, token, {httpOnly: true});
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)

    }
})

module.exports = router;

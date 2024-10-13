const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models/index'); 
const Jwt = require("../jwtauth/jwttoken");
const logger = require('../winstonconfig/winston');
const router = express.Router(); 

router.post('/register', async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, phone });

        logger.info(`User registered: ${email}`);
        res.json({
            status: true,
            message: "Data successfully saved",
            user
        });
    } catch (err) {
        logger.error(`Error registering user: ${err.message}`);
        res.json({
            status: false,
            err: err.message,
            message: "User data not saved"
        });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            logger.warn(`Login attempt failed: User not found for email ${email}`);
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn(`Login attempt failed: Invalid password for email ${email}`);
            return res.status(401).json({
                status: false,
                message: "Invalid password"
            });
        }

        const userId = user.id;
        const token = Jwt.generateAccessToken(userId);
        logger.info(`User logged in successfully: ${email}`);
        res.json({
            status: true,
            message: "Login successful",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone
            },
            token
        });
    } catch (err) {
        logger.error(`Error during login: ${err.message}`);
        res.status(500).json({
            status: false,
            err: err.message,
            message: "Login failed"
        });
    }
});

module.exports = router;

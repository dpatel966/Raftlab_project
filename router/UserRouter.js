const express = require('express');
const router = express.Router();
const { User } = require('../models/index');
const logger = require('../winstonconfig/winston'); 

router.get('/list', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json({
            status: true,
            message: "User data found",
            users
        });
        logger.info('User list retrieved successfully'); 
    } catch (error) {
        logger.error(`Error retrieving user list: ${error.message}`); 
        res.status(500).json({
            status: false,
            error: error.message,
            message: "Data not found"
        });
    }
});

router.get('/details', async (req, res) => {
    const { page = 1, limit = 10, sort = 'id', order = 'ASC' } = req.query;
    const validSortFields = ['id', 'name', 'email', 'phone']; 
    const selectedSort = validSortFields.includes(sort) ? sort : 'id'; 

    try {
        const users = await User.findAll({
            limit: parseInt(limit, 10),
            offset: (page - 1) * parseInt(limit, 10),
            order: [[selectedSort, order]],
        });

        res.json({
            status: true,
            message: "User data retrieved successfully",
            users,
        });

        logger.info(`User details retrieved: page ${page}, limit ${limit}, sort ${selectedSort}, order ${order}`); 
    } catch (error) {
        logger.error(`Error fetching user details: ${error.message}`); 
        res.status(500).json({ error: 'Error fetching users', details: error.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const data = await User.findByPk(userId);

        if (data == null) {
            logger.warn(`User not found: ${userId}`);
            return res.status(404).json({
                status: false,
                data,
                message: "User not found"
            });
        } else {
            await data.destroy();
            logger.info(`User deleted successfully: ${userId}`); 
            res.json({
                status: true,
                data,
                message: "User deleted successfully"
            });
        }
    } catch (err) {
        logger.error(`Failed to delete user: ${err.message}`); 
        res.status(500).json({
            status: false,
            error: err.message,
            message: "Failed to delete user"
        });
    }
});

router.put('/update/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, email, phone } = req.body;

    try {
        const user = await User.update(
            { name, email, phone },
           { where:{id:userId}});

        if (user == 0) {
            logger.warn(`User not found for update: ${userId}`);
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        logger.info(`User updated successfully: ${userId}`);
        res.json({
            status: true,
            message: "User updated successfully",
            user
        });
    } catch (err) {
        logger.error(`Failed to update user: ${err.message}`);
        res.status(500).json({
            status: false,
            error: err.message,
            message: "Failed to update user"
        });
    }
});

module.exports = router;

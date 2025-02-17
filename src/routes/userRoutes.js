const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
console.log('Setting up users routes');

//all controller methods 
router.get('/search', userController.searchUsers);  // Query-based search


router.get('/', userController.getAllUsers);
router.get('/user', userController.getAllUsers);
router.get('/:id', userController.getUser);
;
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router; 
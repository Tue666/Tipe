const express = require('express');
const router = express.Router();

// controllers
const accountsAPI = require('../app/controllers/AccountsAPI');
// middlewares
const verifyToken = require('../app/middlewares/verifyToken');
const upload = require('../app/middlewares/upload');

router.delete('/addresses/:_id', verifyToken, accountsAPI.removeAddress);
router.patch('/addresses/switch-default/:_id', verifyToken, accountsAPI.switchDefault);
router.put('/addresses', verifyToken, accountsAPI.editAddress);
router.put('/:_id', upload(false).single('avatar_url'), accountsAPI.update);
router.post('/addresses', verifyToken, accountsAPI.insertAddress);
router.get('/refresh-token', accountsAPI.refreshToken);
router.post('/social/login', accountsAPI.socialLogin);
router.post('/sign-in', accountsAPI.login);
router.post('/sign-up', accountsAPI.register);
router.post('/verify-exist', accountsAPI.checkExist);
router.post('/', upload(false).single('avatar_url'), verifyToken, accountsAPI.create);
router.get('/profile', verifyToken, accountsAPI.getProfile);
router.get('/verify-token', verifyToken);
router.get('/:type', verifyToken, accountsAPI.findAllByType);

module.exports = router;

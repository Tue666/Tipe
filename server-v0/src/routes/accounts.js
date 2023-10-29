const express = require('express');
const router = express.Router();
const accountsAPI = require('../app/controllers/AccountsAPI');
const verifyToken = require('../app/middlewares/verifyToken');

router.delete('/addresses/:_id', verifyToken, accountsAPI.removeAddress);
router.patch('/addresses/switch-default/:_id', verifyToken, accountsAPI.switchDefault);
router.put('/addresses', verifyToken, accountsAPI.editAddress);
router.post('/addresses', verifyToken, accountsAPI.insertAddress);
router.post('/sign-in', accountsAPI.signIn);
router.post('/sign-up', accountsAPI.signUp);
router.post('/verify-exist', accountsAPI.verifyExist);
router.get('/profile', verifyToken, accountsAPI.getProfile);
router.get('/refresh-token', accountsAPI.refreshToken);
router.get('/verify-token', verifyToken, accountsAPI.verifyToken);

module.exports = router;

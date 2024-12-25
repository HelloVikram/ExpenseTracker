const express = require('express');
const router = express.Router();
const passwordcontroller=require('../controller/password');

router.post('/password/forgotpassword',passwordcontroller.fogotpassword);

router.get('/password/resetpassword/:id',passwordcontroller.resetpassword);

router.get('/password/updatepassword/:id',passwordcontroller.updatepassword);

module.exports=router;
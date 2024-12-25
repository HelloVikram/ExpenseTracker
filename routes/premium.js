const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const premiumcontroller=require('../controller/premium');

router.get('/premium/leaderboard',authenticate.authenticate,premiumcontroller.leaderboard);

module.exports=router;
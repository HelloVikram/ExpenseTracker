const user=require('../models/signup');
const Sequelize = require('sequelize');
const sequelize=require('../util/database');
const leaderboard=async(req,res)=>{
    try{
       const aggregate= await user.findAll({
         attributes:['name','totalExpense'],
         order:[['totalExpense','DESC']]
       })
       res.status(200).json(aggregate);
    }catch(err){
       console.log("Error in fatchig leaderboard",err);
    }
    }
    module.exports={leaderboard}
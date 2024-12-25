const Sequilize=require('sequelize');
const sequelize=require('../util/database');

const orders=sequelize.define('orders',{
    id:{
        type:Sequilize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        unique:true,
        allowNull:true
    },
    paymentId:Sequilize.STRING,
    orderId:Sequilize.STRING,
    status:Sequilize.STRING
})
module.exports=orders;
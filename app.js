const express=require('express');
const app=express();
require('dotenv').config();
const userroutes=require('./routes/user');
const expenseroutes=require('./routes/expense');
const purchaseroutes=require('./routes/purchase');
const premiumroutes=require('./routes/premium');
const passwordroutes=require('./routes/forgetpassword');

const user=require('./models/signup');
const expense=require('./models/expense');
const orders=require('./models/orders');
const ForgotPasswordRequests=require('./models/forgetpassword');
const savedurls=require('./models/savedurl');

const fs=require('fs');
const path=require('path')
const { v4: uuidv4 } = require('uuid');
uuidv4();

const cors=require('cors');
app.use(cors());

const db=require('./util/database');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,'public')));

app.get('/expense', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'expense.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use(userroutes);
app.use(expenseroutes);
app.use(purchaseroutes);
app.use(premiumroutes);
app.use(passwordroutes);

user.hasMany(expense);
expense.belongsTo(user);

user.hasMany(orders);
orders.belongsTo(user);

user.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(user);

user.hasMany(savedurls);
savedurls.belongsTo(user);

async function database() {
    try{
        await db.sync({force:false});
        app.listen(process.env.PORT);
   console.log("database sync successfull...");
    }catch(err){
        console.log("Error in syncing database",err)
    }
}
database();



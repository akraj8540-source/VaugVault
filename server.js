require('dotenv').config();
const app  = require('./src/app');
const connectDB = require('./src/config/db');
const dbgr = require('debug')('app:server');
//console.log("JWT_SECRET =", process.env.JWT_SECRET);


connectDB();


app.listen(3000, () => {
    console.log('server is running on port 3000');
    dbgr('server is running on port 3000');
})

/* 
To run the server:
      USER
POST http://localhost:3000/user/register 
POST http://localhost:3000/user/login
GET http://localhost:3000/user/me
POST http://localhost:3000/user/logout

        OWNER
POST http://localhost:3000/owner/register
POST http://localhost:3000/owner/login
GET http://localhost:3000/owner/me
POST http://localhost:3000/owner/logout

product
GET http://localhost:3000/product
GET http://localhost:3000/product?keyword=shirt
GET http://localhost:3000/product/:id

create product (owner only)
POST http://localhost:3000/product
update product (owner only)
PUT http://localhost:3000/product/:id
delete product (owner only)
DELETE http://localhost:3000/product/:id

cart
POST http://localhost:3000/cart/add
GET http://localhost:3000/cart
DELETE http://localhost:3000/cart/remove/:id
order
POST http://localhost:3000/order/create
GET http://localhost:3000/order



*/
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require ('passport');
const v1 = require('./routes/v1');
const app = express();
// db configration
mongoose.connect(process.env.MONGO_DB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true,
    


});
mongoose.connection.on('connected',()=>{
    console.log('connected to the database');
});
mongoose.connection.on('error',(err)=>{
    console.error(`failed to connect to db: ${err}`);
});
// middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

//Routes
app.use('/api/v1',v1);

//errors
app.use((req,res,next)=>{
    var err = new Error('not found');
    err.status = 404;
    next(err);
    });
    app.use((err,req,res,next)=>{
        const status = err.status || 500;
        const error = err.message || 'error processing ur req';
        res.status(status).send({
            error
        })

    });

module.exports=app;
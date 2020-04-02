const express = require('express');
const bodyParser = require('body-parser');

const graphqlHttp = require('express-graphql'); 
const mongoose=require('mongoose');

const graphQLSchema= require('./graphql/schema/index.js');
const graphQLResolvers= require('./graphql/resolvers/index');
const isAuth=require('./middileware/is-auth');

//graphqlHttp here happened to be a function that can we used in a place where express expects a middileware function

const app=express();

app.use(bodyParser.json());

app.use(isAuth);
//single endpoint of graphql
// property  : type(in right side of colon) of property
app.use('/graphql',graphqlHttp({
   schema:graphQLSchema,
   rootValue:graphQLResolvers ,
    graphiql:true             

}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-zvhey.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,{ useNewUrlParser: true , useUnifiedTopology: true })
.then(()=>{
    app.listen(3000);
})
.catch(err =>{
    console.log(err);
})
 
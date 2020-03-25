const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql'); 
const {buildSchema} = require('graphql');
//graphqlHttp here happened to be a function that can we used in a place where express expects a middileware function

const app=express();

app.use(bodyParser.json());
//single endpoint of graphql
app.use('/graphql',graphqlHttp({
   schema:buildSchema(` 

   type RootQuery{
      events: [String!]!    
   }  

   type RootMutation{
     createEvent(name:String) : String
   }

   schema{
       query:RootQuery
       mutation:RootMutation
   }     
   `),                            //backticks allow us to write a multiline string in JS.
                          //this will point at the object which has all the resolvers functions in it.
    rootValue:{
        events: ()=>{   //Resolver is  just a function which is called for u by the express-graphql pacakge at the end when the incoming request looks for the property events
            return ['Romantic Cooking', 'Sailing','All-night-Coding']
        },
        createEvent:(args) =>{
        const  eventName=args.name;
        return eventName;
        }
    },
    graphiql:true             

}));

 
app.listen(3000);
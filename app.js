const express = require('express');
const bodyParser = require('body-parser');
const bcyrpt=require('bcrypt'); 

const graphqlHttp = require('express-graphql'); 
const {buildSchema} = require('graphql');
const mongoose=require('mongoose');
const Event=require('./models/event');
const User=require('./models/user');

//graphqlHttp here happened to be a function that can we used in a place where express expects a middileware function

const app=express();


app.use(bodyParser.json());
//single endpoint of graphql
// property  : type(in right side of colon) of property
app.use('/graphql',graphqlHttp({
   schema:buildSchema(` 
   type Event {
       _id:ID!
       title: String!
       description:String!
       price:Float!
       date: String!
   }

   type User{
       _id:ID!
       email:String!
       password:String
   }

   input UserInput {
       email:String!
       password:String!
   }

   input EventInput {
       title:String!
       description:String!
       price:Float!
       date:String!
   }

   type RootQuery{
      events: [Event!]!    
   }  

   type RootMutation{
     createEvent(eventinput:EventInput) : Event
     createUser(userinput:UserInput) : User
   }

   schema{
       query:RootQuery
       mutation:RootMutation
   }     
   `),                            //backticks allow us to write a multiline string in JS.
             //this will point at the object which has all the resolvers functions in it.
    rootValue:{
        events: ()=>{   //Resolver is  just a function which is called for u by the express-graphql pacakge at the end when the incoming request looks for the property events
            return Event.find()
            .then(events =>{
                return events.map(event => {
                    return{ ...event._doc };
                });
            })
            .catch(err =>{
                throw err;
            })
        },
        createEvent:(args) =>{
        const event=new Event({
            title:args.eventinput.title,
            description:args.eventinput.description,
            price:+args.eventinput.price,        
            date:new Date(args.eventinput.date),
            creator:'5e836a1adf90c86e68e79e4c'      
        })
        let createdEvent;
           return event.save().then(result =>{
            createdEvent={ ...result._doc};
               return User.findById('5e836a1adf90c86e68e79e4c');  
            })
            .then(user =>{
                if(!user)
                {
                    throw new Error('User not found');
                }
                user.createdEvents.push(event);
                return user.save();
            })
            .then(result =>{
                return createdEvent ;
            })
            .catch(err =>{
                 console.log(err);
                 throw err;
            });     
        },
        createUser :async (args) => {
            const userexist= await User.findOne({email:args.userinput.email});
            if(userexist)
            {
                throw new Error('user already exist');
            }
            const hashedPassword= await bcyrpt.hash(args.userinput.password,12)
            
            const user= await new User({
                email:args.userinput.email,
                password:hashedPassword
            })

            return user.save().then(result =>{
                return {...result._doc,password:null};      //we set password:null bcz we don't want to send password back.
            })
            .catch(err =>{
                console.log(err);
                throw err;
           });
        }
    },
    graphiql:true             

}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-zvhey.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,{ useNewUrlParser: true , useUnifiedTopology: true })
.then(()=>{
    app.listen(3000);
})
.catch(err =>{
    console.log(err);
})
 
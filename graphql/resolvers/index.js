const bcyrpt=require('bcrypt'); 
const Event=require('../../models/event');
const User=require('../../models/user');

const events=async (eventIDs) => {                                //eventIDs is an array passed as a parameter.
    try{
    const events=await Event.find({_id:{$in:eventIDs}})
    const returnedevents =events.map(event =>{
            return {...event._doc,
                date:new Date(event._doc.date).toISOString(),
                creator:user.bind(this,event.creator)
            };
        })
        return returnedevents;
    }
    catch(err){
        throw err;
    }
}


const user= (userId) => {               //function which will return the user by ID.
    return User.findById(userId)
    .then(user => {
        return {...user._doc,
        createdEvents:events.bind(this,user._doc.createdEvents)
    };
    })
    .catch(err =>{
        throw err;
    })
}


module.exports={
    events: async()=>{   //Resolver is  just a function which is called for u by the express-graphql pacakge at the end when the incoming request looks for the property events
     try{
          const events=await Event.find();
            const returnedvents= events.map(event => {
                return{ ...event._doc,
                    date:new Date(event._doc.date).toISOString(),
                creator:user.bind(this,event._doc.creator)          //manually populating. will not create infinite loop(It will deep until we query ) but if we do using populate infinite loop is created.
                };                                               // ,creator :{...event._doc.creator}
            });
            return returnedvents;
        }
        catch(err){
            throw err;
        }
    },
    createEvent:async (args) =>{
     try{
        const event=new Event({
        title:args.eventinput.title,
        description:args.eventinput.description,
        price:+args.eventinput.price,        
        date:new Date(args.eventinput.date),
        creator:'5e836a1adf90c86e68e79e4c'      
    })
    let createdEvent;
       const result= event.save();
        createdEvent={ ...result._doc,
        date:new Date(event._doc.date).toISOString(),
        creator:user.bind(this,event._doc.creator) 
        };
           const creator= await User.findById('5e836a1adf90c86e68e79e4c');  
        
            if(!creator)
            {
                throw new Error('User not found');
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        }
        catch(err){
             console.log(err);
             throw err;
        };     
    },
    createUser :async (args) => {
       try {
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
    }
        catch(err) {
            console.log(err);
            throw err;
       };
    }
}
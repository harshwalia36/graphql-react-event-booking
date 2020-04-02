const Event=require('../../models/event');
const {dateToString}=require('../../helpers/date');
const {user}=require('./merge');
const {transformEvent}=require('./merge');


module.exports={
    events: async()=>{   //Resolver is  just a function which is called for u by the express-graphql pacakge at the end when the incoming request looks for the property events
     try{
          const events=await Event.find();
            const returnedvents= events.map(event => {
                return transformEvent(event);                                            // ,creator :{...event._doc.creator}
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
       const result= await event.save();
        createdEvent={ ...result._doc,
        date:dateToString(event._doc.date),
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
    }
}
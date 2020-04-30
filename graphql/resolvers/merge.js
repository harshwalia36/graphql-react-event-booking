const Event=require('../../models/event');
const User=require('../../models/user');
const {dateToString}=require('../../helpers/date');


const events=async (eventIDs) => {                                //eventIDs is an array passed as a parameter.
    try{
    const events=await Event.find({_id:{$in:eventIDs}})
    const returnedevents =events.map(event =>{
            return transformEvent(event);
        })
        return returnedevents;
    }
    catch(err){
        throw err;
    }
}

const singleEvent=async (eventId) => {                                //eventIDs is an array passed as a parameter.
    try{
    const event=await Event.findById(eventId)
    return transformEvent(event);
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

const transformEvent = event => {
    return {
      ...event._doc,
      _id: event.id,
      date: dateToString(event._doc.date),
      creator: user.bind(this, event.creator)
    };
  };
  

exports.transformEvent=transformEvent;
exports.user=user;
// exports.events=events;
exports.singleEvent=singleEvent;
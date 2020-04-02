const Booking=require('../../models/booking');
const Event=require('../../models/event');

const {dateToString}=require('../../helpers/date');
const {user,singleEvent}=require('./merge');
const {transformEvent}=require('./merge');


module.exports={
    bookings: async(req) =>{
        if(!req.isAuth)
       {
           throw new Error('Unauthenticated');
       }
        try{
            const bookings=await Booking.find();
            const returnedBookings=bookings.map(booking =>{
                return{...booking._doc,
                user:user.bind(this,booking._doc.user),
                event:singleEvent.bind(this,booking._doc.event),
                createdAt:dateToString(booking._doc.createdAt),
                updatedAt:dateToString(booking._doc.updatedAt)
                }
            })
            return returnedBookings;
        }
        catch(err){
            throw err;
        }
    },
    bookEvent: async(args) =>{
        if(!req.isAuth)
        {
            throw new Error('Unauthenticated');
        }
       try {
        const fetchedEvent=await Event.findOne({_id:args.eventId});
        const booking= new Booking({
            user:req.userId,
            event:fetchedEvent
        });

        const result=await booking.save();
        return{ ...result._doc,
            user:user.bind(this,booking._doc.user),
            event:singleEvent.bind(this,booking._doc.event),
            createdAt:dateToString(booking._doc.createdAt),
            updatedAt:dateToString(booking._doc.updatedAt)
        };
    }
    catch(err){
        throw err;
    }
    },
    cancelBooking: async args => {
        if(!req.isAuth)
        {
            throw new Error('Unauthenticated');
        }
        try {
          const booking = await Booking.findById(args.bookingId).populate('event').populate('user');
          const event =  transformEvent(booking.event);
          await Booking.deleteOne({ _id: args.bookingId });
          return event;
        } catch (err) {
          throw err;
        }
      }
}
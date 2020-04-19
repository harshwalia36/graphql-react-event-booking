const authResolver=require('./auth');
const bookingResolver=require('./booking');
const eventsResolver=require('./event');


const rootResolver={
    ...authResolver,        //spread operator is used to spread all the fields.
    ...bookingResolver,
    ...eventsResolver
};

module.exports=rootResolver;
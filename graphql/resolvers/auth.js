const bcyrpt=require('bcrypt'); 
const User=require('../../models/user');

module.exports={
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
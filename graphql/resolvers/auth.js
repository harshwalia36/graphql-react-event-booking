const bcyrpt=require('bcrypt'); 
const User=require('../../models/user');
const jwt=require('jsonwebtoken');

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
    },
    login: async ({email,password}) =>{
        const user= await User.findOne({email:email});
        if(!user){
            throw new Error('user already exist');
        }
        const isequal=await bcyrpt.compare(password,user.password);
        if(!isequal)
        {
            throw new Error('password is incorrect');
        }
       const token= jwt.sign({userId:user.id ,email:user.email},'somesupersecretkey',{expiresIn:'1h'});
       return {userId:user.id,token:token,tokenExpiration:1};
    }
}
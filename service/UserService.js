const model=require('../configs/model');

let User=model.User;

function newUser(email,password) {
    this.email=email;
    this.password=password;
}

module.exports={
    signin: async (name,password)=>{
        let user=await User.find({
            where:{
                name:name
            }
        });
        if(user && user.password===password){
            return user;
        }
        return null;
    },
    register: async (email,name,password)=>{
        let user=await User.create({
            email:email,
            name:name,
            password:password
        });
        return user;
    }
};
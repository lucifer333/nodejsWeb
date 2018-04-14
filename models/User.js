const db=require('../configs/db');

module.exports=db.defineModel('users',{
    email:{
        type:db.STRING(100),
        unique:true
    },
    name:{
        type:db.STRING(100),
        unique:true
    },
    password:db.STRING(100)
});
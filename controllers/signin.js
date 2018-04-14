const UserService=require('../service/UserService');
const APIError=require('../common/rest');

module.exports={
  'POST /signin':async (ctx, next)=>{
        await UserService.signin(ctx.request.body.name,
            ctx.request.body.password).then(await ((user)=>{
            console.log('user:'+JSON.stringify(user));
            if(user){
                console.log('signin ok!')
                ctx.render('signin-ok.html',{
                    title:'Sign In OK',
                    name:user.name,
                    operation:'sign in'
                });
            }else{
                console.log('signin failed!');
                ctx.render('signin-failed.html',{
                    title:'Sign In Failed'
                });
            }
        }));
  },
  'POST /register':async (ctx,next)=>{
      await UserService.register(ctx.request.body.email,ctx.request.body.name,
          ctx.request.body.password).then(await ((user)=>{
          console.log('user:'+JSON.stringify(user));
          if(user){
              console.log('register ok!')
              ctx.render('signin-ok.html',{
                  title:'register OK',
                  name:user.name,
                  operation:'register'
              });
          }else{
              console.log('register failed!');
              ctx.render('signin-failed.html',{
                  title:'register Failed'
              });
          }
      }));
  }
};
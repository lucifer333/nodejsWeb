"use strict";

require('babel-core/register')({
    presets:['stage-3']
});

const model=require('./model');
model.sync().then(()=>{
    console.log('init db ok.');
    process.exit(0);
}).catch((e)=>{
    console.log(`init db failed:${e}`)
    process.exit(0);
});


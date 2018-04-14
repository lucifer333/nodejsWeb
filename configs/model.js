//scan all models defined in models
const fs=require('fs');
const db=require('./db');
const path=require('path');

//通过path.resolve(__dirname,'..')获取上一级目录
let modelFolder=path.resolve(__dirname,'..')+'/models';
let files=fs.readdirSync(modelFolder);

let js_files=files.filter((f)=>{
    return f.endsWith('.js');
}, files);

module.exports={};

for (let f of js_files){
    console.log(`import model from file ${f}...`);
    let  name=f.substring(0,f.length-3);
    module.exports[name]=require(path.join(modelFolder,f));
}

module.exports.sync=()=>{
    return db.sync();
};
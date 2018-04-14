const Sequelize=require('sequelize');

const config=require('./config');

console.log('init sequelize...');

const Op = Sequelize.Op;
const operatorsAliases = {
    $eq: Op.eq,
    $ne: Op.ne,
    $gte: Op.gte,
    $gt: Op.gt,
    $lte: Op.lte,
    $lt: Op.lt,
    $not: Op.not,
    $in: Op.in,
    $notIn: Op.notIn,
    $is: Op.is,
    $like: Op.like,
    $notLike: Op.notLike,
    $iLike: Op.iLike,
    $notILike: Op.notILike,
    $regexp: Op.regexp,
    $notRegexp: Op.notRegexp,
    $iRegexp: Op.iRegexp,
    $notIRegexp: Op.notIRegexp,
    $between: Op.between,
    $notBetween: Op.notBetween,
    $overlap: Op.overlap,
    $contains: Op.contains,
    $contained: Op.contained,
    $adjacent: Op.adjacent,
    $strictLeft: Op.strictLeft,
    $strictRight: Op.strictRight,
    $noExtendRight: Op.noExtendRight,
    $noExtendLeft: Op.noExtendLeft,
    $and: Op.and,
    $or: Op.or,
    $any: Op.any,
    $all: Op.all,
    $values: Op.values,
    $col: Op.col
};

let sequelize=new Sequelize(config.database,config.username,config.password,{
    host:config.host,
    dialect:config.dialect,
    pool:{
        max:5,
        min:0,
        idle:10000
    },
    operatorsAliases
});

const ID_TYPE=Sequelize.BIGINT;

function defineModel(name, attributes) {
    let attrs={};
    for (let key in attributes){
        let value=attributes[key];
        if(typeof value==='object' && value['type']){
            value.allowNull=value.allowNull || false;
            attrs[key]=value;
        }else{
            attrs[key]={
                type:value,
                allowNull:false
            };
        }
    }
    attrs.id={
        type:ID_TYPE,
        autoIncrement:true,
        primaryKey:true
    };
    attrs.createAt={
        type:Sequelize.DATE,
        allowNull:false
    };
    attrs.updateAt={
        type:Sequelize.DATE,
        allowNull:false
    };
    attrs.version={
        type:Sequelize.BIGINT,
        allowNull:false
    };
    console.log('model defined fot table: '+name+'\n'+JSON.stringify(attrs,function (k,v) {
        if(k==='type'){
            for(let key in Sequelize){
                if(key==='ABSTRACT' || key==='NUMBER'){
                    continue;
                }
                let  dbType=Sequelize.DataTypes[key];
                if(typeof dbType === 'function'){
                    if(v instanceof dbType){
                        if(v._length){
                            return `${dbType.key}(${v._length})`;
                        }
                        return dbType.key;
                    }
                    if(v===dbType){
                        return dbType.key;
                    }
                }
            }
        }
        return v;
    },'  '));

    return sequelize.define(name,attrs,{
        tableName:name,
        timestamps:false,
        hooks:{
            beforeValidate:function (obj) {
                let now=Date.now();
                if(obj.isNewRecord){
                    console.log('will create entity...'+obj);
                    obj.createAt=now;
                    obj.updateAt=now;
                    obj.version=0;
                }else{
                    console.log('will update entity...');
                    obj.updateAt=now;
                    obj.version++;
                }
            }
        }
    });
}

const TYPES=['STRING','INTEGER','BIGINT','TEXT','DOUBLE','DATEONLY','BOOLEAN'];

let  exp={
    defineModel:defineModel,
    sync:()=>{
        //only allow create ddl in non-production environment
        if(process.env.NODE_ENV!=='prodution'){
            return sequelize.sync({force:true});
        }else{
            throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
        }
    }
};

for(let type of TYPES){
    exp[type]=Sequelize[type];
}

exp.ID=ID_TYPE;

module.exports=exp;

















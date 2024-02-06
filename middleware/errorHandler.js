const {ValidationError}=require('joi');
const CustomErrorHandler = require('../Services/CustomErrorHandler');
CustomErrorHandler
const errorHandler=(err,req,res,next)=>{
    console.log(err,'err')
    let statuesCode=500;
    let data={
        message:'Internal server error',
        ...(process.env.DEBUG_MODE==='true' && {originalError:err.message})
    }
    if(err instanceof ValidationError){
        statuesCode=422;
        data={
            message:err.message
        }
    }
    if(err instanceof CustomErrorHandler){
        statuesCode=err.status;
        data={
            message:err.msg
        }
    }
    return res.status(statuesCode).json(data)
}
module.exports=errorHandler
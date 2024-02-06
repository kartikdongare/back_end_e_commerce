const auth=async(req,res,next)=>{
    console.log(req.headers.authorization)
    const access_token=req.headers.authorization
    
    next()
}
module.exports=auth
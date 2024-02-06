const jwt=require('jsonwebtoken')
class JWTService{
    static sign(data,expiry='60s',secret_key=process.env.JWT_KEY){
        return jwt.sign(data,secret_key,{expiresIn:expiry})
    }
}
module.exports=JWTService
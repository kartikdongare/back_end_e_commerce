
const mongoose=require('mongoose')
const RefreshTokenKey=mongoose.Schema({
    refresh_token:{
        type:String,
        unique:true
    },
},
{timestamps:false}
)
module.exports=mongoose.model('refreshToken',RefreshTokenKey)
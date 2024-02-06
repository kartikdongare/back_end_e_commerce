const Joi = require("joi");
const AdminUser = require("../../model/adminUserSchema");
const CustomErrorHandler = require("../../Services/CustomErrorHandler");
const bcrypt = require("bcrypt");
const JWTService = require("../../Services/JWTService");
const RefreshTokenKey=require('../../model/refreshToken')

const register = async (req, res, next) => {
  const registerVal = Joi.object({
    name: Joi.string().min(3).max(10).required(),
    email: Joi.string().email().required(),
    mobile_no: Joi.number().required(),
    username: Joi.string().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    confirm_password: Joi.ref("password"),
  });

  const { error } = registerVal.validate(req.body);
  if (error) {
    // console.log(error.details[0].message)
    return next(error);
  }
  // if user already exist or not
  // console.log(req.body,'req')
  try {
    const exist = await AdminUser.exists({ email: req.body.email });
    console.log(exist, "exist");
    if (exist) {
      return next(
        CustomErrorHandler.alreadyExitAdmin("This is already taken email")
      );
    }
  } catch (error) {
    return next(error);
  }
  //add data
  const { name, email, mobile_no, username, password, confirm_password } =
    req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  const addData = await AdminUser.create({
    name,
    email,
    mobile_no,
    username,
    password: hashPassword,
  });

  let access_token;
  let refresh_token;
  try {
    const res = await addData.save();
    console.log(process.env.SECREATE_KEY)
    access_token=JWTService.sign({_id:res._id,role:res.role})
    refresh_token=JWTService.sign({_id:res._id,role:res.role},'1y',process.env.REFRESH_KEY)
   const reToken=  await RefreshTokenKey.create({
    refresh_token:refresh_token
    })
  // console.log(reToken,'reToken')

  } catch (error) {
    return next(error);
  }
  res.json({access_token,refresh_token});
};


const login=async(req,res,next)=>{

  //validation
  const loginUser=Joi.object({
    email:Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  })

  const {error}=loginUser.validate(req.body);
  if(error){
    return next(error)
  }
  try {
    // checking email id is exist or not
    const admin_user=await AdminUser.findOne({email:req.body.email})
    if(!admin_user){
      return next(next(CustomErrorHandler.wrongCredentials()))
    }
    //checking password is correct or not
    const validatePass=await bcrypt.compare(req.body.password,admin_user.password)
    if(!validatePass){
      return next(next(CustomErrorHandler.wrongCredentials()))
    }

    //generate token
    const access_token=JWTService.sign({_id:admin_user._id,role:admin_user.role});
    const refresh_token=JWTService.sign({_id:admin_user._id,role:admin_user.role},'1y',process.env.REFRESH_KEY);

    await RefreshTokenKey.create({
      refresh_token:refresh_token
      })
    res.json({access_token,refresh_token})
  } catch (error) {
    return next(error)
  }
}

const me=(req,res,next)=>{
res.json({msg:'me'})
}
module.exports = { register ,login,me};

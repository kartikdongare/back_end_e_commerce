const express=require('express')
const router=express.Router();
const {register,login,me}=require('../Controller/auth')
const auth=require('../middleware/auth')
router.post('/register',register)
router.post('/login',login)
router.post('/me',auth,me)

module.exports=router
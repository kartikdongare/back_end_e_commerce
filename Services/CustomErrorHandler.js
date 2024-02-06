class CustomErrorHandler extends Error {
  constructor(status, msg) {
    super();
    this.status = status,
    this.msg = msg;
  }
  static alreadyExitAdmin(message){
    return new CustomErrorHandler(409,message)
  }
  static wrongCredentials(message='wrong email or password!'){
    return new CustomErrorHandler(402,message)
  }
}
module.exports=CustomErrorHandler
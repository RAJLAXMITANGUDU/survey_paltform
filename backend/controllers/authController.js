import * as UserService from '../services/userService.js';
import { generateToken } from '../utils/token.js';

export const register = async (req, res,next) => {
  try {
    const { name, password, email } = req.body;

    const existUser=await UserService.findUserByEmail(email);
    
    if(existUser){
       return res.status(400).json(
            {
  "success": false,
  "message": "Email already exists",
  "errors": {
    "email": ["This email is already registered"]
  }
}
        )
    }

    const user = await UserService.add({ name, password, email });

    const payload = {
      userId: user._id,
      email: user.email,
    };

    const token = generateToken(payload);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,                 
          email: user.email,
          name: user.name,          
          created_at: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const login=async(req,res,next)=>{
try {
  const {email,password}=req.body;

  const user=await UserService.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
        "errors": {
        "user": ["Invalid Email or password"],
                  }         
      });
    }

    const comparePassword=await user.comparePassword(password);
    if(!comparePassword){
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
        "errors": {
        "password": ["Invalid Email or password"],
                  }         
      });
    }

    const token = generateToken({ userId: user._id, email: user.email });

     return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        token,
      },
    });


} catch (error) {
  return next(error);
}
}


export const getMe=async(req, res, next) =>{
  try {
    
    const user = req.user;
    return res.status(200).json({
  "success": true,
  "data": {
    "user": {
      "id": user._id,
      "email": user.email,
      "name": user.name,
      "created_at": user.createdAt
    }
  }
});
  } catch (err) {
    return next(err);
  }
}
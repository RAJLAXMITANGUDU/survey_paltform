import jwt from 'jsonwebtoken';

import { findUserById } from '../services/userService.js';

const authenticateToken=async(req,res,next)=>{
const authHeader=req.header.authorization || "";
const token=authHeader.startsWith("Bearer")? authHeader.split(" ")[1]:null;

// Token validation
if(!token){
    return res.status(401)
    .json({ success: false, message: 'Authentication required' });
}

//Find user and attach with request object
try {
    const decodedToken=jwt.verify(token,process.env.JWT_SECRET);
    const {userId,email}=decodedToken;
    const user=await findUserById(userId);

    if (!user) {
      return res.status(401)
      .json({ success: false, message: 'User not found' });
    }

    req.user=user;

} catch (error) {
    return res.status(401).json({ success: false, 
        message: 'Invalid or expired token' });
  }
}

export default authenticateToken;
const jwt=require('jsonwebtoken');

const authMiddleware=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader||!authHeader.startsWith('Bearer ')){
        return res.status(401).json({
            success:false,
            message:'Authorization header missing or malformed'
        })
    }
    const token=authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success:false,
            message:'Authorization header missing or malformed'
        })
    }
    try{
        const decode=jwt.verify(token,process.env.JWT_SECRET||'secretkey');
        req.user=decode;
        next(); //proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({
            success:false,
            message:'Invalid or expired token'
        })
    }

}
module.exports = authMiddleware;
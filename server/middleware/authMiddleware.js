const jwt=require('jsonwebtoken');

const authMiddleware=(req,res,next)=>{
    authHeader=req.headers.authorization;
    if(!authHeader||!authHeader.startswith('Bearer')){
        res.status(401).json({
            success:false,
            message:'Authorization header missing or malformed'
        })
    }
    const token=authHeader.split(' ')[1];
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
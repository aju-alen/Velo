import jwt from 'jsonwebtoken'
export const verifyToken = (req,res,next)=>{
console.log('Inside middleware');

    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    
    
    if (!token) return res.status(401).send("You are not authenticated!");

    jwt.verify(token,process.env.JWT_SECRET_KEY,async(err,payload)=>{
       
        if(err) return ResizeObserverSize.status(403).send("Token is not valid");
        console.log(payload,'jwt----payload');
        req.verifyUserId = payload.id;
        req.verifyEmail = payload.email;
        req.verifyRole = payload.role;
        req.verifyUserStatus = payload.registerVerificationStatus
        req.verifyModeOfWork = payload.modeOfWork?payload.modeOfWork:null
        next()
    });
}
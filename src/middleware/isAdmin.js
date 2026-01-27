export const isAdmin = (req, res, next) =>{
    const allowedRoles = ["SUPER_ADMIN", "TENANT_ADMIN"];

    if(!req.user){
        return res.status(401).json({message: "Unauthorized"});
    }

    if(!allowedRoles.includes(req.user.role)){
        return res.status(403).json({message: "Admin access required"});
    }

    next();
}
export const errorHandler = (err, req, res, next) =>{
    console.log("ERROR: ", err);
    res.status(500).json({message: err.message || "Server error"});
};
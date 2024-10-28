

const notFound = (req,res,next) => {

    const error = new Error("not found")
    res.status(404);
    next(error)
}



const errorHandler = (err, req, res, next) => {
    // Set the status code based on whether it's already set
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Only send a response if headers haven't been sent
    if (!res.headersSent) {
        res.status(statusCode).json({
            message: err.message,
        });
    } else {
        console.error("Headers were already sent.");
    }
};


module.exports = {
    notFound,
    errorHandler
}
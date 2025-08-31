
export const Response = (code, success, msg, res, data = null, token = null) =>{
    return res.status(code).json({
        success,
        msg,
        data,
        token
    });
}
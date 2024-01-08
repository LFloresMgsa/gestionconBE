const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {

    try {


        const token = req.header('x-auth-token')

     

        // CHECK IF WE EVEN HAVE A TOKEN
        if(!token){
            res.status(400).json({
                errors: [
                    {
                        msg: "No token found"
                    }
                ]
            })
        }
        else{
            const user = await jwt.verify(token, "nfb32iur32ibfqfvi3vf932bg932g932")
            req.user = user.Sgm_cUsuario
            next()
    
        }

    } catch (error) {
        res.status(400).json({
            errors: [
                {
                    msg: 'Invalid Token'
                }
            ]
        })
    }
}
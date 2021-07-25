const User = require('../../../models/user');
const jwtToken = require('jsonwebtoken');
const env = require('../../../config/environemnt');

module.exports.createSession = async function(req, res){
    try {  
        let user = await User.findOne({email : req.body.email});
        if(!user || user.password != req.body.password){
            return res.status(422).json({
                message: "Invalid email/password"
            });
        }
        return res.status(200).json({
            message: "Logged In successfully",
            data: {
                token : jwtToken.sign((await user).toJSON(), env.jwtKey, {expiresIn: 100000})
            }
        })
    } catch (error) {
        console.log("*****", error);
        return res.status(500).json({
            message: "Internal Error"
        })
    }
}
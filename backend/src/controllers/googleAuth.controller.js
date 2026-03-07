const {OAuth2Clinet} = require("google-auth-library");
const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');

const client = new OAuth2Clinet(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req,res,next) => {
    try {
        const {credential} = req.body;
        if(!credential){
            return res.status(400).json({success:false,message:"Missing credentials"});
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload?.email;
        const name = payload?.name || "Google User";
        const picture = payload?.picture || "";

        if(!email){
            return res.status(400).json({success: false, message:"Email not found in token"});
        }

    

        const user = await User.findOne({email});

        if(!user){
            user = await User.create({
                name,
                email, 
                password: "GOOGLE_AUTH",
            });
        }

        const token = generateToken(user._id);

        res.json({
            success:true,
            user:{
              _id:user._id,
              name:user.name,
              email:user.email,
              token,
            }
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    googleLogin,
}
const UserModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secretKey = '947089n*(&#)$(*#RHFJDvmbksduj'

module.exports = {
    login : async function(req,res){
        try{
            const { email, password } = req.body
            if(!email || !password){
                res.status(400).send({status:400,message:'Missing email or password'})
            }
            const storedUser = await UserModel.findOne({email:email})
            const isMatch = await bcrypt.compare(password, storedUser.password);
            if (isMatch) {
                const tokenPayload = {
                    email: email
                };
                const accessToken = jwt.sign(tokenPayload, secretKey);
                res.status(200).send({ status:200,accessToken:accessToken,userInfo:storedUser})
            } else {
                res.status(401).send({status:401,message:'Password is incorrect'})
            }
        }catch(err){
            res.status(500).send('Database error')
        }
    }
}
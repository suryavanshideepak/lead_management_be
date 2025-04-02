const UserModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const CryptoJS = require('crypto-js')
const secretKey = '947089n*(&#)$(*#RHFJDvmbksduj'
const CRYPTO_SECRET_KEY="947089n*(&#)$(*#RHFJDvmbksduj1234"

module.exports = {
    //login authentication
    login : async function(req,res){
        try{
            const { email, password } = req.body
            if(!email || !password){
                return res.status(400).json({status:400,message:'Missing email or password'})
            }
            const storedUser = await UserModel.findOne({email:email})
            const isMatch = await bcrypt.compare(password, storedUser.password);
            if (isMatch) {
                const tokenPayload = {
                    email: email
                };
                const accessToken = jwt.sign(tokenPayload, secretKey);
                return res.status(200).json({ status:200,accessToken:accessToken,userInfo:storedUser})
            } else {
                return res.status(401).json({status:401,message:'Password is incorrect'})
            }
        }catch(err){
            return res.status(500).json('Database error')
        }
    },

    //create user by admin
    createUserByAdmin: async ( req, res ) => {
        const { email, password, name, status } = req.body
        try{
            if(email && password && name) {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                const encryptedPassword = CryptoJS.AES.encrypt(password, CRYPTO_SECRET_KEY).toString();
                const createUser = await userModel.create({
                    email: email,
                    password: hashedPassword,
                    name: name,
                    role: 'USER',
                    encryptedPassword:encryptedPassword,
                    status: status ? status : 'ACTIVE'
                })
                if(createUser){
                    return res.status(200).json({
                            message:'User Created successfully',
                            user:createUser
                        })
                }
            }else{
                return res.status(400).json({message:'Please fill all fields'})
            }
        }catch(err){
            return res.status(500).json({message:'Something went wrong'})
        }
    },

    //Get all  user for admin
    getAllUser:async (req, res)=>{
        try {
            let activeQuery = {
                $or: [
                  { status: 'ACTIVE' },
                  { status: 'PENDING' }
                ],
                role: 'USER'
              };
            const allUser = await userModel.find(activeQuery)
            return res.status(200).json({ users: allUser})
        }catch(err){
            return res.status(500).send()
        }
    },

    //Deactive user
    removeUser: async (req, res) => {
        const { userId } = req.query;
        try {
          const user = await userModel.findByIdAndUpdate(
            userId,
            { status: 'INACTIVE' },
            { new: true } 
          ).select('-__v -password -tokens');
      
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          return res.status(200).json({
            message: 'User deactivated successfully',
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              status: user.status
            }
          });
        } catch (err) {
          console.error('Deactivation error:', err);
          return res.status(500).json({
            message: 'An error occurred while deactivating the user',
            error: err.message
          });
        }
      },

    forgotPassword: async (req, res) => {
        const { email, oldPassword, newPassword } = req.body
        try {
            if (!email || !oldPassword || !newPassword) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Old password is incorrect' });
            }
            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            
            user.password = hashedPassword;
            await user.save();
            
            res.status(200).json({ message: 'Password updated successfully' });
        } catch (err) {
            res.status(500).json({
                message: 'An error occurred while updating the password',
                error: err.message
            });
        }
    }
}
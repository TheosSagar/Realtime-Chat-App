const user = require('../models/User')

const getAllUsers = async(req, res) => {
    try{
        const senderId = req.user._id

        const users = await user.find({ _id: { $ne: senderId } }).select('-password'); //-password means dont include the password

        res.status(200).json({
            message: 'user fetched successfully',
            users,
        });
    }
    catch(error){
        res.status(500).json({
            message: 'Server Error!',
        });
    }
};

module.exports = {
    getAllUsers,
}
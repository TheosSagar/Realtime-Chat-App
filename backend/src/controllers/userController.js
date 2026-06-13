const user = require('../models/User')

const getAllUsers = async(req, res) => {
    try{
        const users = await user.find().select('-password'); //-password means dont include the password

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
const router = require('express').Router()
const User = require('../models/User')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

//REGISTER
router.post('/register', async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
        isAdmin: req.body.isAdmin
    })
    //Guardando los datos en la base de datos con
    //async y await con el metodo save()
    try {
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch (err) {
        res.status(500).json(err)
    }
})

//LOGIN
router.post('/login', async (req, res) => {
    try {
        //VALIDAR EMAIL
        const userDb = await Admin.findOne({
            email: req.body.email,
        });

        //DESENCRIPTAR PASSWORD
        const bytes = CryptoJS.AES.decrypt(userDb.password, process.env.PASSWORD_KEY);
        const passwordDecrypt = bytes.toString(CryptoJS.enc.Utf8);


        //CREATOR TOKEN JWT
        const accessToken = jwt.sign({
            id: userDb._id,
            isAdmin: userDb.isAdmin
        }, process.env.JWT_KEY,
            { expiresIn: '5d' })

        //RECUPERANDO USER 
        const { password, ...others } = userDb._doc;

        //CONCAT DATA BASE OBJECT AND ACCESSTOKEN
        !userDb || passwordDecrypt !== req.body.password ? res.status(401).json(`${req.body.email} or ${req.body.password} are wrong`) :
            res.status(200).json({ ...others, accessToken });
    } catch (error) {
        res.status(401).json(error);
    }
})

module.exports = router

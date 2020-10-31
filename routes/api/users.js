const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar =require('gravatar');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config= require('config');
// @route  Post api/users
// @desc   Register Users
// @access Public

router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({min:6})
],
async (req, res) => {
  const error= validationResult(req);
  console.log(error);
  if(!error.isEmpty()) {
    return res.status(400).json({erros: error.array() });
  }

  const {name, email, password}=req.body;
  
  try{
    //see if user exists
    let user =await User.findOne({email});

    if(user) {
      return res.status(400).json({error : [{msg: 'User already exists'}] });     
    }

    //Get users gravatar
    const avatar = gravatar.url(email, {
      s: '200',  //size
      r: 'pg',  //rating nude pic
      d: 'mm'
    })

    user=new User({   //creating new instance of user
      name,
      email,
      avatar,
      password   
    })

    //Encrpt password
    const salt = await bcrypt.genSalt(10); //width or 10 round

    user.password =await bcrypt.hash(password, salt);
    await user.save();

    //Return jsonwebtoken 
    // res.send('User Registered');

    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(
      payload, 
      config.get('jwtSecret'),
      {expiresIn: 360000},
      (err, token)=>{
        if(err) throw err;
        res.json({token});
      });
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;

const express = require("express")
const User = require("../models/User.model")
const bcrypt = require('bcryptjs')
const router = express.Router()

/* GET home page */
router.get("/signup", (req, res, next) => {
  res.render("auth/signup",)
})


router.post('/signup', async (req, res) => {
    const body = { ...req.body }
  
    if (body.password.length < 6) {
      res.render('auth/signup', { errorMessage: 'Password too short', body: req.body })
    } else {
      const salt = bcrypt.genSaltSync(13)
      const passwordHash = bcrypt.hashSync(body.password, salt)
      console.log(passwordHash)
  
      delete body.password
      body.passwordHash = passwordHash
  
      try {
        await User.create(body)
        res.send(body)
      } catch (error) {
        if (error.code === 11000) {
          console.log('Duplicate !')
          res.render('auth/signup', {
            errorMessage: 'Username already used !',
            userData: req.body,
          })
        } else {
          res.render('auth/signup', {
            errorMessage: error,
            userData: req.body,
          })
        }
      }
    }
  })
  
  router.get('/login', (req, res) => {
    res.render('auth/login')
  })
  
  router.post('/login', async (req, res) => {
    console.log('SESSION =====> ', req.session)
    const body = req.body
  
    const userMatch = await User.find({ username: body.username })
    console.log(userMatch)
    if (userMatch.length) {
      // User found
      const user = userMatch[0]
  
      if (bcrypt.compareSync(body.password, user.passwordHash)) {
        // Correct password
        console.log(user)
        res.render('profile', { user })
      } else {
        // Incorrect password
      }
    } else {
      // User not found
    }
  })




module.exports = router;
import express from 'express'
const router = express.Router()

import { passport } from '../config/passportOAuth.js'

import { googleLoginHandler } from '../controllers/googleLoginController.js'

router.route("/google").get(passport.authenticate('google', {
    scope: ['openid', "profile", "email"],
    prompt: "consent select_account"
}))

router.route("/redirect/google").get(passport.authenticate('google', {
    session: false,
    failureRedirect: '/failure'
}),
    googleLoginHandler
)

export { router }


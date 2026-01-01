import dotenv from "dotenv"
dotenv.config()
import { Strategy  as GoogleStrategy} from "passport-google-oauth2";
import type {Request} from 'express' 
import type { VerifyCallback } from "passport-google-oauth2";
import type { Profile } from "passport";
import passport from "passport";

passport.use(new GoogleStrategy({
   
    clientID : String(process.env.CLIENT_ID), // often the process.env are string | undefined so give them the assurance they are always gonna be string
    clientSecret : String(process.env.CLIENT_SECRET), 
    callbackURL : "http://localhost:5000/auth/redirect/google",
    passReqToCallback   : true

},
   async function(req : Request , accessToken : string , refreshToken : string , profile : Profile ,cb : VerifyCallback ){
	console.log('this is alos done')
	console.log(profile)
	const toSend = {
	    providerId : profile.id,
	    firstName : profile.name?.givenName,
	    middleName : profile.name?.middleName,
	    lastName : profile.name?.familyName,
	    email : profile.emails?.[0].value,
	    profilePicLink : profile.photos?.[0].value
	}


	cb(null , toSend)

    }
))


export {passport}

// Connexion avec Google, Synchronisation avec ton backend Django via createNewUser et getExistingUser
// NextAuth se charge de créer l’utilisateur en base grâce à createNewUser si getExistingUser échoue.

import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { createNewUser, getExistingUser } from "./lib/api"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],

  callbacks: {

    async signIn({profile}){
      try{
        console.log("OAuth Google Profile:", profile)
        
        if (!profile?.email) return false

        const email = profile?.email
        const first_name = profile?.given_name
        const last_name = profile?.family_name
        const username = email?.split("@")[0]
        const profile_picture_url = profile?.picture

        const userObj = {email, first_name, last_name, username, profile_picture_url}

        // console.log(profile)

        try{
          await getExistingUser(email)
        }
        catch(err){
          // If user doesn't exist, create them
          await createNewUser(userObj)
        }

        return true
      }
      catch(err:unknown){
        console.error("SignIn Error:", err)
        return false
      }
    },
  },

})
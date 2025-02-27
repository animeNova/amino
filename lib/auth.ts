import { db } from "@/db"
import { betterAuth } from "better-auth"
import { magicLink } from "better-auth/plugins";
import { sendEmail } from "./mail/email";
export const auth = betterAuth({
    database: {
      db: db,
      type: "postgres" // or "mysql", "postgres" or "mssql"
    } ,
    socialProviders : {
      google : {
        clientId :process.env.GOOGLE_CLIENT_ID as string ,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET as string,
      } ,
      github : {
        clientId :process.env.GITHUB_CLIENT_ID as string ,
        clientSecret:process.env.GITHUB_CLIENT_SECRET as string,
      }
    } ,
    plugins : [
      magicLink({
        sendMagicLink: async ({ email, token, url }, request) => {

            // send email to user
            await sendEmail({
              to : email ,
              html : 
              `
              <p>Please Verify Your Email</p>
                <a href=${url}>confirm your email</a>
               <p>This Cpde <b>expires in 5 minutes</b></p>
              ` ,
              subject : "Verify Your Email" ,
            })
        }
    })
    ]
})
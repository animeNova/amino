import { createAuthClient } from "better-auth/react"
import { adminClient, magicLinkClient  } from "better-auth/client/plugins";
export const {signIn,signOut,getSession,useSession,magicLink,admin,updateUser} = createAuthClient({
    baseURL: process.env.NODE_ENV == 'production' ? process.env.BETTER_AUTH_PROD_URL : process.env.BETTER_AUTH_DEV_URL, // the base url of your auth server,
    plugins : [
        magicLinkClient(),
        adminClient(),
    ]
})
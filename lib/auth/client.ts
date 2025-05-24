import { createAuthClient } from "better-auth/react"
import { adminClient, magicLinkClient  } from "better-auth/client/plugins";
export const {signIn,signOut,getSession,useSession,magicLink,admin,updateUser} = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL, // the base url of your auth server,
    plugins : [
        magicLinkClient(),
        adminClient(),
    ]
})
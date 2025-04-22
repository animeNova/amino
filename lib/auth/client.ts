import { createAuthClient } from "better-auth/react"
import { adminClient, magicLinkClient } from "better-auth/client/plugins";
export const {signIn,signOut,getSession,useSession,magicLink,admin} = createAuthClient({
    baseURL: "http://localhost:3000", // the base url of your auth server,
    plugins : [
        magicLinkClient(),
        adminClient()
    ]
})
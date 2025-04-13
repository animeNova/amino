'use server';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getUserId = async () => {
    const user = await auth.api.getSession({
        headers: await headers()
    })
    if(user){
        if(typeof user.user.id === 'string'){
            return user.user.id 
        }
        else {
            throw new Error("User ID is not a string.");
        }
    }
    else {
        throw new Error("User not authenticated.");
    }
}

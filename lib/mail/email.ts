'use server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY as string);

interface SendEmailProps {
    to : string;
    subject : string; 
    html : string;
}

export const sendEmail = async ({html, subject, to}: SendEmailProps) => {
    try {
       const {data} = await resend.emails.send({
            from: 'no-reply@amino-clone.com',  // Fixed typo in "no-reply"
            subject,
            html,
            to
        });
        
        return { success: true, data };
        
    } catch (error) {
        return { success: false, error };
    }
}

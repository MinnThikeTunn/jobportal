import { Button, Modal, PasswordInput, PinInput, rem, TextInput } from "@mantine/core";
import { IconAt, IconLock } from "@tabler/icons-react";
import { useState } from "react";
import { data } from "react-router-dom";
import { changePass, sendOtp, verifyOtp } from "../Services/UserService";
import { signUpValidation } from "../Services/FormValidation";
import { errorNotification, successNotification } from "../Services/NotificationService";
import { useInterval } from "@mantine/hooks";

const ResetPassword = (props: any) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passErr, setPassErr] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpSending, setOtpSending] = useState(false);
    const [verified, setVerified] = useState(false);
    const [resendLoader, setResendLoader] = useState(false);
    const [seconds, setSeconds] = useState(60);
    const interval = useInterval(() => {
        if(seconds === 0){
            setResendLoader(false);
            setSeconds(60);
            interval.stop();
        } else setSeconds(s => s - 1);
    }, 1000);
 
    const handleSendOtp = () => {
        setOtpSending(true);
        sendOtp(email).then(res => {
            successNotification("OTP Sent Successfully", "Enter the OTP sent to reset.");
            setOtpSent(true);
            setOtpSending(false);
            setResendLoader(true);
            interval.start();
        }).catch(err => {
            console.log(err)
            errorNotification("OTP Sending Failed", err.response.data.errorMessage);
            setOtpSending(false);
        })
    }

    const handleVerifyOtp = (otp: string) => {
        verifyOtp(email, otp).then(res => {
            successNotification("OTP Verified", "Enter new password.");
            setVerified(true)
        }).catch(err => {   
            console.log(err)
            errorNotification("OTP Verification Failed", err.response.data.errorMessage);
        })
    }

    const resendOtp = () => {
        if (resendLoader) return;
        handleSendOtp();
    }

    const changeEmail = () => {
        setOtpSent(false);
        setResendLoader(false);
        setSeconds(60);
        setVerified(false);
        interval.stop();
    }

    const handleResetPassword = () => {
        changePass(email, password).then(res => {
            console.log(res)
            successNotification("Password Changed", "Login with new password.");
            setOtpSent(false);
            setEmail("");
            props.close();
        }).catch(err => {
            console.log(err)
            errorNotification("Password Change Failed", err.response.data.errorMessage);
        })
    }

    return (
        <Modal opened={props.opened} onClose={props.close} title="Reset Password">
            <div className="flex flex-col gap-6">
                <TextInput withAsterisk  name="email" value={email} size="md" onChange={(e)=>setEmail(e.currentTarget.value)} label="Email" placeholder="Your email"
                    leftSection={<IconAt style={{width: rem(16), height: rem(16)}}/>} 
                    rightSection={<Button size="xs" loading={otpSending && !otpSent} className="mr-1" onClick={handleSendOtp} autoContrast disabled={email==="" || otpSent} variant="filled">Send</Button>}  rightSectionWidth="xl"/>
                {otpSent && <PinInput type="number" length={6} className="mx-auto" size="md" gap="lg" onComplete={handleVerifyOtp} />}
                {otpSent && !verified &&
                    <div className="flex gap-2">
                        <Button fullWidth loading={otpSending} onClick={resendOtp} color="#ffbd20" autoContrast variant="light">{resendLoader?seconds:"Resend"}</Button>
                        <Button fullWidth onClick={changeEmail} autoContrast variant="filled">Change Email</Button>
                    </div>
                }
                {verified && 
                    <PasswordInput name="password"  value={password} error={passErr} onChange={(e)=>{setPassword(e.currentTarget.value); setPassErr(signUpValidation("password", e.currentTarget.value))}} withAsterisk leftSection={<IconLock size={18} stroke={1.5}/>} label="New Password" placeholder="New Password" />
                }
                {verified && <Button onClick={handleResetPassword} autoContrast variant="filled">Reset Password</Button>}
            </div>
        </Modal>
    )
}

export default ResetPassword;
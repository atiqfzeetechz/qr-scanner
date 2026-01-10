import { useEffect, useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function Form() {
    const [token, setToken] = useState<string | null>(null);
    const captchaRef = useRef<any>(null);

    useEffect(() => {
        if (token) {
            console.log("hCaptcha Token:", token);
        }
    }, [token]);


    const challengeExpired = async () => {

    }
    const handleVerificationSuccess = (token: any, ekey: any) => {
        console.log(token)
        console.log(ekey)
    }
    return (
        <form>
            <HCaptcha
                sitekey="1ca4924c-a484-446e-be12-ec9a7d4a5182"
                size="normal"

                ref={captchaRef}
                onVerify={(token, ekey) => handleVerificationSuccess(token, ekey)}
            // callback: onSolve,
            // 'error-callback': onError,
            // 'expired-callback': onExpired
            />
        </form>
    );
}

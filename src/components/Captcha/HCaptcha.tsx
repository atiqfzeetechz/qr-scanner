import { useEffect, useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function Form({onSucces}: any) {
    const [token] = useState<string | null>(null);
    const captchaRef = useRef<any>(null);

    useEffect(() => {
        if (token) {
            console.log("hCaptcha Token:", token);
        }
    }, [token]);


 
    return (
        <form>
            <HCaptcha
                sitekey="1ca4924c-a484-446e-be12-ec9a7d4a5182"
                size="normal"

                ref={captchaRef}
                onVerify={(token, ekey) => onSucces(token, ekey)}
            // callback: onSolve,
            // 'error-callback': onError,
            // 'expired-callback': onExpired
            />
        </form>
    );
}

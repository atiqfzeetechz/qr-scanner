import { useEffect, useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function Form({ onSucces, autoExecute = true }: any) {
    const [token] = useState<string | null>(null);
    const captchaRef = useRef<any>(null);

    useEffect(() => {
        if (token) {
            console.log("hCaptcha Token:", token);
        }
    }, [token]);

    // Auto-execute the captcha on mount to bypass the "I'm human" checkbox
    useEffect(() => {
        if (!autoExecute) return;

        // Small delay to ensure the captcha widget is mounted
        const t = setTimeout(() => {
            try {
                if (captchaRef.current && typeof captchaRef.current.execute === 'function') {
                    captchaRef.current.execute();
                }
            } catch (err) {
                // ignore
            }
        }, 300);

        return () => clearTimeout(t);
    }, [autoExecute]);

    return (
        <form>
            <HCaptcha
                sitekey="1ca4924c-a484-446e-be12-ec9a7d4a5182"
                // use invisible size when auto executing to avoid showing the checkbox
                size={autoExecute ? "invisible" : "normal"}
                ref={captchaRef}
                onVerify={(token, ekey) => onSucces(token, ekey)}
            />
        </form>
    );
}


import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function Form({ onSucces , captchaRef}: any) {

  return (
    <form>
      <HCaptcha
        sitekey="1ca4924c-a484-446e-be12-ec9a7d4a5182"
        size="invisible"
        ref={captchaRef}

        onLoad={() => {
          // ✅ captcha fully ready here
          captchaRef.current.execute();
        }}

        onVerify={(token, ekey) => {
          console.log("hCaptcha token:", token);
          onSucces(token, ekey);
        }}
      />
    </form>
  );
}

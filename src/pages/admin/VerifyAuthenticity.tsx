import { useEffect, useRef, useState } from "react";
import "./verifyauthenticity.css";
import { ChevronDown, ChevronUp, Menu } from "lucide-react";
import codeImage from "../../assets/code.png";
import applicanNumber from "../../assets/applicationNumber.png";
import { useParams } from "react-router-dom";
import { decodeData } from "../../helper/encodeDecode";
import { useAxios } from "../../hooks/useAxios";
import TemplateAsImage from "../../components/TemplateAsImage";
import handIcon from "../../assets/hand-icon.png";
import icon128 from "../../assets/icon128x128.jpg";
import accessPopup from "../../assets/access_popup.jpg";
import helpIcon from "../../assets/icon-help-navy.2eb8ef7fe4f329d39db5.png";
import Form from "../../components/Captcha/HCaptcha";
import { FaCaretDown } from "react-icons/fa";

import { FaCheck, FaSearch } from "react-icons/fa";
import { TiClipboard } from "react-icons/ti";

const VerifyAuthenticity = () => {
  const [closed, setClosed] = useState(false);
  const [resultClosed, setResultClosed] = useState(false);
  const [showTooltip, setShowTooltip] = useState("");
  const [decodedData, setDecodedData] = useState({});
  const fullUrl = window.location.href;
  const [showcaptcha, setShowCaptcha] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [DarkMode, setDarkMode] = useState(false);

  const [formData, setFormData] = useState({
    applicationNumber: "",
    code: "",
  });
  console.log(decodedData);
  const [resultData, setResultData] = useState(null);
  const [errors, setErrors] = useState({
    msg: "",
  });

  const captchaRef = useRef<any>(null);

  const { post } = useAxios();

  const { data } = useParams();
  useEffect(() => {
    if (data) {
      const _data = decodeData(data);
      setDecodedData(_data);
      console.log(_data);
      if (_data) {
        const newFormData = { ...formData };
        if (_data.applicationNumber) {
          console.log("here");
          newFormData.applicationNumber = _data.applicationNumber;
        }
        if (_data.code) {
          newFormData.code = _data.code;
        }
        if (_data.applicationNumber && _data.code) {
          setShowCaptcha(true)
        }
        setFormData(newFormData);
      }
    }
  }, [data]);
  console.log(formData);
  const clearButton = () => {
    setFormData({
      applicationNumber: "",
      code: "",
    });
    setResultClosed(true);
    setResultData(null);
    setErrors({ msg: "" });
    setShowCaptcha(false);
  };

  const showCaptcha = () => {
    console.log("called");
    captchaRef.current.execute();
    setShowCaptcha(true);
  };

  const onSuccess = (token: any, key: any) => {
    console.log(token, key);
    setShowCaptcha(false);
    verifyAuthenticityApiCall();
  };
  const verifyAuthenticityApiCall = async () => {
    try {
      setErrors({ msg: "" });
      const res = await post("/admin/qr/verifyAuthenticity", formData);
      if (res.success) {
        const data = res.data.data;
        data.qrCode = fullUrl;
        setResultData(data);
      }
      console.log(res);
    } catch (error: any) {
      setErrors({
        msg:
          error.response?.data?.message ||
          error.message ||
          "Document not found",
      });
      console.log(error);
    }
  };

  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedFlag, setSelectedFlag] = useState(
    "https://visa-haiti.serpro.gov.br/sci/pages/web/ui/assets/images/lang/flag-england-a.png",
  );

  console.log(languageOpen, selectedLanguage, selectedFlag);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLanguageSelect = (language: string, flagUrl: string) => {
    setSelectedLanguage(language);
    setSelectedFlag(flagUrl);
    setLanguageOpen(false);
  };
  console.log(handleLanguageSelect);
  return (
    <>
      <div className="verifyauthenticitybanner">
        <div className="banner-content">
          <div className="left-content">
            <img
              src="data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNiIgaGVpZ2h0PSIxOSIgdmlld0JveD0iMCAwIDEwMDAgNzAwIj48cGF0aCBmaWxsPSIjMDA5MjNGIiBkPSJNMCAwaDEwMDB2NzAwSDB6Ii8+PHBhdGggZmlsbD0iI0Y4QzMwMCIgZD0iTTUwMCA4NUw4NSAzNTBsNDE1IDI2NSA0MTUtMjY1TDUwMCA4NXoiLz48Y2lyY2xlIGZpbGw9IiMyODE2NkYiIGN4PSI0OTkiIGN5PSIzNTAiIHI9IjE3NCIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0zOTUgMjk2YzEwMyAwIDE5OSAzOCAyNzIgMTAxIDItOCA0LTE3IDUtMjYtNzUtNjEtMTcyLTk4LTI3Ny05OC0xOCAwLTM2IDEtNTMgMy0zIDgtNiAxNi05IDI1IDIwLTMgNDEtNCA2My00eiIvPjwvc3ZnPg=="
              alt="brazil flag"
            />
            <span className="txt-Brasil">Brasil</span>
            <span className="banner-divider"></span>
          </div>

          <span className="banner-text">Simplifique!</span>

          <span className="banner-divider"></span>
          <span className="banner-text">Comunica BR</span>

          <span className="banner-divider"></span>
          <span className="banner-text">Participe</span>

          <span className="banner-divider"></span>
          <span className="banner-text">Acesso à informação</span>

          <span className="banner-divider"></span>
          <span className="banner-text">Legislação</span>

          <span className="banner-divider"></span>

          <div className="right-content">
            <span className="banner-text">Canais</span>
            <img
              className="blue-logo"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOSIgaGVpZ2h0PSIyOSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI2Ni4yNTAzOCwtMjMxLjY4NTk0KSI+PHBhdGggZD0ibTI5Mi40IDIzNy44Yy0wLjEgMC0wLjItMC4xLTAuMi0wLjIgMC0xLTEuOC0yLjYtNC4xLTIuNmwtMi41IDAtNC44IDMuNi00LjgtMy42LTIuNSAwYy0yLjQgMC00LjEgMS42LTQuMSAyLjYgMCAwLjEtMC4xIDAuMi0wLjIgMC4yLTAuMSAwLTAuMi0wLjEtMC4yLTAuMiAwLTEuNCAyLjEtMy4xIDQuNi0zLjFsMi40IDAgMC42LTAuNmMwLjEtMC4xIDAuMi0wLjEgMC4zIDBsMy45IDQuNiAzLjktNC42YzAuMS0wLjEgMC4yLTAuMSAwLjMgMGwwLjYgMC42IDIuNCAwYzIuNSAwIDQuNiAxLjcgNC42IDMuMSAwIDAuMS0wLjEgMC4yLTAuMiAwLjJ6bS0zIDEwLjRjLTAuMSAwLjctMC4yIDEtMC4zIDEgMCAwLjEtMC4xIDAuMS0wLjIgMC4xLTAuMSAwLTAuMS0wLjEtMC4xLTAuMiAwIDAgMC4xLTAuMyAwLjItMC45IDAuMS0wLjYtMC4yLTEuMS0wLjItMS4xIDAtMC4xIDAtMC4yIDAuMS0wLjIgMC4xIDAgMC4xIDAgMC4yIDAgMCAwIDAgMCAwIDAuMSAwIDAgMC4zIDAuNiAwLjIgMS4zem0tMSAwLjhjMCAwLjEtMC4xIDAuMS0wLjIgMC4xLTAuMSAwLTAuMS0wLjEtMC4xLTAuMiAwIDAgMC4xLTAuMyAwLjEtMC45IDAtMC42LTAuMy0xLjEtMC4zLTEuMSAwLTAuMSAwLTAuMiAwLjEtMC4yIDAuMSAwIDAuMSAwIDAuMiAwIDAgMCAwIDAgMCAwIDAgMCAwLjMgMC42IDAuMyAxLjMgMCAwLjctMC4xIDEtMC4yIDF6bS0wLjctMC40Yy0wLjMgMS4yLTAuOCAyLjItMC45IDIuNi0wLjIgMC40LTAuMyAwLjktMC4yIDIuMiAwIDEuMyAwIDIuMi0wLjEgMi41IDAgMC4yLTAuMiAwLjMtMC40IDAuMy0wLjIgMC0wLjMtMC4xLTAuNC0wLjQtMC4xLTAuNS0wLjMtMi42LTAuMy0yLjkgMC0wLjItMC4yLTAuNC0wLjMtMC40LTAuMSAwLTAuMiAwLjEtMC4zIDAuNS0wLjIgMC45LTAuNSAzLjEtMC42IDMuNi0wLjEgMC41LTAuMyAwLjYtMC40IDAuNi0wLjEgMC0wLjEgMC0wLjEgMCAwIDAgMCAwIDAgMC0wLjEgMC0wLjQgMC0wLjQtMC40IDAtMC41IDAuNC0zLjUgMC40LTMuOCAwLTAuMiAwLTAuMy0wLjEtMC4zLTAuMSAwLTAuMSAwLjEtMC4yIDAuMi0wLjMgMC40LTEuNyAyLjktMi4xIDMuNy0wLjEgMC4yLTAuMiAwLjItMC40IDAuMi0wLjEgMC0wLjIgMC0wLjMtMC4xLTAuMS0wLjEtMC4zLTAuNC0wLjItMC42IDAuMS0wLjIgMS41LTMuNCAxLjctMy44IDAuMS0wLjMgMC4xLTAuNS0wLjEtMC41LTAuMSAwLTAuMiAwLjEtMC40IDAuMi0wLjUgMC41LTIuNCAyLjUtMi43IDIuNy0wLjEgMC4xLTAuMiAwLjItMC4zIDAuMi0wLjEgMC0wLjItMC4xLTAuMy0wLjItMC4yLTAuMi0wLjItMC40LTAuMS0wLjYgMC4yLTAuMiAyLjYtMy4zIDMtNC4xIDAuNC0wLjcgMS0xLjktMC4yLTEuOS0wLjEgMC0wLjEgMC0wLjIgMC0wLjUgMC0wLjggMC4xLTEuMSAwLjEtMC41IDAtMC43LTAuMS0wLjgtMC4xLTAuMi0wLjEtMC42LTAuMy0wLjUtMC42IDAuMS0wLjIgMC43LTAuMSAxLTAuMiAwLjItMC4xIDAuMi0wLjEgMC4yLTAuMSAwIDAgMS4xLTAuMyAxLjgtMC43IDAuNy0wLjQgMi4zLTEuMSAyLjctMS4xIDAuMiAwIDAuNC0wLjEgMC42LTAuMSAwLjMgMCAwLjYgMCAwLjcgMC4xIDAuMyAwLjEgMC42IDAuOSAyIDEuNSAwIDAgMC42IDAuNiAwLjMgMS44em0tMTEuNyAyLjJjLTAuNC0xLjItMC42LTIuMy0wLjYtMi43LTAuMS0wLjQtMC4zLTAuOS0xLTEuOS0wLjctMS0xLjItMS44LTEuMy0yLjEtMC4xLTAuMiAwLjEtMC41IDAuNC0wLjUgMC4xIDAgMC4yIDAgMC4zIDAuMiAwLjQgMC40IDEuNyAyIDEuOSAyLjIgMC4xIDAuMSAwLjMgMC4yIDAuNCAwLjIgMC4yIDAgMC4yLTAuMSAwLjEtMC42LTAuMy0wLjktMS4zLTIuOS0xLjUtMy4zLTAuMy0wLjcgMC4xLTAuNyAwLjEtMC43IDAgMCAwLjEtMC4xIDAuMi0wLjEgMC4xIDAgMC4yIDAgMC4zIDAuMiAwLjIgMC40IDEuNiAzLjIgMS44IDMuNCAwLjEgMC4xIDAuMiAwLjIgMC4zIDAuMiAwLjEgMCAwLjEtMC4xIDAuMS0wLjMgMC0wLjUtMC4yLTMuMy0wLjMtNC4yIDAtMC4zIDAuMy0wLjUgMC41LTAuNSAwIDAgMCAwIDAgMCAwLjIgMCAwLjQgMC4yIDAuNSAwLjQgMC4xIDAuMiAwLjYgMy43IDAuNyA0LjIgMCAwLjIgMC4yIDAuNCAwLjMgMC40IDAuMSAwIDAuMi0wLjEgMC4zLTAuNCAwLjEtMC43IDAuNy0zLjQgMC43LTMuNyAwLTAuMyAwLjItMC40IDAuNC0wLjQgMCAwIDAuMSAwIDAuMSAwIDAuMiAwIDAuNCAwLjIgMC40IDAuNSAwIDAuMy0wLjMgMy43LTAuMiA0LjgtMC41IDAuMi0xIDAuNC0xLjMgMC40bDAgMCAwIDAtMC4yIDAuMWMwIDAtMC4xIDAtMC4yIDAtMC40IDAtMSAwLTEuMyAwLjYtMC4xIDAuMy0wLjIgMC42LTAuMSAwLjggMC4yIDAuNSAwLjggMC44IDAuOSAwLjkgMCAwIDAgMCAwIDAgMC4yIDAuMSAwLjUgMC4yIDEuMSAwLjIgMC4zIDAgMC42IDAgMS4xLTAuMS0wLjEgMC4yLTAuMiAwLjQtMC4zIDAuNmwtMC4xIDAuMWMtMC4yIDAuMy0wLjggMS4yLTEuOCAyLjUtMC4yIDAtMC4zIDAtMC41IDAtMC4zIDAtMC42IDAtMC45IDAuMSAwIDAtMC44LTAuMS0xLjMtMS4zem0wLjggMi4yYzAgMC4xLTAuMSAwLjEtMC4yIDAuMSAwIDAgMCAwLTAuMSAwIDAgMC0wLjYtMC4yLTEtMC44LTAuNC0wLjYtMC41LTAuOS0wLjUtMC45IDAtMC4xIDAtMC4yIDAuMS0wLjIgMC4xIDAgMC4yIDAgMC4yIDAuMSAwIDAgMC4xIDAuMyAwLjQgMC44IDAuNCAwLjUgMC45IDAuNyAwLjkgMC43IDAuMSAwIDAuMSAwLjEgMC4xIDAuMnptLTAuOSAwLjRjMCAwLjEtMC4xIDAuMS0wLjEgMC4xIDAgMC0wLjEgMC0wLjEgMCAwIDAtMC42LTAuMy0wLjktMC45LTAuNC0wLjYtMC40LTAuOS0wLjQtMSAwLTAuMSAwLjEtMC4yIDAuMS0wLjIgMC4xIDAgMC4yIDAuMSAwLjIgMC4xIDAgMCAwIDAuMyAwLjQgMC44IDAuMyAwLjUgMC44IDAuOCAwLjggMC44IDAuMSAwIDAuMSAwLjEgMC4xIDAuMnptMTQuOS0yMS44LTIwLjIgMGMtMi40IDAtNC40IDItNC40IDQuNGwwIDIwLjJjMCAyLjQgMiA0LjQgNC40IDQuNGwyMC4yIDBjMi40IDAgNC40LTIgNC40LTQuNGwwLTIwLjJjMC0yLjQtMi00LjQtNC40LTQuNCIgZmlsbD0iIzFjNGY5YyIvPjwvZz48L3N2Zz4K"
              alt="brazil flag"
            />
          </div>
        </div>
      </div>

      <div
        className={`verifycontainer ${isZoomed ? "zoomed" : ""}`}
        style={{
          background: DarkMode ? "#000000" : "#fff",
        }}
      >
        {/* Fixed Icons */}
        <div className="fixed-icons">
          <div className="fixed-icon hand-icon">
            <img src={handIcon} alt="Hand Icon" />
            <div className="popup-image">
              <img src={accessPopup} alt="Access Popup" />
            </div>
          </div>
          <div className="fixed-icon bottom-icon">
            <img src={icon128} alt="Icon" />
          </div>
        </div>
        <div className="header">
          <div className="leftchild">
            <img
              src="https://visa-haiti.serpro.gov.br/sci/pages/web/ui/assets/images/brasao-republica.jpg"
              alt=""
            />
            <h3> Ministry of Foreign Affairs</h3>
          </div>
          <div className="rightchild">
            <div
              className="language-selector"
              onClick={() => setLanguageOpen(!languageOpen)}
            >
              <img
                src={selectedFlag}
                alt={selectedLanguage}
                className="flag-icon"
              />
              <span>{selectedLanguage}</span>

              <FaCaretDown
                size={16}
                className={`dropdown-arrow ${languageOpen ? "open" : ""}`}
              />
              {languageOpen && (
                <div className="language-dropdown">
                  <div
                    className="language-option"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLanguageSelect(
                        "Português (Brasil)",
                        "https://visa-haiti.serpro.gov.br/sci/pages/web/ui/assets/images/lang/flag-brasil-a.png",
                      );
                    }}
                  >
                    <img
                      src="https://visa-haiti.serpro.gov.br/sci/pages/web/ui/assets/images/lang/flag-brasil-a.png"
                      alt="Portuguese"
                      className="flag-icon"
                    />
                    <span>Português (Brasil)</span>
                  </div>
                  <div
                    className="language-option"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLanguageSelect(
                        "English",
                        "https://visa-haiti.serpro.gov.br/sci/pages/web/ui/assets/images/lang/flag-england-a.png",
                      );
                    }}
                  >
                    <img
                      src="https://visa-haiti.serpro.gov.br/sci/pages/web/ui/assets/images/lang/flag-england-a.png"
                      alt="English"
                      className="flag-icon"
                    />
                    <span>English</span>
                  </div>
                  <div
                    className="language-option"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLanguageSelect(
                        "Français",
                        "https://visa-haiti.serpro.gov.br/sci/pages/web/ui/assets/images/lang/flag-france-a.png",
                      );
                    }}
                  >
                    <img
                      src="https://visa-haiti.serpro.gov.br/sci/pages/web/ui/assets/images/lang/flag-france-a.png"
                      alt="French"
                      className="flag-icon"
                    />
                    <span>Français</span>
                  </div>
                  <div
                    className="language-option"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLanguageSelect(
                        "Deutsch",
                        "https://visa-haiti.serpro.gov.br/sci/pages/web/ui/assets/images/lang/flag-deutsch-a.png",
                      );
                    }}
                  >
                    <img
                      src="https://visa-haiti.serpro.gov.br/sci/pages/web/ui/assets/images/lang/flag-deutsch-a.png"
                      alt="German"
                      className="flag-icon"
                    />
                    <span>Deutsch</span>
                  </div>
                  <div
                    className="language-option"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLanguageSelect(
                        "Español",
                        "https://visa-haiti.serpro.gov.br/sci/pages/web/ui/assets/images/lang/flag-spain-a.png",
                      );
                    }}
                  >
                    <img
                      src="https://visa-haiti.serpro.gov.br/sci/pages/web/ui/assets/images/lang/flag-spain-a.png"
                      alt="Spanish"
                      className="flag-icon"
                    />
                    <span>Español</span>
                  </div>
                </div>
              )}
            </div>
            <div className="accessibility-controls">
              <button
                className="accessibility-btn"
                onClick={() => {
                  if (!isZoomed) setIsZoomed(true);
                }}
                disabled={isZoomed}
              >
                A+
              </button>

              <button
                className="accessibility-btn"
                onClick={() => setIsZoomed(false)}
                disabled={!isZoomed}
              >
                A-
              </button>

              <button
                className="accessibility-btn"
                onClick={() => setDarkMode(!DarkMode)}
              >
                C
              </button>
            </div>
          </div>
        </div>
        <div className="herader2">
          <div
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={20} color="white" />
          </div>
          <div className={`buttons ${mobileMenuOpen ? "mobile-open" : ""}`}>
            <div className="button">
              <FaCheck />
              <p>VISA</p>
            </div>
            <div className="button">
              <FaCheck />
              <p>VERIFY AUTHENTICITY</p>
            </div>
            <div className="button">
              <FaSearch />
              <p>CHECK STATUS</p>
            </div>
            <div className="button">
              <TiClipboard size={"1.3em"} />
              <p>UPDATE VISA REQUEST FORM</p>
            </div>
          </div>
        </div>
        <div className="herader3">
          <p>Authenticity Verification</p>
        </div>
        {errors.msg && <p className="verifyerror">{errors.msg}</p>}
        <div className="header4">
          <div className="child1" onClick={() => setClosed(!closed)}>
            <div className="icon-container">
              {" "}
              {closed ? (
                <ChevronDown color="white" />
              ) : (
                <ChevronUp color="white" />
              )}
            </div>
            <p>RECOVERY DATA</p>
          </div>
          <div className={` headerchild2 child2 ${closed ? "closed" : "open"}`}>
            <div className="inputcontainer">
              <div className="singleinput">
                <div className="lable">
                  <label htmlFor="ApplicationNumber">Application Number </label>
                  <p className="astrict">* </p>
                  <div
                    className="questioncontainer"
                    onMouseEnter={() => setShowTooltip("application")}
                    onMouseLeave={() => setShowTooltip("")}
                  >
                    <img src={helpIcon} alt="Help" className="help-icon" />
                    {showTooltip === "application" && (
                      <div className="tooltip">
                        <img
                          src={applicanNumber}
                          alt="Application Number example"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <input
                  className="input"
                  type="text"
                  name="ApplicationNumber"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      applicationNumber: e.target.value,
                    })
                  }
                  value={formData.applicationNumber}
                />
              </div>

              <div className="singleinput">
                <div className="lable">
                  <label htmlFor="Code">Code </label>
                  <p className="astrict">* </p>
                  <div
                    className="questioncontainer"
                    onMouseEnter={() => setShowTooltip("code")}
                    onMouseLeave={() => setShowTooltip("")}
                  >
                    <img src={helpIcon} alt="Help" className="help-icon" />
                    {showTooltip === "code" && (
                      <div className="tooltip">
                        <img src={codeImage} alt="Code example" />
                      </div>
                    )}
                  </div>
                </div>
                <input
                  className="input"
                  name="code"
                  type="text"
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  value={formData.code}
                />
              </div>
            </div>
            {showcaptcha && (
              <div className="captchacontainer">
                <Form onSucces={onSuccess} captchaRef={captchaRef} />
              </div>
            )}
            <div className="buttoncontainer">
              <div className="actionsbuttons">
                <button className="button returnbutton" onClick={clearButton}>
                  RETURN
                </button>
                <button
                  className="button"
                  onClick={showCaptcha}
                  style={{
                    background: "#0066D0",
                  }}
                >
                  VERIFY AUTHENTICITY
                </button>
              </div>
            </div>
          </div>
        </div>
        {resultData && Object.keys(resultData).length > 0 && (
          <div className="header4">
            <div
              className="child1"
              onClick={() => setResultClosed(!resultClosed)}
            >
              <div className="icon-container">
                {resultClosed ? (
                  <ChevronDown color="white" />
                ) : (
                  <ChevronUp color="white" />
                )}
              </div>
              <p>SEARCH RESULTS</p>
            </div>
            <div className={`child2 ${resultClosed ? "closed" : "open"}`}>
              <div className="searchResult">
                <p className="resulth1">Situation</p>
                <p className="resulth2" style={{ color: "grey" }}>
                  Válido
                </p>
              </div>
            </div>
            <div
              className="actual-data"
              style={{
                maxWidth: "80vw",
                margin: "auto",
                marginTop: "30px",
              }}
            >
              <TemplateAsImage data={resultData} showrightIcons={false} />
            </div>
          </div>
        )}
      </div>
    
    </>
  );
};

export default VerifyAuthenticity;

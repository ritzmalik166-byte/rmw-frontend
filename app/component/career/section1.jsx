"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SubmitButton from "../button/submitnew";

gsap.registerPlugin(ScrollTrigger);

const mixtaPro = "font-['MixtaPro']";

const sequelFontFamily = '"Sequel Sans"';

const labelStyle = {
  fontFamily: sequelFontFamily,
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "16px",
  letterSpacing: "1.2px",
  textTransform: "uppercase",
  color: "#FFFFFF99",
  verticalAlign: "middle",
  display: "block",
  marginBottom: "8px",
};

const headingStyle = {
  fontFamily: sequelFontFamily,
  fontWeight: 500,
  letterSpacing: "0",
  textTransform: "uppercase",
  color: "#FFFFFF",
};

const headingSizeClass =
  "text-[20px] leading-[32px] md:text-[40px] md:leading-[40px] lg:text-[52px] lg:leading-[48px] xl:text-[94px] xl:leading-[71px]";

const clipRevealClass = "overflow-hidden pb-[0.2em] -mb-[0.2em]";
const circleSpotlightDuration = 15;
const inputLineDuration = 0.9;
const inputClass =
  "w-full bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/40";
const fileInputClass =
  "w-full cursor-pointer bg-transparent py-2 text-sm text-white/70 outline-none file:mr-4 file:border-0 file:bg-transparent file:text-xs file:uppercase file:tracking-[1.2px] file:text-white/60";
const inputLineClass =
  "pointer-events-none absolute bottom-0 left-0 block h-px w-full origin-left scale-x-0 bg-[#FFFFFF33]";
const lockedInputClass = `${inputClass} read-only:cursor-not-allowed read-only:opacity-70`;

const OTP_COUNTRY = "India";
const OTP_RESEND_SECONDS = 45;
const RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"];

const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;
const REPEATED_PATTERN_MESSAGE =
  "Please enter a valid phone number. Repeated patterns like 9999999999, 8888888888, 0000000000, or 9898989898 are not allowed.";

function hasInvalidRepeatedPattern(digits) {
  if (!digits) return false;
  if (/^(\d)\1+$/.test(digits)) return true;
  if (digits.length >= 4 && /^(\d)(\d)(?:\1\2)+$/.test(digits)) return true;
  if (digits.length >= 4 && /^(\d{2})\1+$/.test(digits)) return true;
  return false;
}

function normalizeIndianPhone(phone) {
  let digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";

  if (digits.startsWith("91") && digits.length === 12) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0") && digits.length === 11) {
    digits = digits.slice(1);
  }

  return digits;
}

function validateIndianPhone(phone) {
  const local = normalizeIndianPhone(phone);
  if (!local) {
    return "Please enter your phone number.";
  }
  if (!INDIAN_PHONE_REGEX.test(local)) {
    return "Enter a valid 10-digit Indian mobile number starting with 6–9.";
  }
  if (hasInvalidRepeatedPattern(local)) {
    return REPEATED_PATTERN_MESSAGE;
  }
  return null;
}

function maskPhoneForDisplay(phone) {
  const local = normalizeIndianPhone(phone);
  if (!local || local.length < 4) return local;
  return `${local.slice(0, 2)}****${local.slice(-2)}`;
}

function validateResume(file) {
  if (!file || !(file instanceof File) || file.size === 0) {
    return "Please upload your resume.";
  }
  const fileName = file.name.toLowerCase();
  if (!RESUME_EXTENSIONS.some((ext) => fileName.endsWith(ext))) {
    return "Please upload your resume as a PDF, DOC or DOCX file.";
  }
  return null;
}

function getServerMessage(result) {
  return (
    result?.message ||
    result?.error ||
    result?.errors?.[0]?.message ||
    (typeof result?.errors?.[0] === "string" ? result.errors[0] : "") ||
    ""
  );
}

function isServerSuccess(response, result) {
  if (result?.success === false || result?.ok === false) return false;
  return (
    response.ok ||
    result?.success === true ||
    result?.ok === true ||
    result?.status === "success"
  );
}

const EMAIL_INVALID_MESSAGE =
  "Please enter a valid email address (e.g. name@example.com).";

const NAME_INVALID_MESSAGE =
  "Please enter a valid name using letters only (no numbers or special characters).";

const DUMMY_NAMES = new Set([
  "abc",
  "abcd",
  "xyz",
  "test",
  "ritz",
  "ritzmediaworld",
  "ritzmedia",
  "ritzmediaworld.com",
  "ritzmediaworld.in",
  "ritzmediaworld.org",
  "ritzmediaworld.net",
  "ritzmediaworld.io",
  "ritzmediaworld.co",
  "ritzmediaworld.com.au",
  "ritzmediaworld.com.br",
  "ritzmediaworld.com.mx",
  "ritzmediaworld.com.nz",
  "testing",
  "testing123",
  "testing456",
  "testing789",
  "testing101",
  "testing102",
  "testing103",
  "testing104",
  "testing105",
  "demo",
  "demo123",
  "demo456",
  "demo789",
  "demo101",
  "demo102",
  "demo103",
  "demo104",
  "demo105",
  "asdf",
  "qwerty",
  "name",
  "fullname",
  "aaa",
  "bbb",
  "xxx",
  "zzz",
  "null",
  "undefined",
]);

/** Letters only (spaces, hyphens, apostrophes allowed). Rejects numbers, symbols, and dummy values like "abc". */
function validateName(name, fieldLabel = "name") {
  const value = String(name || "").trim();
  if (!value) {
    return `Please enter your ${fieldLabel}.`;
  }

  if (!/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(value)) {
    return NAME_INVALID_MESSAGE;
  }

  const lettersOnly = value.replace(/[^A-Za-z]/g, "");
  if (lettersOnly.length < 2) {
    return NAME_INVALID_MESSAGE;
  }

  const normalized = lettersOnly.toLowerCase();
  if (DUMMY_NAMES.has(normalized) || /^(.)\1+$/i.test(lettersOnly)) {
    return NAME_INVALID_MESSAGE;
  }

  return null;
}

/** local-part@domain.tld with the rules described in the product form. */
function validateEmail(email) {
  const value = String(email || "").trim();
  if (!value) {
    return "Please enter your email address.";
  }

  const atIndex = value.indexOf("@");
  if (atIndex <= 0 || atIndex !== value.lastIndexOf("@")) {
    return EMAIL_INVALID_MESSAGE;
  }

  const local = value.slice(0, atIndex);
  const domain = value.slice(atIndex + 1);

  if (
    !local ||
    local.startsWith(".") ||
    local.endsWith(".") ||
    local.includes("..")
  ) {
    return EMAIL_INVALID_MESSAGE;
  }

  // A-Z a-z 0-9 and ! # $ % & ' * + - / = ? ^ _ ` { | } ~ plus single dots
  if (!/^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+$/.test(local)) {
    return EMAIL_INVALID_MESSAGE;
  }

  if (!domain || !domain.includes(".")) {
    return EMAIL_INVALID_MESSAGE;
  }

  const labels = domain.split(".");
  if (labels.length < 2) {
    return EMAIL_INVALID_MESSAGE;
  }

  const tld = labels[labels.length - 1];
  if (!/^[A-Za-z]{2,}$/.test(tld)) {
    return EMAIL_INVALID_MESSAGE;
  }

  for (const label of labels) {
    if (!label || label.startsWith("-") || label.endsWith("-")) {
      return EMAIL_INVALID_MESSAGE;
    }
    if (!/^[A-Za-z0-9-]+$/.test(label)) {
      return EMAIL_INVALID_MESSAGE;
    }
  }

  return null;
}

const Field = ({ label, children }) => (
  <div>
    <span style={labelStyle}>{label}</span>
    <div className="relative">
      {children}
      <span data-input-line className={inputLineClass} aria-hidden />
    </div>
  </div>
);

const FieldError = ({ children }) =>
  children ? (
    <p
      className="mt-2 text-xs"
      style={{ fontFamily: sequelFontFamily, color: "#FF8A8A" }}
    >
      {children}
    </p>
  ) : null;

function OtpInput({ value, onChange, onComplete, error, disabled }) {
  const inputRefs = useRef([]);
  const digits = value.padEnd(4, " ").split("").slice(0, 4);

  const updateValue = (nextDigits) => {
    const joined = nextDigits.join("").replace(/\s/g, "");
    onChange(joined);
    if (joined.length === 4 && onComplete) onComplete(joined);
  };

  const focusIndex = (index) => {
    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select();
  };

  const handleChange = (index, raw) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...digits.map((d) => (d === " " ? "" : d))];
    next[index] = digit;
    while (next.length < 4) next.push("");
    updateValue(next);

    if (digit && index < 3) {
      focusIndex(index + 1);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...digits.map((d) => (d === " " ? "" : d))];
      if (next[index]) {
        next[index] = "";
        updateValue(next);
      } else if (index > 0) {
        next[index - 1] = "";
        updateValue(next);
        focusIndex(index - 1);
      }
      return;
    }

    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusIndex(index - 1);
    }
    if (e.key === "ArrowRight" && index < 3) {
      e.preventDefault();
      focusIndex(index + 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);
    if (!pasted) return;
    onChange(pasted);
    if (pasted.length === 4 && onComplete) onComplete(pasted);
    focusIndex(Math.min(pasted.length, 3));
  };

  return (
    <div
      className="grid grid-cols-4 gap-3 md:gap-4"
      role="group"
      aria-label="Enter 4-digit verification code"
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit === " " ? "" : digit}
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={`h-14 w-full border-b-1 border-b-white/10 text-center text-3xl font-semibold text-white outline-none transition-all duration-200 md:h-16 md:text-3xl ${
            error
              ? "focus:ring-[#FF8A8A]/45"
              : digit && digit !== " "
                ? "focus:ring-[#FFD188]/50"
                : "hover:bg-white/[0.04] focus:ring-[#FFD188]/30"
          } disabled:cursor-not-allowed disabled:opacity-50`}
          style={{ fontFamily: sequelFontFamily }}
          data-otp-index={index}
        />
      ))}
    </div>
  );
}

function FormStatusAlert({ status, onDismiss }) {
  if (!status) return null;

  const isSuccess = status.type === "success";
  const isOtpSent = status.variant === "otp-sent";

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      aria-live="polite"
      className="relative mt-6 overflow-hidden py-5 md:py-6"
    >
      <button
        type="button"
        onClick={onDismiss}
        className="absolute top-4 right-4 cursor-pointer text-white/45 transition-colors hover:text-white/80"
        aria-label="Dismiss message"
      >
        <i className="ri-close-line text-xl" />
      </button>

      <div className="min-w-0 pr-8">
        <p
          className="text-[13px] tracking-[1.2px] uppercase"
          style={{
            fontFamily: sequelFontFamily,
            color: isSuccess ? (isOtpSent ? "#FFD188" : "#7CFFB2") : "#FF8A8A",
          }}
        >
          {status.title || (isSuccess ? "Success" : "Something went wrong")}
        </p>
        <p
          className="mt-2 text-sm leading-6 text-white/85 md:text-[15px]"
          style={{ fontFamily: sequelFontFamily }}
        >
          {status.text}
        </p>
        {status.hint ? (
          <p
            className="mt-2 text-xs leading-5 text-white/55"
            style={{ fontFamily: sequelFontFamily }}
          >
            {status.hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}

const headingWords = ["YOUR", "NEXT", "BIG", "IDEA"];

const renderHeadingWord = (color) =>
  headingWords.map((item) => (
    <span key={item} className={`inline-block align-top ${clipRevealClass}`}>
      <span
        data-hero-word
        className="inline-block"
        style={color ? { color } : undefined}
      >
        {item}
      </span>
    </span>
  ));

const AnimatedHeadingLine = () => {
  const wrapRef = useRef(null);
  const goldRef = useRef(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const gold = goldRef.current;
    if (!wrap || !gold) return;

    const getCircleRadius = () => {
      const width = window.innerWidth;
      if (width >= 768) return 65;
      return 22;
    };

    let circleRadius = getCircleRadius();

    const setMask = (x) => {
      circleRadius = getCircleRadius();
      const mask = `radial-gradient(circle ${circleRadius}px at ${x}px 50%, #000 98%, transparent 100%)`;
      gold.style.maskImage = mask;
      gold.style.webkitMaskImage = mask;
    };

    setMask(-circleRadius);

    let spotlightTween = null;

    let onHeaderComplete = null;
    let onStartSpotlight = null;

    const ctx = gsap.context(() => {
      const whiteWords = gsap.utils.toArray("[data-hero-word]", wrap);
      const goldWords = gsap.utils.toArray("[data-hero-word]", gold);

      gsap.set(whiteWords, { yPercent: -110 });
      gsap.set(goldWords, { yPercent: 0 });

      const startSpotlight = () => {
        spotlightTween?.kill();
        spotlightTween = null;

        const proxy = { x: circleRadius };
        setMask(circleRadius);

        spotlightTween = gsap.to(proxy, {
          x: () => wrap.offsetWidth + getCircleRadius(),
          duration: circleSpotlightDuration,
          repeat: -1,
          ease: "none",
          onUpdate: function () {
            setMask(proxy.x);
          },
        });
      };

      const startEntrance = () => {
        const entrance = gsap.timeline({
          onComplete: () => {
            window.dispatchEvent(
              new CustomEvent("section1-heading-entrance-complete"),
            );
          },
        });

        whiteWords.forEach((word, index) => {
          entrance.to(
            word,
            { yPercent: 0, duration: 2, ease: "power4.out" },
            index * 0.08,
          );
        });
      };

      onHeaderComplete = () => {
        startEntrance();
      };

      onStartSpotlight = () => {
        startSpotlight();
      };

      window.addEventListener("header-reveal-complete", onHeaderComplete);
      window.addEventListener("section1-start-spotlight", onStartSpotlight);
    }, wrap);

    return () => {
      spotlightTween?.kill();
      if (onHeaderComplete) {
        window.removeEventListener("header-reveal-complete", onHeaderComplete);
      }
      if (onStartSpotlight) {
        window.removeEventListener(
          "section1-start-spotlight",
          onStartSpotlight,
        );
      }
      ctx.revert();
    };
  }, []);

  return (
    <h1
      style={headingStyle}
      className={`${headingSizeClass} m-0 w-full overflow-visible`}
    >
      <div ref={wrapRef} className="relative w-full overflow-visible">
        <div className="relative z-[1] flex w-full justify-between gap-2 md:justify-center md:gap-8 lg:gap-10 xl:gap-[150px]">
          {renderHeadingWord()}
        </div>
        <div
          ref={goldRef}
          className="pointer-events-none absolute inset-0 z-[2] flex w-full justify-between gap-2 overflow-visible md:justify-center md:gap-8 lg:gap-10 xl:gap-[150px]"
          style={{ ...headingStyle, color: "#FFD188" }}
          aria-hidden
        >
          {renderHeadingWord("#FFD188")}
        </div>
      </div>
    </h1>
  );
};

const section1 = () => {
  const heroRef = useRef(null);
  const formRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [resumeError, setResumeError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [otpError, setOtpError] = useState(null);
  const [otpValue, setOtpValue] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const formLocked = otpSent && !otpVerified;

  useEffect(() => {
    if (!formLocked || resendCountdown <= 0) return;
    const timer = window.setTimeout(() => {
      setResendCountdown((current) => Math.max(current - 1, 0));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [formLocked, resendCountdown]);

  useEffect(() => {
    if (!formLocked) return;
    const timer = window.setTimeout(() => {
      formRef.current?.querySelector('[data-otp-index="0"]')?.focus();
    }, 150);
    return () => window.clearTimeout(timer);
  }, [formLocked]);

  const resetOtpState = () => {
    setOtpSent(false);
    setOtpVerified(false);
    setVerifiedPhone("");
    setOtpValue("");
    setOtpError(null);
    setResendCountdown(0);
  };

  const handleNameInput = (e) => {
    if (formLocked) return;
    e.currentTarget.value = e.currentTarget.value.replace(
      /[^A-Za-z '-]/g,
      "",
    );
    if (nameError) setNameError(null);
  };

  const handlePhoneInput = (e) => {
    if (formLocked) return;
    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9+]/g, "");
    if (phoneError) setPhoneError(null);
    if (otpVerified) resetOtpState();
  };

  const handleEmailInput = () => {
    if (emailError) setEmailError(null);
  };

  const handleResumeChange = () => {
    if (resumeError) setResumeError(null);
  };

  const sendOtp = async (phone) => {
    setSendingOtp(true);
    setOtpError(null);

    try {
      const response = await fetch("/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, country: OTP_COUNTRY }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          result.message || "Could not send OTP. Please try again.";
        setOtpError(message);
        setStatus({
          type: "error",
          variant: "otp-error",
          title: "OTP not sent",
          text: message,
          hint:
            response.status === 429
              ? "Please wait a moment before requesting another code."
              : "Check your phone number and try again, or refresh the page to start over.",
        });
        return false;
      }

      setOtpSent(true);
      setOtpVerified(false);
      setVerifiedPhone("");
      setOtpValue("");
      setResendCountdown(OTP_RESEND_SECONDS);
      setStatus({
        type: "success",
        variant: "otp-sent",
        title: "Verification code sent",
        text: `We sent a 4-digit code to ${maskPhoneForDisplay(phone)}.`,
        hint: "Your application details are locked while you verify. Enter the code below or refresh the page to edit again.",
      });
      return true;
    } catch (error) {
      console.error("OTP send error:", error);
      const message = "Could not send OTP. Please try again.";
      setOtpError(message);
      setStatus({
        type: "error",
        variant: "otp-error",
        title: "OTP not sent",
        text: message,
        hint: "Please check your connection and try again.",
      });
      return false;
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async (phone, otp) => {
    try {
      const response = await fetch("/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, country: OTP_COUNTRY, otp }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = result.message || "Invalid OTP. Please try again.";
        setOtpError(message);
        setStatus({
          type: "error",
          variant: "otp-verify-error",
          title: "Verification failed",
          text: message,
          hint: "Double-check the 4-digit code or tap Resend OTP to get a new one.",
        });
        return false;
      }

      setOtpVerified(true);
      setVerifiedPhone(phone);
      setOtpError(null);
      setStatus({
        type: "success",
        variant: "otp-verified",
        title: "Phone verified",
        text: "Your number is verified. Submitting your application now.",
      });
      return true;
    } catch (error) {
      console.error("OTP verify error:", error);
      const message = "Could not verify OTP. Please try again.";
      setOtpError(message);
      setStatus({
        type: "error",
        variant: "otp-verify-error",
        title: "Verification failed",
        text: message,
        hint: "Please try entering the code again.",
      });
      return false;
    }
  };

  const uploadResume = async (resumeFile) => {
    try {
      const uploadData = new FormData();
      uploadData.append("resume", resumeFile);

      const response = await fetch("/api/upload-resume", {
        method: "POST",
        body: uploadData,
      });
      const result = await response.json().catch(() => ({}));
      const ok = isServerSuccess(response, result) && !!result?.filePath;

      if (!ok) {
        console.error("upload-resume failed:", {
          status: response.status,
          statusText: response.statusText,
          result,
        });
      }

      return {
        ok,
        filePath: result?.filePath,
        message: getServerMessage(result),
        httpStatus: response.status,
      };
    } catch (error) {
      console.error("Error uploading resume:", error);
      return { ok: false, message: "", httpStatus: 0 };
    }
  };

  const submitApplication = async (formData) => {
    try {
      formData.append("etype", "career");
      const response = await fetch("/api/system-settings/contact-enquiry", {
        method: "POST",
        body: formData,
      });
      const result = await response.json().catch(() => ({}));
      const ok = isServerSuccess(response, result);

      if (!ok) {
        console.error("career contact-enquiry failed:", {
          status: response.status,
          statusText: response.statusText,
          result,
        });
      }

      return {
        ok,
        message: getServerMessage(result),
        httpStatus: response.status,
      };
    } catch (error) {
      console.error("Error submitting form fields:", error);
      return { ok: false, message: "", httpStatus: 0 };
    }
  };

  const showValidationError = (text) => {
    setStatus({
      type: "error",
      variant: "validation-error",
      title: "Check your details",
      text,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || sendingOtp) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const resumeFile = formData.get("resume");
    const name = (formData.get("name") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const phone = (formData.get("phone") || "").toString().trim();

    const nameValidationError = validateName(name, "first name");
    if (nameValidationError) {
      setNameError(nameValidationError);
      showValidationError(nameValidationError);
      return;
    }

    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      showValidationError(emailValidationError);
      return;
    }

    const phoneValidationError = validateIndianPhone(phone);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      showValidationError(phoneValidationError);
      return;
    }

    const resumeValidationError = validateResume(resumeFile);
    if (resumeValidationError) {
      setResumeError(resumeValidationError);
      showValidationError(resumeValidationError);
      return;
    }

    const normalizedPhone = normalizeIndianPhone(phone);

    setSubmitting(true);
    setStatus(null);
    setNameError(null);
    setPhoneError(null);
    setEmailError(null);
    setResumeError(null);
    setOtpError(null);

    const phoneVerified = otpVerified && verifiedPhone === normalizedPhone;

    if (!phoneVerified) {
      if (!otpSent) {
        await sendOtp(normalizedPhone);
        setSubmitting(false);
        return;
      }

      const enteredOtp = otpValue.trim();
      if (!/^\d{4}$/.test(enteredOtp)) {
        const message = "Enter the 4-digit OTP sent to your phone.";
        setOtpError(message);
        setStatus({
          type: "error",
          variant: "otp-verify-error",
          title: "Enter verification code",
          text: message,
          hint: "Please enter all 4 digits from the SMS we sent you.",
        });
        setSubmitting(false);
        return;
      }

      const verified = await verifyOtp(normalizedPhone, enteredOtp);
      if (!verified) {
        setSubmitting(false);
        return;
      }
    }

    formData.set("name", name);
    formData.set("email", email);
    formData.set("phone", normalizedPhone);

    try {
      const upload = await uploadResume(resumeFile);
      if (!upload.ok) {
        setStatus({
          type: "error",
          variant: "upload-error",
          title: "Resume upload failed",
          text:
            upload.message ||
            (upload.httpStatus
              ? `Resume upload failed (HTTP ${upload.httpStatus}). Please try again.`
              : "Could not upload your resume. Please check your connection and try again."),
          hint: "Your phone is already verified, so you can retry without a new code.",
        });
        return;
      }

      formData.append("resumePath", upload.filePath);
      formData.delete("resume");

      const submission = await submitApplication(formData);
      if (!submission.ok) {
        setStatus({
          type: "error",
          variant: "submit-error",
          title: "Submission failed",
          text:
            submission.message ||
            (submission.httpStatus
              ? `Submission failed (HTTP ${submission.httpStatus}). Please try again.`
              : "Server error. Please try again later."),
          hint: "Your phone is already verified, so you can retry without a new code.",
        });
        return;
      }

      setStatus({
        type: "success",
        variant: "submit-success",
        title: "Application submitted",
        text: submission.message || "Application submitted successfully!",
        hint: "Our team will review your profile and get in touch if there's a match.",
      });
      form.reset();
      setNameError(null);
      setPhoneError(null);
      setEmailError(null);
      setResumeError(null);
      resetOtpState();
    } catch (error) {
      console.error("Error during submission:", error);
      setStatus({
        type: "error",
        variant: "submit-error",
        title: "Server error",
        text: "An unexpected error occurred. Please try again later.",
        hint: "If the issue continues, refresh the page and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = () => {
    const form = formRef.current;
    if (!form) return;
    const phone = (new FormData(form).get("phone") || "").toString().trim();
    sendOtp(normalizeIndianPhone(phone));
  };

  useLayoutEffect(() => {
    let headingDone = false;
    let heroDone = false;

    const onAllTextDone = () => {
      if (headingDone && heroDone) {
        window.dispatchEvent(new CustomEvent("section1-start-spotlight"));
        window.dispatchEvent(new CustomEvent("section1-start-input-lines"));
      }
    };

    const onHeadingDone = () => {
      headingDone = true;
      onAllTextDone();
    };

    const onHeroDone = () => {
      heroDone = true;
      onAllTextDone();
    };

    window.addEventListener(
      "section1-heading-entrance-complete",
      onHeadingDone,
    );
    window.addEventListener("section1-hero-reveal-complete", onHeroDone);

    return () => {
      window.removeEventListener(
        "section1-heading-entrance-complete",
        onHeadingDone,
      );
      window.removeEventListener("section1-hero-reveal-complete", onHeroDone);
    };
  }, []);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let onHeaderComplete = null;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray("[data-hero-reveal]", hero);
      if (!items.length) return;

      gsap.set(items, { yPercent: -110 });

      const startReveal = () => {
        gsap.to(items, {
          yPercent: 0,
          duration: 2,
          ease: "power4.out",
          stagger: 0.08,
          onComplete: () => {
            window.dispatchEvent(
              new CustomEvent("section1-hero-reveal-complete"),
            );
          },
        });
      };

      onHeaderComplete = () => {
        startReveal();
      };

      window.addEventListener("header-reveal-complete", onHeaderComplete);
    }, hero);

    return () => {
      if (onHeaderComplete) {
        window.removeEventListener("header-reveal-complete", onHeaderComplete);
      }
      ctx.revert();
    };
  }, []);

  useLayoutEffect(() => {
    const form = formRef.current;
    if (!form) return;

    let onStartInputLines = null;
    let inputLinesStarted = false;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray("[data-input-line]", form);
      if (!lines.length) return;

      gsap.set(lines, { scaleX: 0, transformOrigin: "left center" });

      const startInputLines = () => {
        if (inputLinesStarted) return;
        inputLinesStarted = true;

        gsap.to(lines, {
          scaleX: 1,
          duration: inputLineDuration,
          ease: "power2.out",
          stagger: 0.1,
        });
      };

      onStartInputLines = () => {
        startInputLines();
      };

      window.addEventListener("section1-start-input-lines", onStartInputLines);
    }, form);

    return () => {
      if (onStartInputLines) {
        window.removeEventListener(
          "section1-start-input-lines",
          onStartInputLines,
        );
      }
      ctx.revert();
    };
  }, []);

  return (
    <section className="bg-[#0D1334] px-5 py-[0px] pb-[35px] sm:px-8 md:px-12 md:pt-[20px] md:pb-[70px]">
      <div className="mx-auto w-full max-w-[1500px]">
        <div ref={heroRef} className="w-full overflow-x-clip">
          <AnimatedHeadingLine />

          {/* Mobile/tablet: STARTS - HERE on one row, copy below.
              lg+: 3-column grid so copy sits in the middle without overlapping. */}
          <div className="mt-2 grid w-full grid-cols-2 items-start gap-x-3 gap-y-3 md:mt-4 md:gap-y-4 lg:mt-3 lg:grid-cols-[minmax(0,auto)_minmax(0,1fr)_minmax(0,auto)] lg:items-center lg:gap-x-4 xl:mt-4 xl:gap-x-8">
            <span
              style={headingStyle}
              className={`${headingSizeClass} col-start-1 row-start-1 justify-self-start ${clipRevealClass}`}
            >
              <span data-hero-reveal className="inline-block">
                STARTS
              </span>
            </span>

            <span
              style={headingStyle}
              className={`${headingSizeClass} col-start-2 row-start-1 justify-self-end text-right lg:col-start-3 ${clipRevealClass}`}
            >
              <span data-hero-reveal className="inline-block">
                HERE.
              </span>
            </span>

            <p
              className={`${mixtaPro} col-span-2 row-start-2 mx-auto w-full max-w-[640px] px-1 text-center text-[15px] font-[300] italic leading-[20px] text-white normal-case sm:text-[16px] md:text-[22px] md:leading-[28px] lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:max-w-none lg:px-3 lg:text-[18px] lg:leading-snug xl:px-6 xl:text-[26px] xl:leading-[32px]`}
            >
              <span data-hero-reveal className="block text-center">
                Passionate about media, storytelling or strategy? We'd love to
                hear from you.
              </span>
            </p>
          </div>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mx-auto mt-7 w-full max-w-[765px] md:mt-8 lg:mt-14"
        >
          <div className="grid grid-cols-1 xl:gap-5 gap-8 md:grid-cols-2 md:gap-x-10">
            <div>
              <Field label="FIRST NAME*">
                <input
                  type="text"
                  name="name"
                  required
                  readOnly={formLocked}
                  className={lockedInputClass}
                  onInput={handleNameInput}
                  aria-invalid={nameError ? "true" : undefined}
                />
              </Field>
              <FieldError>{nameError}</FieldError>
            </div>
            <div>
              <Field label=" EMAIL ADDRESS*">
                <input
                  type="email"
                  name="email"
                  required
                  readOnly={formLocked}
                  className={lockedInputClass}
                  onInput={handleEmailInput}
                  aria-invalid={emailError ? "true" : undefined}
                />
              </Field>
              <FieldError>{emailError}</FieldError>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 xl:gap-5 gap-8 md:mt-10 md:grid-cols-2 md:gap-x-10">
            <div>
              <Field label="PHONE NUMBER*">
                <input
                  type="tel"
                  name="phone"
                  required
                  readOnly={formLocked}
                  inputMode="numeric"
                  maxLength={14}
                  className={lockedInputClass}
                  onInput={handlePhoneInput}
                  aria-invalid={phoneError ? "true" : undefined}
                />
              </Field>
              <FieldError>{phoneError}</FieldError>
            </div>
            <Field label="Apply For*">
              <input
                type="text"
                name="category"
                required
                readOnly={formLocked}
                className={lockedInputClass}
              />
            </Field>
          </div>

          <div className="mt-8 md:mt-10 ">
            <Field label="UPLOAD RESUME*">
              {/* Not `disabled` while locked: disabled inputs are dropped from FormData. */}
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                required
                aria-disabled={formLocked ? "true" : undefined}
                aria-invalid={resumeError ? "true" : undefined}
                onClick={(e) => {
                  if (formLocked) e.preventDefault();
                }}
                onChange={handleResumeChange}
                className={`${fileInputClass} ${formLocked ? "pointer-events-none opacity-70" : ""}`}
              />
            </Field>
            <FieldError>{resumeError}</FieldError>
          </div>

          <div className="mt-8 md:mt-10">
            <Field label="MESSAGE*">
              <textarea
                rows={4}
                name="message"
                readOnly={formLocked}
                className={`${lockedInputClass} resize-none`}
              />
            </Field>
          </div>

          {formLocked ? (
            <div className="mt-8 md:mt-10">
              <p
                className="text-[12px] tracking-[1.2px] uppercase"
                style={{ fontFamily: sequelFontFamily, color: "#FFD188" }}
              >
                Verify your phone
              </p>
              <p
                className="mt-1 text-sm text-white/75"
                style={{ fontFamily: sequelFontFamily }}
              >
                Enter the 4-digit code sent to your mobile number.
              </p>

              <OtpInput
                value={otpValue}
                onChange={(next) => {
                  setOtpValue(next);
                  if (otpError) setOtpError(null);
                }}
                error={otpError}
                disabled={submitting || sendingOtp}
              />

              {otpError ? (
                <p
                  className="mt-4 flex items-center gap-2 text-xs"
                  style={{ fontFamily: sequelFontFamily, color: "#FF8A8A" }}
                >
                  <i className="ri-error-warning-line text-base" />
                  {otpError}
                </p>
              ) : null}

              <p
                className="mt-4 text-xs text-white/55"
                style={{ fontFamily: sequelFontFamily }}
              >
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  className="cursor-pointer font-medium text-[#FFD188] underline underline-offset-2 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={sendingOtp || submitting || resendCountdown > 0}
                  onClick={handleResendOtp}
                >
                  {sendingOtp
                    ? "Sending..."
                    : resendCountdown > 0
                      ? `Resend OTP in ${resendCountdown}s`
                      : "Resend OTP"}
                </button>
              </p>
            </div>
          ) : null}

          <SubmitButton
            disabled={submitting || sendingOtp}
            label={
              sendingOtp
                ? "SENDING OTP..."
                : submitting
                  ? formLocked
                    ? "VERIFYING..."
                    : "SUBMITTING..."
                  : formLocked
                    ? "VERIFY & SUBMIT"
                    : "SUBMIT"
            }
          />

          <FormStatusAlert
            status={status}
            onDismiss={() => setStatus(null)}
          />
        </form>
      </div>
    </section>
  );
};

export default section1;

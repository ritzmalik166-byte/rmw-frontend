"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
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
  "text-[20px] leading-[32px] md:text-[48px] md:leading-[44px] lg:text-[75px] lg:leading-[56px] xl:text-[94px] xl:leading-[71px]";

const clipRevealClass = "overflow-hidden pb-[0.2em] -mb-[0.2em]";
const circleSpotlightDuration = 15;
const inputLineDuration = 0.9;
const inputClass =
  "w-full bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/40";
const inputLineClass =
  "pointer-events-none absolute bottom-0 left-0 block h-px w-full origin-left scale-x-0 bg-[#FFFFFF33]";
const selectClass = `${inputClass} appearance-none cursor-pointer`;

const COUNTRY_OPTIONS = ["India", "UAE", "UK", "Singapore", "USA"];
const REASON_OPTIONS = [
  "General Inquiry",
  "New Project",
  "RFP Submission",
  "Partnership",
];
const HOW_HEARD_OPTIONS = [
  "Search Engine",
  "Social Media",
  "Referral",
  "Advertisement",
  "Other",
];
const DEFAULT_REASON = REASON_OPTIONS[0];
const DEFAULT_HOW_HEARD = HOW_HEARD_OPTIONS[0];

/** Local mobile rules per country (digits only, no country code). */
const COUNTRY_PHONE_RULES = {
  India: {
    length: 10,
    regex: /^[6-9]\d{9}$/,
    countryCodes: ["91"],
    message: "Enter a valid 10-digit Indian mobile number starting with 6–9.",
  },
  UAE: {
    length: 9,
    regex: /^5\d{8}$/,
    countryCodes: ["971"],
    message: "Enter a valid 9-digit UAE mobile number starting with 5.",
  },
  UK: {
    length: 10,
    regex: /^7\d{9}$/,
    countryCodes: ["44"],
    message: "Enter a valid 10-digit UK mobile number starting with 7.",
  },
  Singapore: {
    length: 8,
    regex: /^[89]\d{7}$/,
    countryCodes: ["65"],
    message:
      "Enter a valid 8-digit Singapore mobile number starting with 8 or 9.",
  },
  USA: {
    length: 10,
    regex: /^[2-9]\d{2}[2-9]\d{6}$/,
    countryCodes: ["1"],
    message:
      "Enter a valid 10-digit USA phone number (area code cannot start with 0 or 1).",
  },
};

const REPEATED_PATTERN_MESSAGE =
  "Please enter a valid phone number. Repeated patterns like 9999999999, 8888888888, 0000000000, or 9898989898 are not allowed.";

function hasInvalidRepeatedPattern(digits) {
  if (!digits) return false;
  // All same digit: 0000000000, 9999999999, 8888888888
  if (/^(\d)\1+$/.test(digits)) return true;
  // Alternating pair: 9898989898, 1212121212
  if (digits.length >= 4 && /^(\d)(\d)(?:\1\2)+$/.test(digits)) return true;
  // Two-digit block repeat: 989898989898-style when length allows
  if (digits.length >= 4 && /^(\d{2})\1+$/.test(digits)) return true;
  return false;
}

function normalizeLocalPhone(phone, country) {
  let digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";

  const rule = COUNTRY_PHONE_RULES[country];
  if (!rule) return digits;

  const lengths = Array.isArray(rule.length) ? rule.length : [rule.length];
  const maxLen = Math.max(...lengths);

  // Strip leading country code when pasted with it
  const codes = [...(rule.countryCodes || [])].sort(
    (a, b) => b.length - a.length,
  );
  for (const code of codes) {
    if (digits.startsWith(code) && digits.length > maxLen) {
      digits = digits.slice(code.length);
      break;
    }
  }

  // Strip leading trunk 0 (e.g. 09876543210 → 9876543210)
  if (digits.startsWith("0") && digits.length > maxLen) {
    digits = digits.slice(1);
  }

  return digits;
}

function validatePhoneForCountry(phone, country) {
  if (!country) {
    return "Please select a country.";
  }

  const rule = COUNTRY_PHONE_RULES[country];
  if (!rule) {
    return "Please select a valid country.";
  }

  const local = normalizeLocalPhone(phone, country);
  if (!local) {
    return "Please enter your phone number.";
  }

  const lengths = Array.isArray(rule.length) ? rule.length : [rule.length];
  if (!lengths.includes(local.length) || !rule.regex.test(local)) {
    return rule.message;
  }

  if (hasInvalidRepeatedPattern(local)) {
    return REPEATED_PATTERN_MESSAGE;
  }

  return null;
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
  "asdf",
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

function getPhoneMaxLength(country) {
  const rule = COUNTRY_PHONE_RULES[country];
  if (!rule) return 15;
  const lengths = Array.isArray(rule.length) ? rule.length : [rule.length];
  // Allow room for + / country code while typing
  return Math.max(...lengths) + 4;
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

const SelectField = ({
  label,
  placeholder,
  options,
  name,
  required,
  value,
  onChange,
  disabled = false,
}) => (
  <Field label={label}>
    <div className="relative">
      <select
        className={`${selectClass} ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
        name={name}
        required={required}
        disabled={disabled}
        {...(value !== undefined ? { value, onChange } : { defaultValue: "" })}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-[#0D1334] text-white"
          >
            {option}
          </option>
        ))}
      </select>
      <i className="ri-arrow-down-s-line pointer-events-none absolute right-0 bottom-2 text-lg text-white/60" />
    </div>
  </Field>
);

const lockedInputClass = `${inputClass} read-only:cursor-not-allowed read-only:opacity-70`;

function maskPhoneForDisplay(phone, country) {
  const local = normalizeLocalPhone(phone, country);
  if (!local || local.length < 4) return local;
  return `${local.slice(0, 2)}****${local.slice(-2)}`;
}

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
    <div>
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
            className={`h-14 w-full   text-center text-3xl font-semibold text-white outline-none transition-all duration-200 md:h-16 md:text-3xl border-b-1 border-b-white/10 ${
              error
                ? "  focus:ring-[#FF8A8A]/45"
                : digit && digit !== " "
                  ? " focus:ring-[#FFD188]/50"
                  : "hover:bg-white/[0.04] focus:ring-[#FFD188]/30"
            } disabled:cursor-not-allowed disabled:opacity-50`}
            style={{ fontFamily: sequelFontFamily }}
            data-otp-index={index}
          />
        ))}
      </div>
    </div>
  );
}

function FormStatusAlert({ status, onDismiss }) {
  if (!status) return null;

  const isSuccess = status.type === "success";
  const isOtpSent = status.variant === "otp-sent";

  const iconClass = isSuccess
    ? isOtpSent
      ? "ri-shield-check-line text-[#FFD188]"
      : "ri-checkbox-circle-line text-[#7CFFB2]"
    : "ri-error-warning-line text-[#FF8A8A]";

 
  return (
    <div
      role={isSuccess ? "status" : "alert"}
      aria-live="polite"
      className={`relative mt-6 overflow-hidden py-5  md:py-6 `}
    >
      <button
        type="button"
        onClick={onDismiss}
        className="absolute top-4 right-4 cursor-pointer text-white/45 transition-colors hover:text-white/80"
        aria-label="Dismiss message"
      >
        <i className="ri-close-line text-xl" />
      </button>

      <div className="flex items-start gap-4 ">
        
        <div className="min-w-0">
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
    </div>
  );
}

const headingWords = ["WE", "WOULD", "BE", "HAPPY", "TO"];

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
    <div style={headingStyle} className={`${headingSizeClass} m-0 w-full`}>
      <div ref={wrapRef} className="relative w-full">
        <div className="relative z-[1] flex w-full justify-between">
          {renderHeadingWord()}
        </div>
        <div
          ref={goldRef}
          className="pointer-events-none absolute inset-0 z-[2] flex w-full justify-between"
          style={{ ...headingStyle, color: "#FFD188" }}
          aria-hidden
        >
          {renderHeadingWord("#FFD188")}
        </div>
      </div>
    </div>
  );
};

const Section1 = () => {
  const heroRef = useRef(null);
  const formRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [country, setCountry] = useState("");
  const [reason, setReason] = useState(DEFAULT_REASON);
  const [howHeard, setHowHeard] = useState(DEFAULT_HOW_HEARD);
  const [firstNameError, setFirstNameError] = useState(null);
  const [lastNameError, setLastNameError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState(null);
  const [otpValue, setOtpValue] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const formLocked = otpSent && !otpVerified;

  useLayoutEffect(() => {
    if (!otpSent || otpVerified || resendCountdown <= 0) return;

    
    const timer = window.setInterval(() => {
      setResendCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [otpSent, otpVerified, resendCountdown]);

  useLayoutEffect(() => {
    if (formLocked) {
      const timer = window.setTimeout(() => {
        const firstOtpInput = document.querySelector('[data-otp-index="0"]');
        firstOtpInput?.focus();
      }, 150);
      return () => window.clearTimeout(timer);
    }
  }, [formLocked]);

  const handleNameInput = (e, clearError) => {
    if (formLocked) return;
    e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-z '-]/g, "");
    if (clearError) clearError();
  };

  const handlePhoneInput = (e) => {
    if (formLocked) return;
    const cleaned = e.currentTarget.value.replace(/[^0-9+]/g, "");
    e.currentTarget.value = cleaned;
    if (phoneError) setPhoneError(null);
  };

  const handleEmailInput = () => {
    if (emailError) setEmailError(null);
  };

  const handleCountryChange = (e) => {
    if (formLocked) return;
    setCountry(e.target.value);
    setPhoneError(null);
  };

  const handleReasonChange = (e) => {
    if (formLocked) return;
    setReason(e.target.value);
  };

  const handleHowHeardChange = (e) => {
    if (formLocked) return;
    setHowHeard(e.target.value);
  };

  const sendOtp = async (phone, selectedCountry) => {
    setSendingOtp(true);
    setOtpError(null);

    try {
      const response = await fetch("/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, country: selectedCountry }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = result.message || "Could not send OTP. Please try again.";
        setOtpError(message);
        setStatus({
          type: "error",
          variant: "otp-error",
          title: "OTP not sent",
          text: message,
          hint: "Check your phone number and try again, or refresh the page to start over.",
        });
        return false;
      }

      setOtpSent(true);
      setOtpVerified(false);
      setOtpValue("");
      setResendCountdown(45);
      setStatus({
        type: "success",
        variant: "otp-sent",
        title: "Verification code sent",
        text: `We sent a 4-digit code to ${maskPhoneForDisplay(phone, selectedCountry)}.`,
        hint: "Your form details are locked while you verify. Enter the code below or refresh the page to edit again.",
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

  const verifyOtp = async (phone, selectedCountry, otp) => {
    try {
      const response = await fetch("/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, country: selectedCountry, otp }),
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
      setOtpError(null);
      setStatus({
        type: "success",
        variant: "otp-verified",
        title: "Phone verified",
        text: "Your number is verified. Submitting your enquiry now.",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const firstName = (formData.get("firstName") || "").toString().trim();
    const lastName = (formData.get("lastName") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const phone = (formData.get("phone") || "").toString().trim();
    const formReason = (formData.get("reason") || reason || "").toString().trim();
    const selectedCountry = (formData.get("country") || country || "")
      .toString()
      .trim();
    const formHowHeard = (formData.get("howHeard") || howHeard || "").toString().trim();
    const messageText = (formData.get("message") || "").toString().trim();

    const firstNameValidationError = validateName(firstName, "first name");
    if (firstNameValidationError) {
      setFirstNameError(firstNameValidationError);
      setStatus({
        type: "error",
        variant: "validation-error",
        title: "Check your details",
        text: firstNameValidationError,
      });
      return;
    }

    const lastNameValidationError = validateName(lastName, "last name");
    if (lastNameValidationError) {
      setLastNameError(lastNameValidationError);
      setStatus({
        type: "error",
        variant: "validation-error",
        title: "Check your details",
        text: lastNameValidationError,
      });
      return;
    }

    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      setStatus({
        type: "error",
        variant: "validation-error",
        title: "Check your details",
        text: emailValidationError,
      });
      return;
    }

    const phoneValidationError = validatePhoneForCountry(
      phone,
      selectedCountry,
    );
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      setStatus({
        type: "error",
        variant: "validation-error",
        title: "Check your details",
        text: phoneValidationError,
      });
      return;
    }

    const normalizedPhone = normalizeLocalPhone(phone, selectedCountry);

    setSubmitting(true);
    setStatus(null);
    setFirstNameError(null);
    setLastNameError(null);
    setPhoneError(null);
    setEmailError(null);
    setOtpError(null);

    if (!otpSent || !otpVerified) {
      if (!otpSent) {
        await sendOtp(normalizedPhone, selectedCountry);
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

      const verified = await verifyOtp(
        normalizedPhone,
        selectedCountry,
        enteredOtp,
      );
      if (!verified) {
        setSubmitting(false);
        return;
      }
    }

    const message = [
      `Reason for Inquiry: ${formReason || DEFAULT_REASON}`,
      `Country: ${selectedCountry || "N/A"}`,
      `How did you hear about us: ${formHowHeard || DEFAULT_HOW_HEARD}`,
      "",
      `Message: ${messageText || "N/A"}`,
    ].join("\n");

    const data = {
      etype: "ContactUs",
      name: `${firstName} ${lastName}`.trim(),
      phone: normalizedPhone,
      email,
      message,
    };

    try {
      const response = await fetch("/api/system-settings/contact-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus({
          type: "success",
          variant: "submit-success",
          title: "Enquiry submitted",
          text: result.message || "Query submitted successfully!",
          hint: "Our team will get back to you shortly.",
        });
        form.reset();
        setCountry("");
        setReason(DEFAULT_REASON);
        setHowHeard(DEFAULT_HOW_HEARD);
        setFirstNameError(null);
        setLastNameError(null);
        setPhoneError(null);
        setEmailError(null);
        setOtpSent(false);
        setOtpVerified(false);
        setOtpValue("");
        setOtpError(null);
        setResendCountdown(0);
      } else {
        // The backend sometimes still persists the enquiry even if it returns a non-2xx.
        // Show the real server response so the UI isn't misleading.
        const serverMessage =
          result?.message ||
          result?.error ||
          result?.errors?.[0]?.message ||
          result?.errors?.[0] ||
          "";
        const vendorSuccess =
          result?.ok === true ||
          result?.success === true ||
          result?.status === "success";
        console.error("contact-enquiry non-2xx:", {
          status: response.status,
          statusText: response.statusText,
          result,
        });

        if (vendorSuccess) {
          setStatus({
            type: "success",
            variant: "submit-success",
            title: "Enquiry submitted",
            text: serverMessage || "Query submitted successfully!",
            hint: "The backend reported success, even though it returned a non-2xx status.",
          });
          form.reset();
          setCountry("");
          setFirstNameError(null);
          setLastNameError(null);
          setPhoneError(null);
          setEmailError(null);
          setOtpSent(false);
          setOtpVerified(false);
          setOtpValue("");
          setOtpError(null);
          return;
        }

        setStatus({
          type: "error",
          variant: "submit-error",
          title: "Submission failed",
          text:
            serverMessage ||
            `Submission failed (HTTP ${response.status}). Please try again.`,
          hint:
            serverMessage ||
            "If the enquiry is saved, you can refresh and try again if needed.",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus({
        type: "error",
        variant: "submit-error",
        title: "Server error",
        text: "Server error. Please try again later.",
        hint: "If the issue continues, refresh the page and try again.",
      });
    } finally {
      setSubmitting(false);
    }
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
    <section className="bg-[#0D1334] px-8 py-[0px] pb-[35px] md:px-12 md:pt-[20px] md:pb-[70px] ">
      <div className="mx-auto max-w-8xl mx-auto max-w-[1500px]">
        <div ref={heroRef}>
          <AnimatedHeadingLine />

          <div className="-mt-3 flex flex-col md:gap-6 gap-1 lg:-mt-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="mb-0 flex w-full justify-between md:mt-5 lg:mb-0 lg:contents">
              <span
                style={headingStyle}
                className={`${headingSizeClass} shrink-0 self-start ${clipRevealClass} lg:order-1 lg:mt-[30px] xl:mt-[40px]`}
              >
                <span data-hero-reveal className="inline-block">
                  ASSIST
                </span>
              </span>
              <span
                style={headingStyle}
                className={`${headingSizeClass} shrink-0 self-start ${clipRevealClass} text-right lg:order-3 lg:mt-[30px] lg:text-right xl:mt-[40px]`}
              >
                <span data-hero-reveal className="inline-block">
                  YOU
                </span>
              </span>
            </div>

            <p
              className={`${mixtaPro} order-2 mt-[0px] max-w-[700px] self-start overflow-hidden text-[16px] md:text-[28px] leading-[20px] md:leading-[32px] font-[300] italic md:leading-snug text-white normal-case md:mt-0 lg:mt-[60px] lg:text-[20px] lg:self-center lg:text-center xl:mt-[90px] xl:-translate-x-[40px] xl:text-[28px] `}
            >
              <span data-hero-reveal className="block">
                Got a project brewing, an RFP to share or something you want to
                ask? Drop your details and we&apos;ll get you to the right
                person
              </span>
            </p>
          </div>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className={`mx-auto mt-7 w-full max-w-[765px] md:mt-7 lg:mt-16 ${formLocked ? "relative" : ""}`}
        >
          {formLocked ? (
            <div
              className="pointer-events-none absolute inset-0 z-[1] "
              aria-hidden
            />
          ) : null}

          <div className={`grid grid-cols-1 xl:gap-5 gap-8 md:grid-cols-2 md:gap-x-10 ${formLocked ? "relative z-0" : ""}`}>
            <div>
              <Field label="FIRST NAME*">
                <input
                  type="text"
                  name="firstName"
                  required
                  readOnly={formLocked}
                  className={lockedInputClass}
                  onInput={(e) =>
                    handleNameInput(e, () => {
                      if (firstNameError) setFirstNameError(null);
                    })
                  }
                  aria-invalid={firstNameError ? "true" : undefined}
                />
              </Field>
              {firstNameError ? (
                <p
                  className="mt-2 text-xs"
                  style={{
                    fontFamily: sequelFontFamily,
                    color: "#FF8A8A",
                  }}
                >
                  {firstNameError}
                </p>
              ) : null}
            </div>
            <div>
              <Field label="LAST NAME*">
                <input
                  type="text"
                  name="lastName"
                  required
                  readOnly={formLocked}
                  className={lockedInputClass}
                  onInput={(e) =>
                    handleNameInput(e, () => {
                      if (lastNameError) setLastNameError(null);
                    })
                  }
                  aria-invalid={lastNameError ? "true" : undefined}
                />
              </Field>
              {lastNameError ? (
                <p
                  className="mt-2 text-xs"
                  style={{
                    fontFamily: sequelFontFamily,
                    color: "#FF8A8A",
                  }}
                >
                  {lastNameError}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 xl:gap-5 gap-8 md:mt-10 md:grid-cols-2 md:gap-x-10">
            <div>
              <Field label="EMAIL ADDRESS*">
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
              {emailError ? (
                <p
                  className="mt-2 text-xs"
                  style={{
                    fontFamily: sequelFontFamily,
                    color: "#FF8A8A",
                  }}
                >
                  {emailError}
                </p>
              ) : null}
            </div>
            <div>
              <Field label="PHONE NUMBER*">
                <input
                  type="tel"
                  name="phone"
                  required
                  readOnly={formLocked}
                  inputMode="numeric"
                  maxLength={getPhoneMaxLength(country)}
                  className={lockedInputClass}
                  onInput={handlePhoneInput}
                  aria-invalid={phoneError ? "true" : undefined}
                />
              </Field>
              {phoneError ? (
                <p
                  className="mt-2 text-xs"
                  style={{
                    fontFamily: sequelFontFamily,
                    color: "#FF8A8A",
                  }}
                >
                  {phoneError}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:mt-10 md:grid-cols-3 md:gap-x-10">
            <SelectField
              label="REASON FOR INQUIRY*"
              placeholder="Select an option"
              name="reason"
              required
              disabled={formLocked}
              value={reason}
              onChange={handleReasonChange}
              options={REASON_OPTIONS}
            />
            <SelectField
              label="COUNTRY*"
              placeholder="Select your country"
              name="country"
              required
              disabled={formLocked}
              value={country}
              onChange={handleCountryChange}
              options={COUNTRY_OPTIONS}
            />
            <SelectField
              label="HOW DID YOU HEAR ABOUT US?"
              placeholder="Select an option"
              name="howHeard"
              disabled={formLocked}
              value={howHeard}
              onChange={handleHowHeardChange}
              options={HOW_HEARD_OPTIONS}
            />
          </div>

          <div className="mt-8 md:mt-10">
            <Field label="MESSAGE (OPTIONAL)">
              <textarea
                rows={4}
                name="message"
                readOnly={formLocked}
                className={`${lockedInputClass} resize-none`}
              />
            </Field>
          </div>

          {formLocked ? (
            <div className="relative z-[2] mt-8 md:mt-10">
              <div className=" flex items-center justify-between gap-3">
                <div>
                  <p
                    className="text-[12px] tracking-[1.2px] uppercase"
                    style={{
                      fontFamily: sequelFontFamily,
                      color: "#FFD188",
                    }}
                  >
                    Verify your phone
                  </p>
                  <p
                    className="mt-1 text-sm text-white/75"
                    style={{ fontFamily: sequelFontFamily }}
                  >
                    Enter the 4-digit code sent to your mobile number.
                  </p>
                </div> 
              </div>

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
                  style={{
                    fontFamily: sequelFontFamily,
                    color: "#FF8A8A",
                  }}
                >
                  <i className="ri-error-warning-line text-base" />
                  {otpError}
                </p>
              ) : (
                <p
                  className="mt-4 text-xs text-white/55"
                  style={{ fontFamily: sequelFontFamily }}
                >
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    className="font-medium text-[#FFD188] underline cursor-pointer underline-offset-2 transition-opacity hover:opacity-80"
                    disabled={sendingOtp || submitting || resendCountdown > 0}
                    onClick={() => {
                      const form = formRef.current;
                      if (!form) return;
                      const formData = new FormData(form);
                      const phone = (formData.get("phone") || "").toString().trim();
                      const selectedCountry = (
                        formData.get("country") ||
                        country ||
                        ""
                      )
                        .toString()
                        .trim();
                      const normalizedPhone = normalizeLocalPhone(
                        phone,
                        selectedCountry,
                      );
                      sendOtp(normalizedPhone, selectedCountry);
                    }}
                  >
                    {sendingOtp
                      ? "Sending..."
                      : resendCountdown > 0
                        ? `Resend OTP in ${resendCountdown}s`
                        : "Resend OTP"}
                  </button>
                </p>
              )}
            </div>
          ) : null}

          <div className={formLocked ? "relative z-[2]" : ""}>
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
          </div>

          <FormStatusAlert
            status={status}
            onDismiss={() => setStatus(null)}
          />
        </form>
      </div>
    </section>
  );
};

export default Section1;

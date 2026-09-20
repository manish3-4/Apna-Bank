import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Logo } from "./Logo";
import { Notif } from "./Notif";

const OTP_EXPIRY_MS = 5 * 60 * 1000;

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const StepIndicator = ({ current }) => (
  <div className="step-indicator">
    {[1, 2, 3].map((n) => (
      <div key={n} className={`step-dot ${current >= n ? "active" : ""}`}>
        {n}
      </div>
    ))}
  </div>
);

export const ForgotPasswordPage = ({ onSwitch }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notif, setNotif] = useState({ message: "", style: "" });
  const [loading, setLoading] = useState(false);
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const sendOTP = async (e) => {
    e.preventDefault();
    setNotif({ message: "", style: "" });

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email);

    if (!user) {
      setNotif({
        message: "No account found with this email.",
        style: "danger",
      });
      return;
    }

    const code = generateOTP();
    localStorage.setItem(
      "otpVerification",
      JSON.stringify({
        email,
        otp: code,
        expiresAt: Date.now() + OTP_EXPIRY_MS,
      }),
    );

    const service_id = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const template_id = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.REACT_APP_EMAILJS_USER_ID;

    setLoading(true);
    try {
      const templateParams = {
        otp_code: code,
        to_email: email,
      };

      await emailjs.send(
        service_id,
        template_id,
        templateParams,
        publicKey,
      );

      setNotif({ message: "OTP sent to your email.", style: "success" });
      setStep(2);
    } catch (error) {
      console.log("Error :"+error);
      setNotif({ message: "Failed to send OTP. Try again.", style: "danger" });
    }
    setLoading(false);
  };

  const verifyOTP = (e) => {
    e.preventDefault();
    setNotif({ message: "", style: "" });

    const stored = JSON.parse(localStorage.getItem("otpVerification"));
    if (!stored || Date.now() > stored.expiresAt) {
      setNotif({
        message: "OTP expired. Please request a new one.",
        style: "danger",
      });
      setStep(1);
      return;
    }

    const enteredOTP = otp.join("");
    if (enteredOTP !== stored.otp) {
      setNotif({ message: "Invalid OTP. Try again.", style: "danger" });
      return;
    }

    setStep(3);
  };

  const resetPassword = (e) => {
    e.preventDefault();
    setNotif({ message: "", style: "" });

    if (newPassword.length < 6) {
      setNotif({
        message: "Password must be at least 6 characters.",
        style: "danger",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setNotif({ message: "Passwords do not match.", style: "danger" });
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.email === email ? { ...u, password: newPassword } : u,
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.removeItem("otpVerification");

    setNotif({
      message: "Password reset successful! Redirecting...",
      style: "success",
    });
    setTimeout(onSwitch, 1500);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs[index + 1].current.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const resendOTP = async () => {
    setNotif({ message: "", style: "" });
    const code = generateOTP();
    localStorage.setItem(
      "otpVerification",
      JSON.stringify({
        email,
        otp: code,
        expiresAt: Date.now() + OTP_EXPIRY_MS,
      }),
    );

    setLoading(true);
    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        { otp_code: code, to_email: email },
        { publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY },
      );
      setNotif({ message: "New OTP sent to your email.", style: "success" });
    } catch {
      setNotif({ message: "Failed to send OTP. Try again.", style: "danger" });
    }
    setLoading(false);
  };

  return (
    <div id="login-page">
      <div className="auth-icon">
        <i className="bx bx-bank"></i>
      </div>
      <div id="login">
        <Logo />
        <h2 className="auth-title">Reset Password</h2>
        <StepIndicator current={step} />
        <Notif message={notif.message} style={notif.style} />

        {step === 1 && (
          <form onSubmit={sendOTP}>
            <label htmlFor="fp-email">Email Address</label>
            <input
              id="fp-email"
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={verifyOTP}>
            <label>Enter 6-digit OTP</label>
            <div className="otp-inputs">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={otpRefs[i]}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  autoComplete="off"
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                />
              ))}
            </div>
            <button type="submit" className="btn">
              Verify OTP
            </button>
            <p className="auth-switch">
              Didn't receive it? <span onClick={resendOTP}>Resend OTP</span>
            </p>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={resetPassword}>
            <label htmlFor="fp-new-pw">New Password</label>
            <input
              id="fp-new-pw"
              type="password"
              autoComplete="off"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <label htmlFor="fp-confirm-pw">Confirm Password</label>
            <input
              id="fp-confirm-pw"
              type="password"
              autoComplete="off"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn">
              Reset Password
            </button>
          </form>
        )}

        <p className="auth-switch">
          <span onClick={onSwitch}>Back to Login</span>
        </p>
      </div>
    </div>
  );
};

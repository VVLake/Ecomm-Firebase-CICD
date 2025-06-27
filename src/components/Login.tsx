import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";

const buttonStyle = {
  marginTop: '0.5rem',
  padding: '0.5rem 1rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  width: '100%',
  fontSize: '1rem',
};

const secondaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#6c757d',
};

const Login = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleProviderLogin = async (provider: any) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleEmailSignup = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update displayName after signup
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName,
        });
      }
      setMessage("Sign up successful! You are now logged in.");
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Check your inbox.");
      setShowForgot(false);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 400, margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>
        {isSignUp ? "Sign Up" : showForgot ? "Reset Password" : "Sign In"}
      </h2>

      {!showForgot && (
        <>
          <button
            onClick={() => handleProviderLogin(new GoogleAuthProvider())}
            style={buttonStyle}
            disabled={loading}
          >
            Sign in with Google
          </button>
          <button
            onClick={() => handleProviderLogin(new GithubAuthProvider())}
            style={buttonStyle}
            disabled={loading}
          >
            Sign in with GitHub
          </button>
          <hr style={{ margin: "2rem 0" }} />
        </>
      )}

      {/* Email/Password Forms */}
      {showForgot ? (
        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ display: "block", marginBottom: "1rem", width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
            disabled={loading}
          />
          <button type="submit" disabled={loading} style={buttonStyle}>
            Send Reset Email
          </button>
          <button
            type="button"
            onClick={() => { setShowForgot(false); setMessage(null); setError(null); }}
            style={secondaryButtonStyle}
            disabled={loading}
          >
            Back to Sign In
          </button>
        </form>
      ) : isSignUp ? (
        <form onSubmit={handleEmailSignup}>
          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            required
            style={{ display: "block", marginBottom: "1rem", width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
            disabled={loading}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ display: "block", marginBottom: "1rem", width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ display: "block", marginBottom: "1rem", width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
            disabled={loading}
          />
          <button type="submit" disabled={loading} style={buttonStyle}>
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setMessage(null); setError(null); }}
            style={secondaryButtonStyle}
            disabled={loading}
          >
            Back to Sign In
          </button>
        </form>
      ) : (
        <form onSubmit={handleEmailLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ display: "block", marginBottom: "1rem", width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ display: "block", marginBottom: "1rem", width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
            disabled={loading}
          />
          <button type="submit" disabled={loading} style={buttonStyle}>
            Sign In with Email
          </button>
        </form>
      )}

      {/* Switch Links */}
      {!showForgot && (
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          {!isSignUp ? (
            <>
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setMessage(null); setError(null); }}
                style={{ background: "none", color: "#007bff", border: "none", textDecoration: "underline", cursor: "pointer" }}
                disabled={loading}
              >
                Don't have an account? Sign Up
              </button>
              <br />
              <button
                type="button"
                onClick={() => { setShowForgot(true); setMessage(null); setError(null); }}
                style={{ background: "none", color: "#007bff", border: "none", textDecoration: "underline", cursor: "pointer" }}
                disabled={loading}
              >
                Forgot Password?
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setMessage(null); setError(null); }}
              style={{ background: "none", color: "#007bff", border: "none", textDecoration: "underline", cursor: "pointer" }}
              disabled={loading}
            >
              Already have an account? Sign In
            </button>
          )}
        </div>
      )}

      {/* Error and Success Messages */}
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      {message && <p style={{ color: "green", marginTop: "1rem" }}>{message}</p>}
    </div>
  );
};

export default Login;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Trees,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";

import styles from "./Login.module.css";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const { error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (error) {
        throw error;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.backgroundShapeOne} />
      <div className={styles.backgroundShapeTwo} />

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Trees size={30} strokeWidth={2} />
          </div>

          <div>
            <h1>Woodland Escape</h1>
            <span>Admin Portal</span>
          </div>
        </div>

        {/* Heading */}
        <div className={styles.heading}>
          <h2>Welcome back</h2>

          <p>
            Sign in to manage your resort
            reservations and operations.
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className={styles.form}
        >
          {/* Email */}
          <div className={styles.field}>
            <label htmlFor="email">
              Email Address
            </label>

            <div className={styles.inputWrapper}>
              <Mail
                size={19}
                className={styles.inputIcon}
              />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your email"
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label htmlFor="password">
              Password
            </label>

            <div className={styles.inputWrapper}>
              <LockKeyhole
                size={19}
                className={styles.inputIcon}
              />

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
              />

              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() =>
                  setShowPassword(
                    (current) => !current
                  )
                }
                disabled={loading}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className={styles.error}
              role="alert"
            >
              <span className={styles.errorIcon}>
                !
              </span>

              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className={styles.spinner}
                />

                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className={styles.footer}>
          <span>
            Woodland Escape Administration
          </span>
        </div>
      </div>
    </main>
  );
}
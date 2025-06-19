'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import styles from '../auth.module.scss';
import Loader from '@/components/Loader';

const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  hasUpperCase: /[A-Z]/,
  hasLowerCase: /[a-z]/,
  hasNumber: /[0-9]/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
};

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  useEffect(() => {
    // Add class to body for auth page styling
    document.body.classList.add('auth-page');
    return () => {
      document.body.classList.remove('auth-page');
    };
  }, []);

  const validatePassword = (pass: string) => {
    const errors = [];
    if (pass.length < PASSWORD_REQUIREMENTS.minLength) {
      errors.push(`At least ${PASSWORD_REQUIREMENTS.minLength} characters`);
    }
    if (!PASSWORD_REQUIREMENTS.hasUpperCase.test(pass)) {
      errors.push('One uppercase letter');
    }
    if (!PASSWORD_REQUIREMENTS.hasLowerCase.test(pass)) {
      errors.push('One lowercase letter');
    }
    if (!PASSWORD_REQUIREMENTS.hasNumber.test(pass)) {
      errors.push('One number');
    }
    if (!PASSWORD_REQUIREMENTS.hasSpecialChar.test(pass)) {
      errors.push('One special character');
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError(`Password must contain: ${passwordErrors.join(', ')}`);
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp(email, password);
      
      if (error) {
        setError(error.message);
      } else {
        setError('Please check your email to confirm your account.');
      }
    } catch (err) {
      setError('Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordRequirements = () => {
    setShowPasswordRequirements(!showPasswordRequirements);
  };

  return (
    <div className={styles.container}>
      {isLoading && <div className={styles.loaderOverlay}><Loader page="auth" /></div>}
      <div className={styles.form} style={isLoading ? { pointerEvents: 'none', opacity: 0.5 } : {}}>
        <div className={styles.header}>
          <h1>Create Your Account</h1>
          <p>Start your journaling journey today</p>
        </div>

        {error && (
          <div className={`${styles.message} ${styles.error}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.passwordLabelContainer}>
            <label htmlFor="password">Password</label>
              <button
                type="button"
                className={styles.infoButton}
                onClick={togglePasswordRequirements}
                aria-label="Show password requirements"
              >
                <Info size={16} />
              </button>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              disabled={isLoading}
            />
            {showPasswordRequirements && (
            <div className={styles.passwordRequirements}>
              <p>Password must contain:</p>
              <ul>
                <li className={password.length >= PASSWORD_REQUIREMENTS.minLength ? styles.valid : ''}>
                  At least {PASSWORD_REQUIREMENTS.minLength} characters
                </li>
                <li className={PASSWORD_REQUIREMENTS.hasUpperCase.test(password) ? styles.valid : ''}>
                  One uppercase letter
                </li>
                <li className={PASSWORD_REQUIREMENTS.hasLowerCase.test(password) ? styles.valid : ''}>
                  One lowercase letter
                </li>
                <li className={PASSWORD_REQUIREMENTS.hasNumber.test(password) ? styles.valid : ''}>
                  One number
                </li>
                <li className={PASSWORD_REQUIREMENTS.hasSpecialChar.test(password) ? styles.valid : ''}>
                  One special character
                </li>
              </ul>
            </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className={styles.switchForm}>
          Already have an account?{' '}
          <Link href="/auth/login">Sign in here</Link>
        </p>
      </div>
    </div>
  );
} 
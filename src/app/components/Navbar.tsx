'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => pathname === path;

  const handleSignOut = async () => {
    await signOut('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Journal App
        </Link>

        <div className={`${styles.navLinks} ${isMenuOpen ? styles.menuOpen : ''}`}>
          {user ? (
            <>
              <Link
                href="/journal"
                className={`${styles.navLink} ${isActive('/journal') ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                My Journal
              </Link>
              <Link
                href="/profile"
                className={`${styles.navLink} ${isActive('/profile') ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/settings"
                className={`${styles.navLink} ${isActive('/settings') ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Settings
              </Link>
              <Link
                href="/help"
                className={`${styles.navLink} ${isActive('/help') ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Help
              </Link>
              <ThemeToggle />
              <div className={styles.userSection}>
                <span className={styles.userName}>{user.email}</span>
                <button onClick={handleSignOut} className={styles.logoutButton}>
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={`${styles.navLink} ${isActive('/auth/login') ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className={`${styles.navLink} ${isActive('/auth/register') ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
              <ThemeToggle />
            </>
          )}
        </div>

        <button
          className={styles.menuButton}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className={styles.menuIcon}></span>
        </button>
      </div>
    </nav>
  );
} 
'use client';

import Link from 'next/link';
import styles from './not-found.module.scss';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Sorry, we couldn't find the page you're looking for.</p>
        <div className={styles.actions}>
          <Link href="/" className={styles.button}>
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className={`${styles.button} ${styles.secondary}`}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
} 
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Heart, 
  Shield, 
  Zap, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Play,
  Users,
  Award,
  Globe,
  Sparkles,
  Smartphone,
  Palette,
  BarChart3,
  Moon
} from 'lucide-react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './page.module.scss';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6
    }
  }
};

const heroVariants = {
  hidden: { 
    opacity: 0,
    y: 100
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8
    }
  }
};

const statsVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.5
    }
  }
};

const statVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5
    }
  }
};

const featureVariants = {
  hidden: { 
    opacity: 0,
    y: 60,
    rotateX: -15
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.7
    }
  }
};

const stepVariants = {
  hidden: { 
    opacity: 0,
    x: -50
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6
    }
  }
};

const testimonialVariants = {
  hidden: { 
    opacity: 0,
    y: 40,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6
    }
  }
};

const pricingVariants = {
  hidden: { 
    opacity: 0,
    y: 60,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7
    }
  }
};

// Custom hook for scroll animations
function useScrollAnimation() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return { ref, isInView };
}

export default function HomePage() {
  const heroRef = useScrollAnimation();
  const featuresRef = useScrollAnimation();
  const howItWorksRef = useScrollAnimation();
  const testimonialsRef = useScrollAnimation();
  const pricingRef = useScrollAnimation();
  const ctaRef = useScrollAnimation();

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section ref={heroRef.ref} className={styles.hero}>
        <motion.div 
          className={styles.heroContent}
          initial="hidden"
          animate={heroRef.isInView ? "visible" : "hidden"}
          variants={heroVariants}
        >
          <motion.h1 variants={itemVariants}>Transform Your Daily Reflection</motion.h1>
          <motion.p className={styles.heroSubtitle} variants={itemVariants}>
            A private, secure journaling platform designed for professionals who value personal growth and mindful reflection.
          </motion.p>
          <motion.div 
            className={styles.heroStats}
            variants={statsVariants}
          >
            <motion.div className={styles.stat} variants={statVariants}>
              <span className={styles.statNumber}>10K+</span>
              <span className={styles.statLabel}>Active Users</span>
            </motion.div>
            <motion.div className={styles.stat} variants={statVariants}>
              <span className={styles.statNumber}>500K+</span>
              <span className={styles.statLabel}>Entries Written</span>
            </motion.div>
            <motion.div className={styles.stat} variants={statVariants}>
              <span className={styles.statNumber}>99.9%</span>
              <span className={styles.statLabel}>Uptime</span>
            </motion.div>
          </motion.div>
          <motion.div className={styles.cta} variants={itemVariants}>
          <Link href="/auth/register" className={styles.primaryButton}>
              Start Your Journey
              <ArrowRight size={18} />
          </Link>
          <Link href="/auth/login" className={styles.secondaryButton}>
            Sign In
          </Link>
          </motion.div>
        </motion.div>
        <motion.div 
          className={styles.heroVisual}
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={heroRef.isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 100, scale: 0.8 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <div className={styles.mockup}>
            <div className={styles.mockupHeader}>
              <div className={styles.mockupDot}></div>
              <div className={styles.mockupDot}></div>
              <div className={styles.mockupDot}></div>
            </div>
            <div className={styles.mockupContent}>
              <div className={styles.mockupLine}></div>
              <div className={styles.mockupLine}></div>
              <div className={styles.mockupLine}></div>
        </div>
      </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <motion.div 
          className={styles.sectionHeader}
          ref={featuresRef.ref}
          initial="hidden"
          animate={featuresRef.isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants}>Why Choose Serenity Journal?</motion.h2>
          <motion.p variants={itemVariants}>Built with privacy, security, and user experience in mind</motion.p>
        </motion.div>
        <motion.div 
          className={styles.featuresGrid}
          variants={containerVariants}
          initial="hidden"
          animate={featuresRef.isInView ? "visible" : "hidden"}
        >
          <motion.div className={styles.feature} variants={featureVariants}>
            <div className={styles.featureIcon}>
              <Shield size={32} />
            </div>
            <h3>End-to-End Encryption</h3>
            <p>Your thoughts are protected with military-grade encryption. Only you can access your private entries.</p>
          </motion.div>
          <motion.div className={styles.feature} variants={featureVariants}>
            <div className={styles.featureIcon}>
              <Smartphone size={32} />
            </div>
            <h3>Cross-Platform Sync</h3>
            <p>Write from anywhere - your entries sync seamlessly across all your devices in real-time.</p>
          </motion.div>
          <motion.div className={styles.feature} variants={featureVariants}>
            <div className={styles.featureIcon}>
              <Palette size={32} />
            </div>
            <h3>Rich Media Support</h3>
            <p>Enhance your entries with images, formatting, and multimedia to capture your experiences vividly.</p>
          </motion.div>
          <motion.div className={styles.feature} variants={featureVariants}>
            <div className={styles.featureIcon}>
              <BarChart3 size={32} />
            </div>
            <h3>Insightful Analytics</h3>
            <p>Track your writing patterns, mood trends, and personal growth with beautiful visualizations.</p>
          </motion.div>
          <motion.div className={styles.feature} variants={featureVariants}>
            <div className={styles.featureIcon}>
              <Zap size={32} />
            </div>
            <h3>Lightning Fast</h3>
            <p>Built with modern technology for instant saving and smooth performance across all devices.</p>
          </motion.div>
          <motion.div className={styles.feature} variants={featureVariants}>
            <div className={styles.featureIcon}>
              <Moon size={32} />
        </div>
            <h3>Dark Mode</h3>
            <p>Write comfortably in any lighting condition with our beautiful dark and light themes.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <motion.div 
          className={styles.sectionHeader}
          ref={howItWorksRef.ref}
          initial="hidden"
          animate={howItWorksRef.isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants}>How It Works</motion.h2>
          <motion.p variants={itemVariants}>Get started in minutes, not hours</motion.p>
        </motion.div>
        <motion.div 
          className={styles.steps}
          variants={containerVariants}
          initial="hidden"
          animate={howItWorksRef.isInView ? "visible" : "hidden"}
        >
          <motion.div className={styles.step} variants={stepVariants}>
            <div className={styles.stepNumber}>1</div>
            <h3>Create Your Account</h3>
            <p>Sign up securely with your email. No personal information required beyond what's necessary.</p>
          </motion.div>
          <motion.div className={styles.step} variants={stepVariants}>
            <div className={styles.stepNumber}>2</div>
            <h3>Start Writing</h3>
            <p>Begin your first entry with our intuitive editor. Add images, format text, and express yourself freely.</p>
          </motion.div>
          <motion.div className={styles.step} variants={stepVariants}>
            <div className={styles.stepNumber}>3</div>
            <h3>Track Your Growth</h3>
            <p>Review your journey, discover patterns, and celebrate your personal development over time.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <motion.div 
          className={styles.sectionHeader}
          ref={testimonialsRef.ref}
          initial="hidden"
          animate={testimonialsRef.isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants}>What Our Users Say</motion.h2>
          <motion.p variants={itemVariants}>Join thousands of satisfied users who've transformed their daily routine</motion.p>
        </motion.div>
        <motion.div 
          className={styles.testimonialsGrid}
          variants={containerVariants}
          initial="hidden"
          animate={testimonialsRef.isInView ? "visible" : "hidden"}
        >
          <motion.div className={styles.testimonial} variants={testimonialVariants}>
            <div className={styles.testimonialContent}>
              <p>"Serenity Journal has become my daily sanctuary. The privacy features give me peace of mind, and the interface is so intuitive that I actually look forward to writing every day."</p>
            </div>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorAvatar}>S</div>
              <div className={styles.authorInfo}>
                <h4>Sarah Chen</h4>
                <span>Product Manager</span>
              </div>
            </div>
          </motion.div>
          <motion.div className={styles.testimonial} variants={testimonialVariants}>
            <div className={styles.testimonialContent}>
              <p>"As someone who travels frequently, the cross-platform sync is a game-changer. I can write from my phone during commutes and continue on my laptop at home seamlessly."</p>
            </div>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorAvatar}>M</div>
              <div className={styles.authorInfo}>
                <h4>Michael Rodriguez</h4>
                <span>Consultant</span>
              </div>
            </div>
          </motion.div>
          <motion.div className={styles.testimonial} variants={testimonialVariants}>
            <div className={styles.testimonialContent}>
              <p>"The analytics feature helped me discover patterns in my mood and productivity I never noticed before. It's like having a personal growth dashboard."</p>
            </div>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorAvatar}>E</div>
              <div className={styles.authorInfo}>
                <h4>Emma Thompson</h4>
                <span>Software Engineer</span>
              </div>
        </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section className={styles.pricing}>
        <motion.div 
          className={styles.sectionHeader}
          ref={pricingRef.ref}
          initial="hidden"
          animate={pricingRef.isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants}>Simple, Transparent Pricing</motion.h2>
          <motion.p variants={itemVariants}>Start free, upgrade when you need more</motion.p>
        </motion.div>
        <motion.div 
          className={styles.pricingGrid}
          variants={containerVariants}
          initial="hidden"
          animate={pricingRef.isInView ? "visible" : "hidden"}
        >
          <motion.div className={styles.pricingCard} variants={pricingVariants}>
            <div className={styles.pricingHeader}>
              <h3>Free</h3>
              <div className={styles.price}>
                <span className={styles.priceAmount}>$0</span>
                <span className={styles.pricePeriod}>/month</span>
        </div>
      </div>
            <ul className={styles.pricingFeatures}>
              <li><CheckCircle size={16} /> Up to 100 entries</li>
              <li><CheckCircle size={16} /> Basic formatting</li>
              <li><CheckCircle size={16} /> Image uploads (5 per entry)</li>
              <li><CheckCircle size={16} /> Cross-platform sync</li>
              <li><CheckCircle size={16} /> Dark mode</li>
            </ul>
            <Link href="/auth/register" className={styles.pricingButton}>
              Get Started Free
            </Link>
          </motion.div>
          <motion.div 
            className={`${styles.pricingCard} ${styles.pricingCardFeatured}`} 
            variants={pricingVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
          >
            <div className={styles.featuredBadge}>Most Popular</div>
            <div className={styles.pricingHeader}>
              <h3>Pro</h3>
              <div className={styles.price}>
                <span className={styles.priceAmount}>$9</span>
                <span className={styles.pricePeriod}>/month</span>
              </div>
      </div>
            <ul className={styles.pricingFeatures}>
              <li><CheckCircle size={16} /> Unlimited entries</li>
              <li><CheckCircle size={16} /> Advanced formatting</li>
              <li><CheckCircle size={16} /> Unlimited images</li>
              <li><CheckCircle size={16} /> Analytics & insights</li>
              <li><CheckCircle size={16} /> Export to PDF</li>
              <li><CheckCircle size={16} /> Priority support</li>
            </ul>
            <Link href="/auth/register" className={styles.pricingButton}>
              Start Pro Trial
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className={styles.finalCta}>
        <motion.div 
          className={styles.ctaContent}
          ref={ctaRef.ref}
          initial="hidden"
          animate={ctaRef.isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants}>Ready to Transform Your Daily Reflection?</motion.h2>
          <motion.p variants={itemVariants}>Join thousands of professionals who've made journaling a cornerstone of their personal growth journey.</motion.p>
          <motion.div className={styles.cta} variants={itemVariants}>
            <Link href="/auth/register" className={styles.primaryButton}>
              Start Your Free Trial
              <ArrowRight size={18} />
            </Link>
            <Link href="/help" className={styles.secondaryButton}>
              Learn More
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

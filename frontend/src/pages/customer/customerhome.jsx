/**
 * CustomerHome.jsx
 * ================
 * Main landing page for MediEcom - AI-Powered Medical & Healthcare eCommerce Platform
 * Features: Hero, Metrics, Doctor Suggestions, Features, AI Tools, Contact, FAQ, Footer
 * 
 * @author MediEcom Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShieldCheck,
  HeadphonesIcon,
  Brain,
  Sparkles,
  Cpu,
  Award,
  Zap,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  Star,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Menu,
  X,
  Heart,

  Package,
  TrendingUp,
  Timer,
  CheckCircle,
  Lock,
  Users,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import '../../styles/customerhome.css';

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

/** Fade in animation variant */
const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

/** Slide up animation variant */
const slideUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

/** Slide in from left animation variant */
const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

/** Slide in from right animation variant */
const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

/** Stagger children animation container */
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

/** Individual stagger child animation */
const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

/** Hover scale animation for interactive elements */
const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.3, ease: 'easeOut' }
};

/** Accordion expand/collapse animation */
const accordionVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeInOut' }
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeInOut' }
  }
};

// ============================================================================
// HEADER COMPONENT
// ============================================================================

/**
 * Navigation Header Component
 * Sticky navigation with responsive mobile menu
 */
const Header = ({ navigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = []; // navigation links removed per request

  return (
    <motion.header
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="header__container">
        {/* Logo */}
        <Link to="/" className="header__logo" aria-label="MediEcom Home">
          <div className="header__logo-icon">
            <Heart className="header__heart-icon" />
          </div>
          <span className="header__logo-text">MediEcom</span>
        </Link>



        {/* Desktop CTA Buttons */}
        <div className="header__actions">

          <motion.button
            className="header__btn header__btn--primary"
            onClick={() => navigate('/buyer/login')}
            whileHover={hoverScale}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles size={16} className="btn-icon-left" aria-hidden="true" />
            <span className="btn-label">Get Started</span>
            <ArrowRight size={16} className="btn-icon-right" aria-hidden="true" />
          </motion.button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="header__mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="header__mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav aria-label="Mobile navigation">

              <div className="header__mobile-actions">

                <button
                  className="header__btn header__btn--primary header__btn--full"
                  onClick={() => navigate('/buyer/login')}
                >
                  <Sparkles size={16} className="btn-icon-left" aria-hidden="true" />
                  <span className="btn-label">Get Started</span>
                  <ArrowRight size={16} className="btn-icon-right" aria-hidden="true" />
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// ============================================================================
// HERO SECTION COMPONENT
// ============================================================================

/**
 * Hero Section Component
 * Main landing area with AI search bar and CTAs
 */
const HeroSection = ({ navigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('AI Search:', searchQuery);
    // Implement search functionality
  };

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__container">
        {/* Left Content */}
        <motion.div
          className="hero__content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.span className="hero__badge" variants={fadeIn}>
            <Sparkles size={16} />
            AI-Powered Healthcare Platform
          </motion.span>

          <motion.h1
            id="hero-title"
            className="hero__title"
            variants={slideUp}
          >
            AI-Powered Medical & Healthcare Store
          </motion.h1>

          <motion.p className="hero__subtitle" variants={slideUp}>
            Search products using natural language. Get recommendations, alternatives,
            and safe medication suggestions — powered by AI.
          </motion.p>

          {/* AI Search Bar */}
          <motion.form
            className="hero__search"
            onSubmit={handleSearch}
            variants={slideUp}
            role="search"
          >
            <div className="hero__search-wrapper">
              <Search className="hero__search-icon" aria-hidden="true" />
              <input
                type="search"
                className="hero__search-input"
                placeholder="Search using AI... (e.g., best pain relief medicine)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="AI-powered product search"
              />
              <motion.button
                type="submit"
                className="hero__search-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Search size={20} />
                Search
              </motion.button>
            </div>
          </motion.form>


        </motion.div>

        {/* Right Illustration */}
        <motion.div
          className="hero__illustration"
          initial="hidden"
          animate="visible"
          variants={slideInRight}
        >
          <div className="hero__illustration-wrapper">
            {/* Hands holding heart illustration */}
            <svg
              viewBox="0 0 400 400"
              className="hero__illustration-svg"
              aria-label="Illustration of hands holding a medical heart symbol"
              role="img"
            >
              {/* Background circles */}
              <circle cx="200" cy="200" r="180" fill="#E8F4FD" opacity="0.5" />
              <circle cx="200" cy="200" r="140" fill="#D1E9F9" opacity="0.5" />

              {/* Left hand */}
              <path
                d="M80 280 Q60 240 80 200 Q100 160 140 180 L160 220 Q140 260 120 280 Z"
                fill="#FDBCB4"
                stroke="#E8A598"
                strokeWidth="2"
              />
              <path
                d="M140 180 Q160 160 180 170 L175 190 Q155 195 140 180"
                fill="#FDBCB4"
                stroke="#E8A598"
                strokeWidth="1"
              />

              {/* Right hand */}
              <path
                d="M320 280 Q340 240 320 200 Q300 160 260 180 L240 220 Q260 260 280 280 Z"
                fill="#FDBCB4"
                stroke="#E8A598"
                strokeWidth="2"
              />
              <path
                d="M260 180 Q240 160 220 170 L225 190 Q245 195 260 180"
                fill="#FDBCB4"
                stroke="#E8A598"
                strokeWidth="1"
              />

              {/* Heart */}
              <path
                d="M200 310 
                   C200 310 120 240 120 180 
                   C120 140 150 120 180 120 
                   C200 120 200 140 200 140 
                   C200 140 200 120 220 120 
                   C250 120 280 140 280 180 
                   C280 240 200 310 200 310 Z"
                fill="#E74C3C"
                stroke="#C0392B"
                strokeWidth="3"
              />

              {/* Medical cross */}
              <rect x="185" y="170" width="30" height="80" rx="4" fill="white" />
              <rect x="160" y="195" width="80" height="30" rx="4" fill="white" />

              {/* Decorative sparkles */}
              <circle cx="100" cy="120" r="8" fill="#0EA5E9" opacity="0.6" />
              <circle cx="300" cy="100" r="6" fill="#14B8A6" opacity="0.6" />
              <circle cx="340" cy="160" r="4" fill="#0EA5E9" opacity="0.6" />
              <circle cx="60" cy="180" r="5" fill="#14B8A6" opacity="0.6" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// METRICS SECTION COMPONENT
// ============================================================================

/**
 * Performance Metrics Section
 * Displays key platform statistics
 */
const MetricsSection = () => {
  const metrics = [
    {
      icon: Package,
      value: '1M+',
      label: 'Products',
      description: 'Products indexed & AI-categorized'
    },
    {
      icon: TrendingUp,
      value: '98%',
      label: 'Trust',
      description: 'Verified medicine compliance'
    },
    {
      icon: Timer,
      value: '<120ms',
      label: 'Latency',
      description: 'Average AI recommendation latency'
    }
  ];

  return (
    <section className="metrics" aria-labelledby="metrics-title">
      <div className="metrics__container">
        <motion.h2
          id="metrics-title"
          className="sr-only"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          Platform Performance Metrics
        </motion.h2>

        <motion.div
          className="metrics__grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              className="metrics__card"
              variants={staggerItem}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div className="metrics__icon-wrapper">
                <metric.icon className="metrics__icon" aria-hidden="true" />
              </div>
              <div className="metrics__content">
                <span className="metrics__value">{metric.value}</span>
                <span className="metrics__label">{metric.label}</span>
                <p className="metrics__description">{metric.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// DOCTOR SUGGESTIONS SECTION COMPONENT
// ============================================================================

/**
 * Doctor Suggestions Section
 * Testimonials from medical professionals
 */
const DoctorSuggestionsSection = () => {
  const doctors = [
    {
      quote: "MediEcom's AI recommendations have significantly improved how we suggest medications to our patients. The accuracy is remarkable.",
      name: "Dr. Ahmed Khan",
      designation: "Consultant, Pulmonology",
      hospital: "CityCare Medical Centre",
      rating: 5
    },
    {
      quote: "As a GP, I appreciate how the platform verifies all products. It gives me confidence when recommending healthcare items to patients.",
      name: "Dr. Fatima Ali",
      designation: "General Practitioner",
      hospital: "Green Valley Clinic",
      rating: 5
    },
    {
      quote: "The drug interaction warnings and alternative suggestions are invaluable. This platform truly understands healthcare needs.",
      name: "Dr. Hassan Malik",
      designation: "Clinical Pharmacologist",
      hospital: "HealthWorks Labs",
      rating: 5
    }
  ];

  return (
    <section className="doctors" aria-labelledby="doctors-title">
      <div className="doctors__container">
        <motion.div
          className="doctors__header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 id="doctors-title" className="doctors__title">
            Doctor Suggestions
          </h2>
          <p className="doctors__subtitle">
            Trusted by healthcare professionals across the country
          </p>
        </motion.div>

        <motion.div
          className="doctors__grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {doctors.map((doctor, index) => (
            <motion.article
              key={index}
              className="doctors__card"
              variants={staggerItem}
              whileHover={{
                scale: 1.03,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                transition: { duration: 0.3 }
              }}
            >
              <div className="doctors__card-content">
                <div className="doctors__rating" aria-label={`${doctor.rating} out of 5 stars`}>
                  {[...Array(doctor.rating)].map((_, i) => (
                    <Star key={i} className="doctors__star" fill="#F59E0B" />
                  ))}
                </div>
                <blockquote className="doctors__quote">
                  "{doctor.quote}"
                </blockquote>
                <div className="doctors__info">
                  <div className="doctors__avatar">
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="doctors__details">
                    <strong className="doctors__name">{doctor.name}</strong>
                    <span className="doctors__designation">{doctor.designation}</span>
                    <span className="doctors__hospital">{doctor.hospital}</span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// FEATURE HIGHLIGHTS SECTION COMPONENT
// ============================================================================

/**
 * Feature Highlights Section
 * Displays key platform features in a grid layout
 */
const FeatureHighlightsSection = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Search',
      description: 'Natural language queries to find exactly what you need instantly.'
    },
    {
      icon: ShieldCheck,
      title: 'Verified & Safe',
      description: 'All products verified for authenticity and safety compliance.'
    },
    {
      icon: HeadphonesIcon,
      title: 'Expert Support',
      description: '24/7 healthcare support from qualified professionals.'
    },
    {
      icon: Sparkles,
      title: 'Smart Insights',
      description: 'AI-driven analytics and personalized recommendations.'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Advanced filters and intelligent product matching.'
    },
    {
      icon: Cpu,
      title: 'AI Processing',
      description: 'Real-time processing for instant results and suggestions.'
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Strict quality standards for all listed products.'
    },
    {
      icon: Zap,
      title: 'Easy Access',
      description: 'Seamless experience across all devices and platforms.'
    }
  ];

  return (
    <section className="features" id="features" aria-labelledby="features-title">
      <div className="features__container">
        <motion.div
          className="features__header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 id="features-title" className="features__title">
            Why Choose Our AI Marketplace?
          </h2>
          <p className="features__subtitle">
            We combine cutting-edge AI technology with healthcare expertise to make
            finding quality medical products effortless.
          </p>
        </motion.div>

        <motion.div
          className="features__grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="features__card"
              variants={index % 2 === 0 ? slideInLeft : slideInRight}
              whileHover={{
                y: -5,
                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
                transition: { duration: 0.3 }
              }}
            >
              <div className="features__icon-wrapper">
                <feature.icon className="features__icon" aria-hidden="true" />
              </div>
              <div className="features__content">
                <h3 className="features__card-title">{feature.title}</h3>
                <p className="features__card-description">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// AI TOOLS SECTION COMPONENT
// ============================================================================

/**
 * AI Healthcare Management Tools Section
 * Showcases the platform's AI capabilities
 */
const AIToolsSection = () => {
  const tools = [
    {
      icon: Search,
      title: 'AI-Powered Search',
      subtitle: 'Natural Language Search',
      description: 'Search for products using everyday language. Our AI understands context, symptoms, and medical terminology.',
      color: 'blue'
    },
    {
      icon: Brain,
      title: 'Smart Categorization',
      subtitle: 'Intelligent Classification',
      description: 'Products are automatically categorized using AI for easier navigation and discovery.',
      color: 'teal'
    },
    {
      icon: Zap,
      title: 'Fast Recommendations',
      subtitle: 'Real-Time Suggestions',
      description: 'Get instant product recommendations and alternatives based on your search and preferences.',
      color: 'purple'
    },
    {
      icon: ShieldCheck,
      title: 'Compliance Ready',
      subtitle: 'Healthcare Standards',
      description: 'All products meet healthcare compliance standards. Safety warnings and interactions are highlighted.',
      color: 'green'
    }
  ];

  return (
    <section className="ai-tools" id="about" aria-labelledby="ai-tools-title">
      <div className="ai-tools__container">
        <motion.div
          className="ai-tools__header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 id="ai-tools-title" className="ai-tools__title">
            Everything You Need to Manage Healthcare
          </h2>
          <p className="ai-tools__subtitle">
            Our complete suite of AI-powered tools handles intelligent search, smart
            recommendations, automated discovery, and full compliance with healthcare standards.
          </p>
        </motion.div>

        <motion.div
          className="ai-tools__grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              className={`ai-tools__card ai-tools__card--${tool.color}`}
              variants={staggerItem}
              whileHover={{
                y: -10,
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                transition: { duration: 0.3 }
              }}
            >
              <div className={`ai-tools__icon-wrapper ai-tools__icon-wrapper--${tool.color}`}>
                <tool.icon className="ai-tools__icon" aria-hidden="true" />
              </div>
              <span className="ai-tools__card-subtitle">{tool.subtitle}</span>
              <h3 className="ai-tools__card-title">{tool.title}</h3>
              <p className="ai-tools__card-description">{tool.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// CONTACT INFO SECTION COMPONENT
// ============================================================================

/**
 * Contact Information Section
 * Displays contact methods
 */
const ContactInfoSection = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone',
      primary: '+92 (300) XXX-XXXX',
      secondary: 'Monday–Friday, 9AM–6PM PKT'
    },
    {
      icon: Mail,
      title: 'Email',
      primary: 'support@mediEcom.ai',
      secondary: 'Response within 24 hours'
    },
    {
      icon: HeadphonesIcon,
      title: 'Support',
      primary: '24/7 Priority Support',
      secondary: 'Always here to help'
    }
  ];

  return (
    <section className="contact-info" aria-labelledby="contact-info-title">
      <div className="contact-info__container">
        <motion.div
          className="contact-info__header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 id="contact-info-title" className="contact-info__title">
            Get in Touch
          </h2>
          <p className="contact-info__subtitle">
            We're here to help with any questions about our platform
          </p>
        </motion.div>

        <motion.div
          className="contact-info__grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              className="contact-info__card"
              variants={staggerItem}
              whileHover={{
                y: -5,
                transition: { duration: 0.3 }
              }}
            >
              <div className="contact-info__icon-wrapper">
                <method.icon className="contact-info__icon" aria-hidden="true" />
              </div>
              <h3 className="contact-info__card-title">{method.title}</h3>
              <p className="contact-info__primary">{method.primary}</p>
              <p className="contact-info__secondary">{method.secondary}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// CONTACT FORM SECTION COMPONENT
// ============================================================================

/**
 * Contact Form Section
 * Full contact form with highlights
 */
const ContactFormSection = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Implement form submission
  };

  const highlights = [
    { icon: Clock, text: 'Fast Response Times' },
    { icon: HeadphonesIcon, text: 'Expert Support Team' },
    { icon: Lock, text: 'Confidential & Secure' }
  ];

  return (
    <section className="contact-form" id="contact" aria-labelledby="contact-form-title">
      <div className="contact-form__container">
        {/* Left Side - Info */}
        <motion.div
          className="contact-form__info"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideInLeft}
        >
          <h2 id="contact-form-title" className="contact-form__title">
            Send us a Message
          </h2>
          <p className="contact-form__description">
            Have questions about our platform? Need help getting started?
            We'd love to hear from you. Fill out the form and our team will get back to you shortly.
          </p>

          <ul className="contact-form__highlights">
            {highlights.map((item, index) => (
              <li key={index} className="contact-form__highlight">
                <item.icon className="contact-form__highlight-icon" aria-hidden="true" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          className="contact-form__wrapper"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideInRight}
        >
          <form onSubmit={handleSubmit} className="contact-form__form">
            <div className="contact-form__row">
              <div className="contact-form__group">
                <label htmlFor="fullName" className="contact-form__label">
                  Full Name <span className="contact-form__required">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="contact-form__input"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="contact-form__group">
                <label htmlFor="email" className="contact-form__label">
                  Email Address <span className="contact-form__required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="contact-form__input"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="contact-form__row">
              <div className="contact-form__group">
                <label htmlFor="phone" className="contact-form__label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="contact-form__input"
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="contact-form__group">
                <label htmlFor="company" className="contact-form__label">
                  Company/Organization
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="contact-form__input"
                  placeholder="Enter your company name"
                />
              </div>
            </div>

            <div className="contact-form__group">
              <label htmlFor="subject" className="contact-form__label">
                Subject <span className="contact-form__required">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="contact-form__input"
                placeholder="What is this about?"
                required
              />
            </div>

            <div className="contact-form__group">
              <label htmlFor="message" className="contact-form__label">
                Message <span className="contact-form__required">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="contact-form__textarea"
                placeholder="Tell us more about your inquiry..."
                rows="5"
                required
              />
            </div>

            <motion.button
              type="submit"
              className="contact-form__submit"
              whileHover={hoverScale}
              whileTap={{ scale: 0.95 }}
            >
              Send Message
              <ArrowRight size={20} />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// FAQ SECTION COMPONENT
// ============================================================================

/**
 * FAQ Section Component
 * Expandable accordion for frequently asked questions
 */
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      icon: '❓',
      question: 'What is MediEcom and how does AI help?',
      answer: 'MediEcom is an AI-powered healthcare marketplace that connects buyers with verified medical products. Our AI helps by understanding natural language searches, providing smart product recommendations, suggesting alternatives, and ensuring you find safe, verified healthcare products quickly and efficiently.'
    },
    {
      icon: '🔒',
      question: 'Is my data safe with MediEcom?',
      answer: 'Absolutely. We take data security very seriously. All personal and medical information is encrypted using industry-standard protocols. We comply with healthcare data protection regulations and never share your information with third parties without explicit consent.'
    },
    {
      icon: '👥',
      question: 'Who can use MediEcom?',
      answer: 'MediEcom is designed for everyone - individual consumers looking for healthcare products, healthcare professionals seeking supplies, and clinics and hospitals seeking reliable medicines. Our platform serves the entire healthcare ecosystem.'
    },
    {
      icon: '💵',
      question: 'How are prices and delivery handled?',
      answer: 'Prices are competitive and clearly displayed on each product. We ensure price transparency with no hidden fees. Delivery options vary by location, with estimated delivery times shown before purchase. We offer multiple shipping options to suit your needs.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="faq__container">
        <motion.div
          className="faq__header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 id="faq-title" className="faq__title">
            Frequently Asked Questions
          </h2>
          <p className="faq__subtitle">
            Find answers to common questions about MediEcom
          </p>
        </motion.div>

        <motion.div
          className="faq__list"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className={`faq__item ${openIndex === index ? 'faq__item--open' : ''}`}
              variants={staggerItem}
            >
              <button
                className="faq__question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="faq__icon">{faq.icon}</span>
                <span className="faq__question-text">{faq.question}</span>
                <ChevronDown
                  className={`faq__chevron ${openIndex === index ? 'faq__chevron--rotated' : ''}`}
                  aria-hidden="true"
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    className="faq__answer"
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    variants={accordionVariants}
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// FOOTER SECTION COMPONENT
// ============================================================================

/**
 * Footer Section Component
 * Complete footer with links and social media
 */
const Footer = () => {
  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Browse Products', href: '#' },
      { name: 'Categories', href: '#' },
      { name: 'How it works', href: '#' }
    ],
    services: [
      { name: 'For Buyers', href: '#' },
      { name: 'For Clinics', href: '#' }
    ],
    support: [
      { name: 'Contact Us', href: '#contact' },
      { name: 'Help Center', href: '#faq' },
      { name: 'Policies', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' }
  ];

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        <div className="footer__main">
          {/* Company Info */}
          <div className="footer__company">
            <Link to="/" className="footer__logo">
              <div className="footer__logo-icon">
                <Heart className="footer__heart-icon" />
              </div>
              <span className="footer__logo-text">MediEcom</span>
            </Link>
            <p className="footer__description">
              MediEcom is an AI-powered healthcare marketplace providing buyers with
              safe, verified products. We use smart recommendations to make
              it easier to find the right healthcare items quickly and reliably.
            </p>

            {/* Contact Info */}
            <div className="footer__contact">
              <div className="footer__contact-item">
                <Phone size={16} aria-hidden="true" />
                <span>+92 (300) 555-0100</span>
              </div>
              <div className="footer__contact-item">
                <Mail size={16} aria-hidden="true" />
                <span>support@mediecom.ai</span>
              </div>
              <div className="footer__contact-item">
                <Clock size={16} aria-hidden="true" />
                <span>24/7 Support Available</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="footer__social">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="footer__social-link"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="footer__links">
            <div className="footer__links-column">
              <h3 className="footer__links-title">PRODUCT</h3>
              <ul className="footer__links-list">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="footer__link">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__links-column">
              <h3 className="footer__links-title">SERVICES</h3>
              <ul className="footer__links-list">
                {footerLinks.services.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="footer__link">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__links-column">
              <h3 className="footer__links-title">SUPPORT</h3>
              <ul className="footer__links-list">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="footer__link">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © 2025 MediEcom. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * CustomerHome - Main Landing Page Component
 * Assembles all sections for the complete customer home page
 */
const CustomerHome = () => {
  const navigate = useNavigate();

  return (
    <div className="customer-home">
      <Header navigate={navigate} />
      <main>
        <HeroSection navigate={navigate} />
        <MetricsSection />
        <DoctorSuggestionsSection />
        <FeatureHighlightsSection />
        <AIToolsSection />
        <ContactInfoSection />
        <ContactFormSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default CustomerHome;

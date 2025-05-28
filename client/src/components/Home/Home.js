import React from 'react'
import { useHistory } from 'react-router-dom'
import styles from './Home.module.css'

const Home = () => {
    const history = useHistory()
   
    return (
        <div className={styles.pageContainer}>
            <section className={styles.hero}>
                <div className={styles.heroWrapper}>
                    <div className={styles.heroContent}>
                        <h1>Professional Invoicing<br />Made Simple</h1>
                        <p className={styles.subtitle}>Create, manage, and track invoices effortlessly. Perfect for freelancers and small businesses.</p>
                        <button onClick={() => history.push('/login')} className={styles.ctaButton}>
                            Get Started - It's Free
                        </button>
                    </div>
                    <div className={styles.heroImage}>
                        <img 
                            src={process.env.PUBLIC_URL + "/icons/laptop.png"}
                            alt="Invoice Dashboard Preview" 
                            className={styles.heroImg}
                        />
                    </div>
                </div>
            </section>

            <section className={styles.features}>
                <h2>Why Choose EchoInvoice?</h2>
                <div className={styles.featureGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>📝</div>
                        <h3>Easy Invoice Creation</h3>
                        <p>Create professional invoices in minutes with our intuitive interface</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>💰</div>
                        <h3>Payment Tracking</h3>
                        <p>Track payments and manage your cash flow efficiently</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>📊</div>
                        <h3>Business Insights</h3>
                        <p>Get valuable insights about your business performance</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🔒</div>
                        <h3>Secure & Reliable</h3>
                        <p>Your data is protected with industry-standard security</p>
                    </div>
                </div>
            </section>

            <section className={styles.cta}>
                <div className={styles.ctaContent}>
                    <h2>Ready to streamline your invoicing?</h2>
                    <p>Join thousands of satisfied users who trust EchoInvoice</p>
                    <button onClick={() => history.push('/login')} className={styles.ctaButton}>
                        Start Free Today
                    </button>
                </div>
            </section>

            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <p>© 2024 EchoInvoice. Free and Open Source Invoicing Solution.</p>
                    <div className={styles.footerLinks}>
                        <a href="#features">Features</a>
                        <a href="#about">About</a>
                        <a href="#contact">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Home

import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/header';
import {
  ArrowRight,
  Wallet,
  LineChart,
  Shield,
  Github,
  Twitter,
  Mail,
} from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const features = [
    {
      title: 'Real-Time Tracking',
      description: 'Monitor your portfolio with live price updates and alerts.',
      icon: <Wallet className="h-10 w-10" />,
    },
    {
      title: 'Advanced Analytics',
      description: 'Get detailed insights into your portfolio performance.',
      icon: <LineChart className="h-10 w-10" />,
    },
    {
      title: 'Bank-Grade Security',
      description: 'Your data is encrypted and never shared with third parties.',
      icon: <Shield className="h-10 w-10" />,
    },
  ];

  const howItWorks = [
    { step: 1, title: 'Create Account', description: 'Sign up in seconds with just a username and password.' },
    { step: 2, title: 'Add Assets', description: 'Easily add your cryptocurrency holdings.' },
    { step: 3, title: 'Track Performance', description: 'Monitor your portfolio growth in real-time.' },
  ]

  const testimonials = [
    {
      content: 'CryptoFolio has completely changed how I manage my crypto investments. The interface is intuitive and the analytics are powerful.',
      author: 'Alex Johnson',
      role: 'Crypto Trader',
    },
    {
      content: 'As a beginner in crypto, this app has been a lifesaver. It helps me understand my portfolio distribution and track performance easily.',
      author: 'Sarah Rodriguez',
      role: 'New Investor',
    },
    {
      content: 'The real-time alerts and analytics have helped me make better decisions and grow my investments significantly.',
      author: 'Michael Chen',
      role: 'Long-term Investor',
    },
  ];

  const faqs = [
    {
      question: 'Is CryptoFolio free to use?',
      answer: 'Yes, CryptoFolio is completely free for basic portfolio tracking. We also offer premium features for advanced users and teams.',
    },
    {
      question: 'How secure is my data?',
      answer: 'We use industry-standard encryption and security practices. Your data is encrypted both in transit and at rest, and we never share your information with third parties.',
    },
    {
      question: 'Do I need to connect my wallet?',
      answer: "No, you don't need to connect any wallets. You can simply enter the cryptocurrencies you own and their amounts manually, and we'll track their value over time.",
    },
    {
      question: 'Which cryptocurrencies are supported?',
      answer: 'CryptoFolio supports over 5,000 cryptocurrencies and tokens, including all major assets like Bitcoin, Ethereum, and popular altcoins.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Track Your Crypto<br />Like a <span className="text-primary">Pro</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                All your cryptocurrencies in one place. Simple, secure, and insightful portfolio tracking.
              </p>
              <div className="flex space-x-4">
                <Button size="lg" className="font-medium flex items-center" asChild>
                  <Link href="/register">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="font-medium">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1622630998477-20aa696ecb05?ixlib=rb-4.0.3&auto=format&fit=crop&w=600"
                alt="CryptoFolio app on smartphone"
                className="rounded-xl shadow-2xl max-w-sm border-4 border-background"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50 dark:bg-muted/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose CryptoFolio?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-6 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-4">
            {howItWorks.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center w-full md:w-1/3">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4 text-primary-foreground font-bold text-xl">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/50 dark:bg-muted/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>

          <div className="max-w-3xl mx-auto">
            <Card className="border-0 shadow-md">
              <CardContent className="p-8">
                <p className="text-lg italic mb-6">"{testimonials[activeTestimonial].content}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{testimonials[activeTestimonial].author}</p>
                    <p className="text-sm text-muted-foreground">{testimonials[activeTestimonial].role}</p>
                  </div>
                  <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTestimonial(index)}
                        className={`w-2.5 h-2.5 rounded-full ${index === activeTestimonial
                          ? 'bg-primary'
                          : 'bg-muted-foreground/30'
                          }`}
                        aria-label={`View testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 dark:bg-muted/10 py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Wallet className="h-6 w-6 text-primary mr-2" />
                <span className="text-xl font-bold">CryptoFolio</span>
              </div>
              <p className="text-muted-foreground mb-4">Your all-in-one cryptocurrency portfolio tracker.</p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Email">
                  <Mail className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Testimonials</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">About</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} CryptoFolio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

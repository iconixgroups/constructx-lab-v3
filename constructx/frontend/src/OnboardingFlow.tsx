import React, { useState } from 'react';
import { ThemeProvider } from './components/ui/theme-provider';
import { Button } from './components/ui/button';
import { Container } from './components/ui/container';
import { Heading } from './components/ui/heading';
import { Text } from './components/ui/text';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';

function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    industry: '',
    companySize: '',
    plan: 'professional', // Default selected plan
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSelectPlan = (plan: string) => {
    setFormData(prev => ({ ...prev, plan }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <Heading as="h1" size="h3" className="mb-2">Create Your Account</Heading>
              <Text variant="muted">Start your 30-day free trial. No credit card required.</Text>
            </div>
            <form className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name</label>
                <Input 
                  id="fullName" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleInputChange} 
                  placeholder="Enter your full name" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  placeholder="Enter your email" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  placeholder="Create a password" 
                  required 
                />
                <div className="mt-1">
                  <div className="h-1 w-full bg-muted overflow-hidden rounded-full">
                    <div className={`h-full ${formData.password.length > 8 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${Math.min(100, formData.password.length * 10)}%` }}></div>
                  </div>
                  <Text variant="small" className="mt-1">Password must be at least 8 characters</Text>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type="password" 
                  value={formData.confirmPassword} 
                  onChange={handleInputChange} 
                  placeholder="Confirm your password" 
                  required 
                />
              </div>
              <div className="pt-4">
                <Button className="w-full" onClick={handleNextStep}>Create Account</Button>
              </div>
              <div className="text-center">
                <Text variant="small">
                  Already have an account? <a href="#" className="text-primary hover:underline">Log in</a>
                </Text>
              </div>
            </form>
          </div>
        );
      case 2:
        return (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <Heading as="h1" size="h3" className="mb-2">Verify Your Email</Heading>
              <Text variant="muted">We've sent a verification link to {formData.email}</Text>
            </div>
            <div className="bg-muted/30 rounded-lg p-6 text-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-primary">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <Text>Please check your inbox and click the verification link to continue.</Text>
            </div>
            <div className="text-center space-y-4">
              <Button variant="outline" className="w-full" onClick={handleNextStep}>
                I've verified my email
              </Button>
              <Text variant="small">
                Didn't receive an email? <a href="#" className="text-primary hover:underline">Resend verification</a>
              </Text>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <Heading as="h1" size="h3" className="mb-2">Choose Your Plan</Heading>
              <Text variant="muted">Select the plan that best fits your needs</Text>
            </div>
            <div className="flex justify-center mb-8">
              <div className="bg-muted rounded-full p-1 inline-flex">
                <button className="px-4 py-2 rounded-full bg-primary text-primary-foreground">Monthly</button>
                <button className="px-4 py-2 rounded-full">Annual (Save 20%)</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  id: 'standard',
                  name: 'Standard',
                  price: '$49',
                  description: 'For small teams getting started',
                  features: [
                    '5 team members',
                    '3 projects',
                    'Basic modules',
                    'Email support'
                  ]
                },
                {
                  id: 'professional',
                  name: 'Professional',
                  price: '$99',
                  description: 'For growing businesses',
                  features: [
                    '15 team members',
                    '10 projects',
                    'All modules',
                    'Priority support',
                    'Advanced reporting'
                  ],
                  recommended: true
                },
                {
                  id: 'enterprise',
                  name: 'Enterprise',
                  price: '$249',
                  description: 'For large organizations',
                  features: [
                    'Unlimited team members',
                    'Unlimited projects',
                    'All modules + premium features',
                    'Dedicated support',
                    'Custom integrations',
                    'Advanced security'
                  ]
                }
              ].map(plan => (
                <Card 
                  key={plan.id} 
                  className={`relative ${formData.plan === plan.id ? 'border-primary ring-2 ring-primary' : ''} ${plan.recommended ? 'shadow-lg' : ''}`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-0 right-0 flex justify-center">
                      <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">Recommended</span>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="flex items-baseline mt-2">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground ml-1">/month</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2 h-4 w-4">
                            <path d="M20 6 9 17l-5-5"/>
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant={formData.plan === plan.id ? "default" : "outline"} 
                      className="w-full"
                      onClick={() => handleSelectPlan(plan.id)}
                    >
                      {formData.plan === plan.id ? "Selected" : "Select Plan"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={handlePrevStep}>Back</Button>
              <Button onClick={handleNextStep}>Continue</Button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <Heading as="h1" size="h3" className="mb-2">Company Information</Heading>
              <Text variant="muted">Tell us about your company</Text>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <form className="space-y-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium mb-1">Company Name</label>
                  <Input 
                    id="companyName" 
                    name="companyName" 
                    value={formData.companyName} 
                    onChange={handleInputChange} 
                    placeholder="Enter your company name" 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium mb-1">Industry</label>
                  <select 
                    id="industry" 
                    name="industry" 
                    value={formData.industry} 
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select an industry</option>
                    <option value="general_contractor">General Contractor</option>
                    <option value="specialty_contractor">Specialty Contractor</option>
                    <option value="architecture">Architecture</option>
                    <option value="engineering">Engineering</option>
                    <option value="owner_developer">Owner/Developer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="companySize" className="block text-sm font-medium mb-1">Company Size</label>
                  <select 
                    id="companySize" 
                    name="companySize" 
                    value={formData.companySize} 
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501+">501+ employees</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="logo" className="block text-sm font-medium mb-1">Company Logo (optional)</label>
                  <div className="mt-1 flex items-center">
                    <div className="h-16 w-16 rounded-md border border-dashed border-input flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
                        <line x1="16" x2="22" y1="5" y2="5"/>
                        <line x1="19" x2="19" y1="2" y2="8"/>
                        <circle cx="9" cy="9" r="2"/>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                      </svg>
                    </div>
                    <Button variant="outline" className="ml-4">Upload Logo</Button>
                  </div>
                </div>
              </form>
            </div>
            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={handlePrevStep}>Back</Button>
              <Button onClick={handleNextStep}>Continue</Button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <Heading as="h1" size="h3" className="mb-2">Create Your First Project</Heading>
              <Text variant="muted">Let's set up your first project in ConstructX</Text>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <form className="space-y-6">
                <div>
                  <label htmlFor="projectName" className="block text-sm font-medium mb-1">Project Name</label>
                  <Input 
                    id="projectName" 
                    name="projectName" 
                    placeholder="Enter project name" 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="projectType" className="block text-sm font-medium mb-1">Project Type</label>
                  <select 
                    id="projectType" 
                    name="projectType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select project type</option>
                    <option value="commercial">Commercial</option>
                    <option value="residential">Residential</option>
                    <option value="industrial">Industrial</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium mb-1">Start Date</label>
                    <Input 
                      id="startDate" 
                      name="startDate" 
                      type="date"
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium mb-1">Estimated End Date</label>
                    <Input 
                      id="endDate" 
                      name="endDate" 
                      type="date"
                      required 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3">Select Modules</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Document Management",
                      "Schedule Management",
                      "Budget Management",
                      "Team Management",
                      "RFI Management",
                      "Submittal Management",
                      "Issues Management",
                      "Daily Logs"
                    ].map((module, index) => (
                      <div key={index} className="flex items-center">
                        <input 
                          type="checkbox" 
                          id={`module-${index}`} 
                          className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                          defaultChecked={index < 4}
                        />
                        <label htmlFor={`module-${index}`} className="ml-2 text-sm">
                          {module}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={handlePrevStep}>Back</Button>
              <Button onClick={handleNextStep}>Create Project</Button>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <Heading as="h1" size="h3" className="mb-2">Setup Complete!</Heading>
              <Text variant="lead" className="mb-4">Your ConstructX account is ready to use</Text>
              <Text variant="muted" className="mb-8">You now have access to all the tools you need to manage your construction projects efficiently.</Text>
              <Button size="lg" onClick={() => window.location.href = '/dashboard'}>
                Enter Dashboard
              </Button>
            </div>
            <div className="bg-muted/30 rounded-lg p-6 mt-8">
              <Heading as="h3" size="h5" className="mb-4">Getting Started Checklist</Heading>
              <ul className="space-y-3">
                {[
                  "Complete your user profile",
                  "Invite team members",
                  "Explore key features",
                  "Upload project documents",
                  "Schedule a demo with our team"
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <div className="h-6 w-6 rounded-full border border-input flex items-center justify-center mr-3">
                      <span className="text-xs">{index + 1}</span>
                    </div>
                    <Text>{item}</Text>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="constructx-theme">
      <div className="min-h-screen bg-background font-sans antialiased">
        {/* Header */}
        <header className="w-full border-b bg-background/95 backdrop-blur">
          <Container>
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                  <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                  <path d="M12 3v6" />
                </svg>
                <span className="text-xl font-bold">ConstructX</span>
              </div>
              <div className="flex items-center">
                <div className="text-sm text-muted-foreground">
                  Need help? <a href="#" className="text-primary hover:underline">Contact Support</a>
                </div>
              </div>
            </div>
          </Container>
        </header>

        {/* Progress Bar */}
        <div className="bg-muted py-2">
          <Container>
            <div className="flex items-center">
              <div className="w-full bg-muted-foreground/20 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-300 ease-in-out" 
                  style={{ width: `${(step / 6) * 100}%` }}
                ></div>
              </div>
              <span className="ml-4 text-sm font-medium">Step {step}/6</span>
            </div>
          </Container>
        </div>

        {/* Main Content */}
        <main className="py-12">
          <Container>
            {renderStep()}
          </Container>
        </main>

        {/* Footer */}
        <footer className="py-6 border-t">
          <Container>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-muted-foreground mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} ConstructX. All rights reserved.
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Help Center</a>
              </div>
            </div>
          </Container>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default OnboardingFlow;

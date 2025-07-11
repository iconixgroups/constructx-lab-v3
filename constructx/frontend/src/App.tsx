import React from 'react';
import { ThemeProvider } from './components/ui/theme-provider';
import { Button } from './components/ui/button';
import { Container } from './components/ui/container';
import { Heading } from './components/ui/heading';
import { Text } from './components/ui/text';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="constructx-theme">
      <div className="min-h-screen bg-background font-sans antialiased">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
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
              <nav className="hidden md:flex items-center gap-6">
                <a href="#features" className="text-sm font-medium hover:text-primary">Features</a>
                <a href="#modules" className="text-sm font-medium hover:text-primary">Modules</a>
                <a href="#pricing" className="text-sm font-medium hover:text-primary">Pricing</a>
                <a href="#about" className="text-sm font-medium hover:text-primary">About</a>
              </nav>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild><a href="/login">Log In</a></Button>
                <Button size="sm">Start Free Trial</Button>
              </div>
            </div>
          </Container>
        </header>

        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
          <Container>
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <Heading className="mb-6">Enterprise-Grade Construction Management Platform</Heading>
              <Text variant="lead" className="mb-8">
                Streamline your construction projects with our all-in-one SaaS solution featuring 23 integrated modules and AI-powered insights
              </Text>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg">Start Free Trial</Button>
                <Button variant="outline" size="lg">Schedule Demo</Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Key Features Section */}
        <section id="features" className="py-20 bg-background">
          <Container>
            <div className="text-center mb-16">
              <Heading as="h2" size="h2" className="mb-4">Comprehensive Project Management</Heading>
              <Text variant="large" className="max-w-2xl mx-auto">
                Everything you need to manage complex construction projects from start to finish
              </Text>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Project Management",
                  description: "End-to-end project lifecycle management with powerful tracking tools"
                },
                {
                  title: "Document Control",
                  description: "Centralized document management with version control and approval workflows"
                },
                {
                  title: "Financial Tools",
                  description: "Integrated budgeting, payments, and invoicing for complete financial oversight"
                },
                {
                  title: "Field Operations",
                  description: "Mobile-optimized tools for on-site teams to capture and share critical information"
                },
                {
                  title: "AI Integration",
                  description: "Intelligent insights and automation across all modules to boost productivity"
                },
                {
                  title: "Reporting",
                  description: "Customizable dashboards and reports for data-driven decision making"
                }
              ].map((feature, index) => (
                <Card key={index} variant="interactive">
                  <CardHeader>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" className="p-0">Learn More</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* Module Showcase Section */}
        <section id="modules" className="py-20 bg-muted/30">
          <Container>
            <div className="text-center mb-16">
              <Heading as="h2" size="h2" className="mb-4">23 Specialized Modules for Every Need</Heading>
              <Text variant="large" className="max-w-2xl mx-auto">
                Our comprehensive suite of modules covers every aspect of construction management
              </Text>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                "Project Management",
                "Document Management",
                "RFI Management",
                "Submittal Management",
                "Schedule Management",
                "Budget Management",
                "Team Management",
                "Contracts Management",
                "Issues Management",
                "Quality Management",
                "Approvals Management",
                "Payments Management",
                "Quotes Management",
                "Invoices Management",
                "Smart Logs Management",
                "Inspections Management",
                "Material Management",
                "Equipment Management",
                "Site 360 Management",
                "Project Archives",
                "Operations & Manuals",
                "Facility Management",
                "Reports Management"
              ].map((module, index) => (
                <Card key={index} className="p-4 text-center">
                  <Text className="font-medium">{module}</Text>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* AI Capabilities Section */}
        <section className="py-20 bg-background">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <Heading as="h2" size="h2" className="mb-6">AI-Powered Construction Management</Heading>
                <Text className="mb-6">
                  Leverage the power of artificial intelligence to optimize your construction projects, predict potential issues, and automate routine tasks.
                </Text>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1 flex-shrink-0">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    <Text>Predictive analytics for schedule and budget risks</Text>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1 flex-shrink-0">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    <Text>Automated document processing and classification</Text>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1 flex-shrink-0">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    <Text>Intelligent insights and recommendations</Text>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1 flex-shrink-0">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    <Text>Natural language search across all project data</Text>
                  </li>
                </ul>
                <Button>Explore AI Features</Button>
              </div>
              <div className="bg-muted rounded-lg p-8 flex items-center justify-center">
                <div className="text-6xl text-primary">AI</div>
              </div>
            </div>
          </Container>
        </section>

        {/* Call-to-Action Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <Heading as="h2" size="h2" className="mb-6">Ready to Transform Your Construction Management?</Heading>
              <Text variant="large" className="mb-8">
                Join thousands of companies already using ConstructX to streamline their projects and boost productivity.
              </Text>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" variant="secondary">Start Free Trial</Button>
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  Contact Sales
                </Button>
              </div>
              <Text variant="small" className="mt-4">No credit card required</Text>
            </div>
          </Container>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-muted">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Features</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Modules</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Pricing</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Roadmap</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">About</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Careers</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Blog</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Documentation</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Tutorials</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Support</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">API</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Cookie Policy</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">GDPR</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
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
              <div className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} ConstructX. All rights reserved.
              </div>
            </div>
          </Container>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;

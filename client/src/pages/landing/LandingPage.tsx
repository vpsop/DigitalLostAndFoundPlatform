import {Heart, MapPin, Search, Users} from "lucide-react";
import {Navbar} from "../../components/common/Navbar";
import {Badge} from "../../components/ui/badge";
import {Link} from "react-router-dom";
import {Button} from "../../components/ui/button";
import {Card, CardDescription, CardHeader, CardTitle} from "../../components/ui/card";
import {useAuth} from "../../auth/useAuth";

export function LandingPage() {
	const {user} = useAuth();
	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<div>
				{/* Hero Section */}
				<section className="py-20 px-4">
					<div className="container mx-auto text-center max-w-4xl">
						<Badge variant="secondary" className="mb-6">
							<Heart className="w-3 h-3 mr-1" />
							Serving NITC Community
						</Badge>
						<h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
							Lost Something?
							<span className="text-primary block">We'll Help You Find It</span>
						</h1>
						<p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
							The digital lost and found platform for NIT Calicut campus. Report lost items, help others
							find their belongings, and strengthen our campus community.
						</p>
						{user != null ? (
							<Link to="/posts/create">
								<Button size="lg" className="w-full sm:w-auto px-10 py-4">
									Report an Item
								</Button>
							</Link>
						) : (
							<Link to="/register">
								<Button size="lg" className="w-full sm:w-auto px-10 py-4">
									Create an Account
								</Button>
							</Link>
						)}
					</div>
				</section>

				{/* Features Section */}
				<section className="py-16 px-4 bg-muted/30">
					<div className="container mx-auto">
						<div className="text-center mb-12">
							<h2 className="text-3xl font-bold mb-4">How It Works</h2>
							<p className="text-muted-foreground max-w-2xl mx-auto">
								Our platform makes it easy to reunite lost items with their owners through a secure and
								efficient process.
							</p>
						</div>
						<div className="grid md:grid-cols-3 gap-8">
							<Card className="text-center">
								<CardHeader>
									<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
										<MapPin className="w-6 h-6 text-primary" />
									</div>
									<CardTitle>Report Items</CardTitle>
									<CardDescription>
										Quickly report lost or found items with photos and detailed descriptions
									</CardDescription>
								</CardHeader>
							</Card>
							<Card className="text-center">
								<CardHeader>
									<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
										<Search className="w-6 h-6" />
									</div>
									<CardTitle>Smart Matching</CardTitle>
									<CardDescription>
										Our system automatically matches lost and found items based on descriptions and
										location
									</CardDescription>
								</CardHeader>
							</Card>
							<Card className="text-center">
								<CardHeader>
									<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
										<Users className="w-6 h-6" />
									</div>
									<CardTitle>Secure Contact</CardTitle>
									<CardDescription>
										Connect with item owners through our secure messaging system while maintaining
										privacy
									</CardDescription>
								</CardHeader>
							</Card>
						</div>
					</div>
				</section>

				{/* Trust Section */}
				<section className="py-16 px-4 bg-muted/30">
					<div className="container mx-auto">
						<div className="grid md:grid-cols-1 gap-12 items-center">
							<div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
								<div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
									<Heart className="w-12 h-12 text-primary" />
								</div>
								<h3 className="text-xl font-semibold mb-4">Join Our Community</h3>
								<p className="text-muted-foreground mb-6">
									Be part of a caring community that helps each other find what matters most.
								</p>
								{user == null ? (
									<Link to="/register">
										<Button size="lg">Get Started Today</Button>
									</Link>
								) : (
									<Button size="lg" disabled>
										You are already logged in
									</Button>
								)}
							</div>
						</div>
					</div>
				</section>

				{/* Footer */}
				<footer className="border-t border-border py-12 px-4 text-center">
					<div className="container mx-auto">
						<div className="grid md:grid-cols-3 gap-10">
							<div>
								<h4 className="font-semibold mb-3">Platform</h4>
								<ul className="space-y-2 text-sm text-muted-foreground">
									<li>
										<Link to="/posts/report-lost" className="hover:text-foreground">
											Report Lost
										</Link>
									</li>
									<li>
										<Link to="/posts/report-found" className="hover:text-foreground">
											Report Found
										</Link>
									</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold mb-3">Support</h4>
								<ul className="space-y-2 text-sm text-muted-foreground">
									<li>
										<Link to="/help" className="hover:text-foreground">
											Help Center
										</Link>
									</li>
									<li>
										<Link to="/contact" className="hover:text-foreground">
											Contact Us
										</Link>
									</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold mb-3">Others</h4>
								<ul className="space-y-2 text-sm text-muted-foreground">
									<li>
										<Link to="/privacy" className="hover:text-foreground">
											Privacy
										</Link>
									</li>
									<li>
										<Link to="/terms" className="hover:text-foreground">
											Terms of Service
										</Link>
									</li>
								</ul>
							</div>
						</div>
						<div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
							<p>&copy; 2024 NITC Lost & Found Platform. Built with ❤️ for the NITC community.</p>
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
}

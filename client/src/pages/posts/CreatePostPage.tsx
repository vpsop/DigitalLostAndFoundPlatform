import type React from "react";
import {useEffect, useState} from "react";
import {Button} from "../../components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../components/ui/card";
import {Input} from "../../components/ui/input";
import {Label} from "../../components/ui/label";
import {Textarea} from "../../components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../components/ui/select";
import {Alert, AlertDescription} from "../../components/ui/alert";
import {Upload, X} from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import {postsApi} from "../../api/postsApi";
import {toast} from "sonner";
import {Navbar} from "../../components/common/Navbar";
import {useAuth} from "../../auth/useAuth";

export default function CreatePostPage() {
	const {user} = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	}, [navigate, user]);

	const [postType, setPostType] = useState<"lost" | "found" | "">("");
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		keywords: "",
		category: "",
		location: "",
		date: new Date(Date.now()),
		contactInfo: "",
	});
	const [image, setImage] = useState<File | null>(null);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// Categories and location state
	const [categories, setCategories] = useState<string[]>([]);
	const [locations, setLocations] = useState<string[]>([]);

	const fetchOnMount = async () => {
		await postsApi.getLocations().then((locRes) => {
			console.log("Fetched locations:", locRes.data.data.locations);
			setLocations(locRes.data.data.locations);
		});

		await postsApi.getCategories().then((catRes) => {
			console.log("Fetched categories:", catRes.data.data.categories);
			setCategories(catRes.data.data.categories);
		});
	};

	// Fetch categories, locations from API when component mounts
	useEffect(() => {
		fetchOnMount();
	}, []);

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({...prev, [field]: value}));
	};

	const handleDateChange = (value: string) => {
		setFormData((prev) => ({...prev, date: new Date(value)}));
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) setImage(file);
	};

	const removeImage = () => {
		setImage(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		// Validation
		if (!postType) {
			setError("Please select whether this is a lost or found item");
			setIsLoading(false);
			return;
		}

		if (!formData.title.trim()) {
			setError("Please provide a title for your post");
			setIsLoading(false);
			return;
		}

		if (!formData.description.trim()) {
			setError("Please provide a description");
			setIsLoading(false);
			return;
		}

		if (!formData.category) {
			setError("Please select a category");
			setIsLoading(false);
			return;
		}

		if (!formData.location) {
			setError("Please specify the location");
			setIsLoading(false);
			return;
		}

		if (!formData.date) {
			setError("Please specify the date");
			setIsLoading(false);
			return;
		}

		// Simulate post creation
		try {
			await new Promise((resolve) => setTimeout(resolve, 1500));
			// Redirect to posts page
			await postsApi.create(
				formData.title,
				formData.description,
				formData.location,
				formData.category,
				formData.date,
				postType == "found" ? "found" : "lost",
				formData.keywords,
				image
			);
			toast.success("Post created successfully");
			// window.location.href = "/posts?message=Post created successfully";
		} catch {
			toast.error("Failed to create post. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<Navbar />

			<div className="container mx-auto px-4 py-8 max-w-2xl">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold mb-2">Report an Item</h1>
					<p className="text-muted-foreground">Help the NITC community by reporting lost or found items</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Create New Post</CardTitle>
						<CardDescription>Provide detailed information to help others identify the item</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							{error && (
								<Alert variant="destructive">
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							{/* Post Type Selection */}
							<div className="space-y-3">
								<Label>What are you reporting?</Label>
								<div className="flex gap-4">
									<Button
										type="button"
										variant={postType === "lost" ? "default" : "outline"}
										onClick={() => setPostType("lost")}
										className="flex-1"
									>
										Lost Item
									</Button>
									<Button
										type="button"
										variant={postType === "found" ? "default" : "outline"}
										onClick={() => setPostType("found")}
										className="flex-1"
									>
										Found Item
									</Button>
								</div>
							</div>

							{postType && (
								<>
									{/* Title */}
									<div className="space-y-2">
										<Label htmlFor="title">
											Title <span className="text-destructive">*</span>
										</Label>
										<Input
											id="title"
											placeholder={`e.g., ${
												postType === "lost" ? "Lost Water bottle" : "Found Water Bottle"
											}`}
											value={formData.title}
											onChange={(e) => handleInputChange("title", e.target.value)}
											className="bg-background"
										/>
									</div>

									{/* Description */}
									<div className="space-y-2">
										<Label htmlFor="description">
											Description <span className="text-destructive">*</span>
										</Label>
										<Textarea
											id="description"
											placeholder={`Provide detailed description including color, size, brand, distinctive features, etc.`}
											value={formData.description}
											onChange={(e) => handleInputChange("description", e.target.value)}
											rows={4}
											className="bg-background"
										/>
									</div>

									{/* Keywords */}
									<div className="space-y-2">
										<Label htmlFor="keywords">
											Add Keywords (Separated with comma, Not case-sensitive){" "}
											<span className="text-destructive"></span>
										</Label>
										<Input
											id="keywords"
											placeholder={`bottle, green`}
											value={formData.keywords}
											onChange={(e) => handleInputChange("keywords", e.target.value)}
											className="bg-background"
										/>
									</div>

									{/* Category and Location */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label>
												Category <span className="text-destructive">*</span>
											</Label>
											<Select
												value={formData.category}
												onValueChange={(value) => handleInputChange("category", value)}
											>
												<SelectTrigger className="bg-background w-full">
													<SelectValue placeholder="Select category" />
												</SelectTrigger>
												<SelectContent>
													{categories.map((category) => (
														<SelectItem key={category} value={category}>
															{category}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										<div className="space-y-2">
											<Label>
												Location <span className="text-destructive">*</span>
											</Label>
											<Select
												value={formData.location}
												onValueChange={(value) => handleInputChange("location", value)}
											>
												<SelectTrigger className="bg-background w-full">
													<SelectValue placeholder="Select location" />
												</SelectTrigger>
												<SelectContent>
													{locations.map((location) => (
														<SelectItem key={location} value={location}>
															{location}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>

									{/* Date */}
									<div className="space-y-2">
										<Label htmlFor="date">
											Date {postType === "lost" ? "Lost" : "Found"}{" "}
											<span className="text-destructive">*</span>
										</Label>
										<Input
											id="date"
											type="date"
											value={formData.date.toISOString().split("T")[0]}
											onChange={(e) => handleDateChange(e.target.value)}
											className="bg-background"
										/>
									</div>

									{/* Images */}
									<div className="space-y-3">
										{image == null && (
											<>
												<Label>Image (Optional)</Label>
												<div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
													<input
														type="file"
														accept="image/*"
														onChange={handleImageChange}
														className="hidden"
														id="image-upload"
													/>
													<label htmlFor="image-upload" className="cursor-pointer">
														<Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
														<p className="text-sm text-muted-foreground">
															Click to upload image. (Max 1 image)
														</p>
													</label>
												</div>
											</>
										)}

										{image != null && (
											<div className="relative">
												<img
													src={URL.createObjectURL(image) || "/placeholder.svg"}
													alt={`Uploaded Image`}
													className="w-24 h-24 object-cover rounded-sm"
												/>
												<Button
													type="button"
													variant="destructive"
													size="sm"
													className="absolute -top-2 -left-2 w-6 h-6 rounded-full p-0"
													onClick={() => removeImage()}
												>
													<X className="w-3 h-3" />
												</Button>
											</div>
										)}
									</div>

									{/* Submit Button */}
									<div className="flex gap-4">
										<Button
											type="button"
											variant="outline"
											asChild
											className="flex-1 bg-transparent"
										>
											<Link to="/posts">Cancel</Link>
										</Button>
										<Button type="submit" disabled={isLoading} className="flex-1">
											{isLoading ? "Creating Post..." : "Create Post"}
										</Button>
									</div>
								</>
							)}
						</form>
					</CardContent>
				</Card>

				{/* Tips */}
				<Card className="mt-6">
					<CardHeader>
						<CardTitle className="text-lg">Tips for Better Results</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-start gap-3">
							<div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
							<p className="text-sm">Be as specific as possible in your description</p>
						</div>
						<div className="flex items-start gap-3">
							<div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
							<p className="text-sm">Include distinctive features, colors, and brands</p>
						</div>
						<div className="flex items-start gap-3">
							<div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
							<p className="text-sm">Upload clear photos if available</p>
						</div>
						<div className="flex items-start gap-3">
							<div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
							<p className="text-sm">Specify the exact location and time when possible</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

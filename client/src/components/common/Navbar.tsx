import {Search} from "lucide-react";
import {Link} from "react-router-dom";
import {Button} from "../ui/button";
import {useAuth} from "../../auth/useAuth";

export function Navbar() {
	const {user, logout} = useAuth();
	const isAdmin = user?.role === "admin";
	return (
		<header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 h-[70px]">
			<div className="container mx-auto px-4 py-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
						<Search className="w-4 h-4 text-primary-foreground" />
					</div>
					<span className="font-bold text-xl text-foreground">Lost & Found</span>
				</div>
				<nav className="hidden md:flex items-center gap-6">
					{isAdmin === true && (
						<Link
							to="/admin/dashboard"
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							Admin Dashboard
						</Link>
					)}
					<Link to="/posts" className="text-muted-foreground hover:text-foreground transition-colors">
						Posts
					</Link>
				</nav>
				<div className="flex items-center gap-3">
					{user == null ? (
						<>
							<Link to="/register">
								<Button>Register</Button>
							</Link>
							<Link to="/login">
								<Button variant="ghost">Login</Button>
							</Link>
						</>
					) : (
						<>
							<p>{user.username}</p>
							<Link to="/posts/create">
								<Button>Report an Item</Button>
							</Link>
							<Button variant="ghost" onClick={() => logout()}>
								Logout
							</Button>
						</>
					)}
				</div>
			</div>
		</header>
	);
}

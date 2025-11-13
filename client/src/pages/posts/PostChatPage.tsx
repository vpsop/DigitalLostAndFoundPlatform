import {useEffect, useRef, useState, useTransition} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../../auth/useAuth";
import {chatApi} from "../../api/chatApi";
import {toast} from "sonner";

interface IChatMessage {
	_id: string;
	roomId: string;
	senderName: string;
	text: string;
	createdAt: Date;
	updatedAt: Date;
}

export default function PostChatPage() {
	const {postId} = useParams();
	const {user} = useAuth();
	const navigate = useNavigate();

	/**
	 * Send the Unauthenticated users to login page
	 * Only allow authenticated users to be on this page
	 */
	useEffect(() => {
		if (!user || user === null) {
			navigate("/login");
		}
	}, [navigate, user]);

	// states
	const [messages, setMessages] = useState<IChatMessage[]>([]);
	const [text, setText] = useState("");
	const pollingRef = useRef<number | null>(null);
	const [isPending, startTransition] = useTransition();
	let fetchFailedShown = false;

	const ensureRoom = (postId: string) => {
		startTransition(async () => {
			try {
				await chatApi.getMessages(postId);
			} catch {
				toast.error("Chat may not exist.");
			}
		});
	};

	/**
	 * This ensure that room exists when this page is loaded
	 * or when postId changes
	 */
	useEffect(() => {
		if (!postId) return;
		ensureRoom(postId);
	}, [postId]);

	const fetchMessages = async (postId: string) => {
		startTransition(async () => {
			try {
				const res = await chatApi.getMessages(postId);
				const data = res.data;
				setMessages([...data]);
			} catch (e) {
				if (fetchFailedShown) {
					toast.error("Failed to load chat messages. Please refresh the page.");
					console.log("Error while fetching messages: ", e);
					fetchFailedShown = true;
				}
			}
		});
	};

	useEffect(() => {
		if (!postId) return;
		fetchMessages(postId);
		pollingRef.current = window.setInterval(() => fetchMessages(postId), 2000);
		return () => {
			if (pollingRef.current) window.clearInterval(pollingRef.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [postId]);

	if (!user || !user.username) {
		return <>You need to be logged in.</>;
	}

	const senderName = user.username;
	if (!postId || !postId.trim()) {
		return <>Please go to a post chat page</>;
	}

	const handleSend = async () => {
		if (!text.trim() || !postId) return;
		startTransition(async () => {
			try {
				// await api.createMessage(postId, senderName, text);
				await chatApi.createMessage(postId, text);
				setText("");
				await fetchMessages(postId);
			} catch (e) {
				console.error("Failed to send message:", e);
				toast.error("Failed to send message. Please try again.");
			}
		});
	};

	if (isPending && messages.length === 0) {
		return (
			<div style={{maxWidth: 800, margin: "0 auto", padding: 16}}>
				<h2>Loading chat room...</h2>
			</div>
		);
	}

	return (
		<div style={{maxWidth: 800, margin: "0 auto", padding: 16}}>
			<div style={{marginBottom: 16}}>
				<h2>
					Anonymous Chat - Room: {postId} - {user.username}
				</h2>
				<p style={{fontSize: 14, color: "#666", marginTop: 4}}>
					You are: <strong>{senderName}</strong> | Share this room ID to let others join
				</p>
			</div>

			<div
				style={{
					border: "1px solid #ddd",
					borderRadius: 8,
					padding: 12,
					height: 400,
					overflowY: "auto",
					marginBottom: 12,
					backgroundColor: "#f9fafb",
				}}
			>
				{messages.length === 0 ? (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							height: "100%",
							color: "#666",
						}}
					>
						No messages yet. Start the conversation!
					</div>
				) : (
					messages.map((m) => (
						<div
							key={m._id}
							style={{
								marginBottom: 12,
								padding: 8,
								backgroundColor: m.senderName === senderName ? "#dbeafe" : "#ffffff",
								borderRadius: 8,
								border: m.senderName === senderName ? "1px solid #93c5fd" : "1px solid #e5e7eb",
							}}
						>
							<div style={{marginBottom: 4}}>
								<strong
									style={{
										color: m.senderName === senderName ? "#1e40af" : "#374151",
									}}
								>
									{m.senderName}
								</strong>
								{m.senderName === senderName && (
									<span style={{marginLeft: 8, fontSize: 12, color: "#6b7280"}}>(You)</span>
								)}
							</div>
							<div style={{marginBottom: 4, wordBreak: "break-word"}}>{m.text}</div>
							<div style={{fontSize: 11, color: "#9ca3af"}}>{new Date(m.createdAt).toLocaleString()}</div>
						</div>
					))
				)}
			</div>

			<div style={{display: "flex", gap: 8}}>
				<input
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder={`Type a message as ${senderName}...`}
					// disabled={ loading }
					style={{
						flex: 1,
						padding: 10,
						borderRadius: 6,
						border: "1px solid #d1d5db",
						fontSize: 14,
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							handleSend();
						}
					}}
				/>
				<button
					onClick={handleSend}
					// disabled={ loading || !text.trim() }
					style={{
						padding: "10px 20px",
						borderRadius: 6,
						backgroundColor: "#3b82f6",
						color: "white",
						border: "none",
						// cursor: loading || !text.trim() ? "not-allowed" : "pointer",
						cursor: "pointer",
						// opacity: loading || !text.trim() ? 0.6 : 1,
						fontWeight: 500,
					}}
				>
					Send
				</button>
				<button
					style={{
						padding: "10px 20px",
						borderRadius: 6,
						backgroundColor: "#f6443bff",
						color: "white",
						border: "none",
						// cursor: loading || !text.trim() ? "not-allowed" : "pointer",
						cursor: "pointer",
						// opacity: loading || !text.trim() ? 0.6 : 1,
						fontWeight: 500,
					}}
				>
					Raise Dispute
				</button>
			</div>
		</div>
	);
}

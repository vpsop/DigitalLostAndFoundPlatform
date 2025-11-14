import { Router } from "express";
import {
	createMessage,
	createRoom,
	getMessages,
	getRoomByItem,
} from "../controllers/chatController";

const router = Router();

// Create a room (optionally tied to an item)
router.post("/rooms", createRoom);

// Get room by itemId
router.get("/rooms/item/:itemId", getRoomByItem);

// Messages for a room
router.post("/:roomId/messages", createMessage);
router.get("/:roomId/messages", getMessages);

export { router as ChatRouter };

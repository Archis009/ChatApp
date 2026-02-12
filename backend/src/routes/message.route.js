import express from "express"; 
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { getAllContacts, getChatPartners, getMessageByUserId, sendMessage } from "../controllers/message.controller.js";

const router = express.Router(); 

router.use(arcjetProtection, protectRoute);

router.get("/contacts", getAllContacts); // req.user in protectRoute will give us the logged in user details, we can use that to filter out the logged in user from the list of all users and return only the contacts.
router.get("/chats", getChatPartners); // get all users that I have chatted with (either sent or received messages)
router.get("/:id", getMessageByUserId); // get all messages between logged in user and user with id = req.params.id, we will use this in the frontend to display the chat history between two users. We will query the messages collection for messages where (senderId = logged in user id and receiverId = req.params.id) OR (senderId = req.params.id and receiverId = logged in user id)
router.post("/send/:id", sendMessage);

export default router; 
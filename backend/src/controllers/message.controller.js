import Message from "../models/Message.js"; 
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUser = await User.findById(req.user._id);
        const deletedContacts = loggedInUser.deletedContacts || [];
        const blockedUsers = loggedInUser.blockedUsers || [];

        const filteredUsers = await User.find({ 
            _id: { $ne: loggedInUser._id, $nin: deletedContacts } 
        }).select("-password"); 

        const usersWithBlockStatus = filteredUsers.map(user => {
            const userObj = user.toObject();
            userObj.hasBlockedThem = blockedUsers.some(id => id.toString() === user._id.toString());
            userObj.isBlockedByThem = user.blockedUsers ? user.blockedUsers.some(id => id.toString() === loggedInUser._id.toString()) : false;
            return userObj;
        });

        res.status(200).json(usersWithBlockStatus);
    } catch (error) {
        console.log("Error fetching contacts:", error);
        res.status(500).json({ message: "Server error" });
    }
}; 

export const getMessageByUserId = async (req, res) => {
    try {
        const myId = req.user._id;
        const otherUserId = req.params.id; 

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: myId }
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error fetching messages:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const senderId = req.user._id; //my Id 
        const receiverId = req.params.id;

        if (!text && !image){
            return res.status(400).json({ message: "Text or Image is required" })
        }

        if (senderId.equals(receiverId)) {
            return res.status(400).json({ message: "Cannot send message to yourself." })
        }

        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: "Reciever not found."});
        }

        const sender = await User.findById(senderId);
        if (sender.blockedUsers && sender.blockedUsers.includes(receiverId)) {
            return res.status(403).json({ message: "You have blocked this user." });
        }

        if (receiver.blockedUsers && receiver.blockedUsers.includes(senderId)) {
            return res.status(403).json({ message: "You are blocked by this user." });
        }



        let imageUrl; 
        if (image){
            const uploadResponse = await cloudinary.uploader.upload(image); 
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        // send message in real time if user is online using socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        console.log("Receiver ID:", receiverId, "Socket ID:", receiverSocketId);
        if (receiverSocketId) {
            console.log("Emitting newMessage to", receiverId);
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error sending message:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUser = await User.findById(req.user._id);
        const MyId = req.user._id; 
        const deletedContacts = loggedInUser.deletedContacts || [];
        const blockedUsers = loggedInUser.blockedUsers || [];

        const messages = await Message.find({
            $or: [
                { senderId: MyId },
                { receiverId: MyId }
            ]
        })

        const chatPartnerIds = [...new Set(messages.map((msg) => 
            msg.senderId.toString() == MyId 
            ? msg.receiverId.toString() 
            : msg.senderId.toString()
                )
            )
        ]

        // Filter out deleted contacts
        const validPartnerIds = chatPartnerIds.filter(id => !deletedContacts.includes(id));

        const chatPartners = await User.find({_id: {$in: validPartnerIds}}).select("-password"); 

        const partnersWithBlockStatus = chatPartners.map(user => {
            const userObj = user.toObject();
            userObj.hasBlockedThem = blockedUsers.some(id => id.toString() === user._id.toString());
            userObj.isBlockedByThem = user.blockedUsers ? user.blockedUsers.some(id => id.toString() === loggedInUser._id.toString()) : false;
            return userObj;
        });

        res.status(200).json(partnersWithBlockStatus);

    } catch (error) {
        console.log("Error fetching chat partners:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const clearChat = async (req, res) => {
    try {
        const myId = req.user._id;
        const otherUserId = req.params.id;

        await Message.deleteMany({
            $or: [
                { senderId: myId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: myId }
            ]
        });

        const receiverSocketId = getReceiverSocketId(otherUserId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("chatCleared", { clearedBy: myId });
        }

        res.status(200).json({ message: "Chat cleared successfully" });
    } catch (error) {
        console.log("Error clearing chat:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.id;
        const myId = req.user._id;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        if (message.senderId.toString() !== myId.toString()) {
            return res.status(403).json({ message: "You can only delete your own messages" });
        }

        await Message.findByIdAndDelete(messageId);

        const receiverSocketId = getReceiverSocketId(message.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageDeleted", { messageId });
        }

        res.status(200).json({ message: "Message deleted successfully", messageId });
    } catch (error) {
        console.log("Error deleting message:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteContact = async (req, res) => {
    try {
        const myId = req.user._id;
        const targetUserId = req.params.id;

        const user = await User.findById(myId);
        if (!user.deletedContacts.includes(targetUserId)) {
            user.deletedContacts.push(targetUserId);
            await user.save();
        }

        res.status(200).json({ message: "Contact deleted successfully." });
    } catch (error) {
        console.log("Error deleting contact:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const blockUser = async (req, res) => {
    try {
        const myId = req.user._id;
        const targetUserId = req.params.id;

        const user = await User.findById(myId);
        
        // toggle block
        if (user.blockedUsers.includes(targetUserId)) {
            user.blockedUsers = user.blockedUsers.filter(id => id.toString() !== targetUserId.toString());
            await user.save();

            // Notify the unblocked user in real-time
            const targetSocketId = getReceiverSocketId(targetUserId);
            if (targetSocketId) {
                io.to(targetSocketId).emit("blockStatusChanged", {
                    byUserId: myId,
                    byUserName: user.fullName,
                    isBlocked: false
                });
            }

            res.status(200).json({ message: "User unblocked successfully.", blocked: false });
        } else {
            user.blockedUsers.push(targetUserId);
            await user.save();

            // Notify the blocked user in real-time
            const targetSocketId = getReceiverSocketId(targetUserId);
            if (targetSocketId) {
                io.to(targetSocketId).emit("blockStatusChanged", {
                    byUserId: myId,
                    byUserName: user.fullName,
                    isBlocked: true
                });
            }

            res.status(200).json({ message: "User blocked successfully.", blocked: true });
        }
    } catch (error) {
        console.log("Error blocking user:", error);
        res.status(500).json({ message: "Server error" });
    }
};
import Message from "../models/Message.js"; 
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id; //req.user came from protectRoute
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password"); 

        res.status(200).json(filteredUsers);
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

        if (!text || !image){
            return res.status(400).json({ message: "Text or Image is required" })
        }

        if (senderId.equals(receiverId)) {
            return res.status(400).json({ message: "Cannot send message to yourself." })
        }

        const receiverExist = await User.exists({ _id: receiverId }); 
        if (!receiverExist) {
            return res.status(404).json({ message: "Reciever not found."})
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

        // todo: send message in real time if user is online using socket.io

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error sending message:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const getChatPartners = async (req, res) => {
    try {
        const MyId = req.user._id; 

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

        const chatPartners = await User.find({_id: {$in: chatPartnerIds}}).select("-password"); 
        res.status(200).json(chatPartners);

    } catch (error) {
        console.log("Error fetching chat partners:", error);
        res.status(500).json({ message: "Server error" });
    }
}
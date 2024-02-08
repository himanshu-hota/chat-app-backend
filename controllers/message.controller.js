import Conversation from '../models/Conversation.model.js';
import Message from '../models/Message.model.js';
import { getReceiverSocketId, io } from '../socket/socket.js';


export const sendMessage = async (req, res) => {

    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;

        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({ participants: [senderId, receiverId] });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        });


        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([newMessage.save(), conversation.save()]);

        // SOCKET IO 
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }
        return res.status(201).json(newMessage);


    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }



}


export const getMessages = async (req, res) => {

    try {
        const { message } = req.body;
        const { id: userToChat } = req.params;

        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChat] }
        }).populate("messages");


        if (!conversation) {
            return res.status(201).json([]);
        }


        return res.status(201).json(conversation.messages);


    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }



}



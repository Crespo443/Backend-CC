const admin = require('firebase-admin');
const db = admin.firestore()
const {nanoid} = require('nanoid'); 

const createChat = async (req, res) => {
  try {
    const chatId = req.body.chatId || nanoid(16);
    const { userId, title } = req.body;

    if (!userId || !title) {
      return res.status(400).json({ error: "Data tidak valid" });
    }

    const chatRef = await admin.firestore().collection('chats').add({
      chatId,
      userId,
      title,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    res.status(201).json({ chatId: chatRef.id });
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Gagal membuat chat" });
  }
};

const addMessageToChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { isHuman, content } = req.body;

    if (typeof isHuman !== "boolean" || !content) {
      return res.status(400).json({ error: "Invalid message data" });
    }

    const chatRef = db.collection("chats").doc(chatId);
    const chatDoc = await chatRef.get();

    if (!chatDoc.exists) {
      return res.status(404).json({ error: "Chat not found" });
    }
    const messageRef = chatRef.collection('messages').doc();
    const userMessage = {
      isHuman: true,
      content,
      timestamp: new Date().toISOString(),
    };
    await messageRef.set(userMessage);

    const aiMessage = {
      isHuman: false,
      content, 
      timestamp: new Date().toISOString(),
    };
    const aiMessageRef = chatRef.collection('messages').doc();
    await aiMessageRef.set(aiMessage);

    res.status(201).json({ message: "Message added to chat" });
  } catch (error) {
    console.error("Error adding message to chat:", error);
    res.status(500).json({ error: "Failed to add message to chat" });
  }
};
  
const getChatMessageById = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chatRef = db.collection("chats").doc(chatId);
    const chatDoc = await chatRef.get();

    if (!chatDoc.exists) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const messagesRef = chatRef.collection("messages");
    const messagesSnapshot = await messagesRef.orderBy("timestamp").get();

    const messages = messagesSnapshot.docs.map(doc => doc.data());

    res.status(200).json({ chatId, messages });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ error: "Failed to fetch chat messages" });
  }
};
module.exports = {
  createChat,
  addMessageToChat,
  getChatMessageById
}
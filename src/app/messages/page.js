"use client";

import {useState} from "react";

const [messages, setMessages] = useState([]);
const [newMsg, setNewMsg] = useState("");
const [loading, setLoading] = useState(false);

useEffect(() => {
  fetchMessages();
}, []);

const fetchMessages = async () => {
    try {
        const res = await fetch("/api/messages");
        const data = await res.json();
        setMessages(data);
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
};




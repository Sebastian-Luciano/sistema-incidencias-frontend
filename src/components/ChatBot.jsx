// // src/components/ChatBot.jsx
// import { useState, useRef, useEffect } from "react";
// import { FiSend, FiMessageCircle, FiX, FiSmile } from "react-icons/fi";
// import { motion, AnimatePresence } from "framer-motion";
// import { http } from "../services/httpClient";
// import EmojiPicker from "emoji-picker-react";

// export default function ChatBot() {
//     const [open, setOpen] = useState(false);
//     const [input, setInput] = useState("");
//     const [messages, setMessages] = useState([]);
//     const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//     const bottomRef = useRef(null);

//     useEffect(() => {
//         bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     const sendMessage = async (e) => {
//         e.preventDefault();
//         if (!input.trim()) return;

//         const userMsg = { from: "user", text: input };
//         setMessages((prev) => [...prev, userMsg]);
//         setInput("");

//         try {
//             const res = await http.post("/ia/chat", { mensaje: input });
//             setMessages((prev) => [...prev, { from: "bot", text: res.respuesta }]);
//         } catch (err) {
//             setMessages((prev) => [
//                 ...prev,
//                 { from: "bot", text: "⚠️ Error al conectar con el servidor" },
//             ]);
//         }
//     };

//     return (
//         <>
//             {/* Botón flotante */}
//             <button
//                 onClick={() => setOpen(!open)}
//                 className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
//             >
//                 {open ? <FiX size={24} /> : <FiMessageCircle size={24} />}
//             </button>

//             {/* Ventana de chat */}
//             {open && (
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: 20 }}
//                     transition={{ duration: 0.3 }}
//                     className="fixed bottom-20 right-4 w-80 h-[500px] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden"
//                 >
//                     {/* Encabezado */}
//                     <div className="bg-blue-600 text-white p-3 font-semibold">
//                         🤖 Asistente Virtual
//                     </div>

//                     {/* Lista de mensajes */}
//                     <div className="flex-1 p-3 space-y-2 overflow-y-auto">
//                         <AnimatePresence>
//                             {messages.map((msg, idx) => (
//                                 <motion.div
//                                     key={idx}
//                                     initial={{ opacity: 0, y: 10 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -10 }}
//                                     transition={{ duration: 0.2 }}
//                                     className={`p-2 rounded-lg text-sm ${msg.from === "user"
//                                             ? "bg-blue-100 self-end text-right"
//                                             : "bg-gray-100 self-start"
//                                         }`}
//                                 >
//                                     {msg.text}
//                                 </motion.div>
//                             ))}
//                         </AnimatePresence>
//                         <div ref={bottomRef} />
//                     </div>

//                     {/* Input con emoji */}
//                     <form onSubmit={sendMessage} className="flex border-t items-center relative">
//                         <button
//                             type="button"
//                             className="p-2 text-gray-600 hover:text-gray-800"
//                             onClick={() => setShowEmojiPicker((prev) => !prev)}
//                         >
//                             <FiSmile size={22} />
//                         </button>
//                         <input
//                             className="flex-1 p-2 outline-none"
//                             placeholder="Escribe tu mensaje..."
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                         />
//                         <button
//                             type="submit"
//                             className="p-2 bg-blue-600 text-white hover:bg-blue-700"
//                         >
//                             <FiSend />
//                         </button>

//                         {/* Selector de emojis */}
//                         {showEmojiPicker && (
//                             <div className="absolute bottom-12 left-0 z-50">
//                                 <EmojiPicker
//                                     height={300}
//                                     width={300}
//                                     searchDisabled={false}
//                                     previewConfig={{ showPreview: false }}
//                                     onEmojiClick={(emojiData) => {
//                                         setInput((prev) => prev + emojiData.emoji);
//                                         setShowEmojiPicker(false);
//                                     }}
//                                 />
//                             </div>
//                         )}
//                     </form>
//                 </motion.div>
//             )}
//         </>
//     );
// }


// src/components/ChatBot.jsx
import { useState, useRef, useEffect } from "react";
import { FiSend, FiMessageCircle, FiX, FiSmile } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { http } from "../services/httpClient";
import SimpleEmojiPicker from "./SimpleEmojiPicker"

export default function ChatBot() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { from: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        try {
            const res = await http.post("/ia/chat", { mensaje: input });
            setMessages((prev) => [...prev, { from: "bot", text: res.respuesta }]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { from: "bot", text: "⚠️ Error al conectar con el servidor" },
            ]);
        }
    };

    return (
        <>
            {/* Botón flotante */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
            >
                {open ? <FiX size={24} /> : <FiMessageCircle size={24} />}
            </button>

            {/* Ventana de chat */}
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-20 right-4 w-80 h-[500px] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden"
                >
                    {/* Encabezado */}
                    <div className="bg-blue-600 text-white p-3 font-semibold">
                        🤖 Asistente Virtual
                    </div>

                    {/* Lista de mensajes */}
                    <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                        <AnimatePresence>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className={`p-2 rounded-lg text-sm ${msg.from === "user"
                                        ? "bg-blue-100 self-end text-right"
                                        : "bg-gray-100 self-start"
                                        }`}
                                >
                                    {msg.text}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={bottomRef} />
                    </div>

                    {/* Input con emoji */}
                    <form onSubmit={sendMessage} className="flex border-t items-center relative">
                        <button
                            type="button"
                            className="p-2 text-gray-600 hover:text-gray-800"
                            onClick={() => setShowEmojiPicker((prev) => !prev)}
                        >
                            <FiSmile size={22} />
                        </button>
                        <input
                            className="flex-1 p-2 outline-none"
                            placeholder="Escribe tu mensaje..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="p-2 bg-blue-600 text-white hover:bg-blue-700"
                        >
                            <FiSend />
                        </button>

                        {/* Selector de emojis */}
                        {showEmojiPicker && (
                            <div className="absolute bottom-12 left-0 z-50">
                                <SimpleEmojiPicker
                                    onEmojiClick={(emoji) => {
                                        setInput((prev) => prev + emoji);
                                        setShowEmojiPicker(false);
                                    }}
                                />
                            </div>
                        )}
                    </form>
                </motion.div>
            )}
        </>
    );
}

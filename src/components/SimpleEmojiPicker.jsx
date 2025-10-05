// src/components/SimpleEmojiPicker.jsx
import { useState } from "react";

const emojiCategories = {
    caras: ["😀", "😊", "😂", "🤣", "😅", "😆", "😉", "😍", "🥰", "😘", "😗", "😙", "😚", "🙂", "🤗", "🤩", "🤔", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "🥱", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "😲", "😞", "😖", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "🥵", "🥶", "😳", "🤪", "😵", "🥴", "😠", "😡", "🤬"],
    gestos: ["👋", "🤚", "🖐", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏"],
    objetos: ["💼", "📁", "📂", "🗂", "📅", "📆", "🗓", "📇", "📈", "📉", "📊", "📋", "📌", "📍", "📎", "🖇", "📏", "📐", "✂️", "🗃", "🗄", "🗑"],
    simbolos: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "✨", "⭐", "🌟", "💫", "✅", "❌", "⚠️", "🚫", "💯", "🔥", "💡", "🔔", "🔕"],
    trabajo: ["💻", "⌨️", "🖥", "🖨", "🖱", "🗂", "📊", "📈", "📉", "🔧", "🔨", "⚙️", "🛠", "⚡", "🔌", "💾", "💿", "📱", "📞", "☎️"],
    otros: ["🎉", "🎊", "🎈", "🎁", "🏆", "🥇", "🥈", "🥉", "⚽", "🏀", "🎯", "🎮", "🎲", "🎭", "🎨", "🎬", "🎤", "🎧", "🎵", "🎶", "📚", "📖", "📝", "✏️", "🖊", "🖍", "📕", "📗", "📘", "📙", "🔖", "🚀", "🌈", "☀️", "⛅", "☁️", "🌙"]
};

export default function SimpleEmojiPicker({ onEmojiClick }) {
    const [activeCategory, setActiveCategory] = useState("caras");

    return (
        <div className="bg-white border rounded-lg shadow-lg w-72">
            <div className="flex border-b overflow-x-auto">
                {Object.keys(emojiCategories).map((cat) => (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-2 text-sm capitalize whitespace-nowrap ${
                            activeCategory === cat
                                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                                : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="p-3 grid grid-cols-8 gap-1 max-h-64 overflow-y-auto">
                {emojiCategories[activeCategory].map((emoji, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => onEmojiClick(emoji)}
                        className="text-2xl hover:bg-gray-100 rounded p-1 transition"
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    );
}
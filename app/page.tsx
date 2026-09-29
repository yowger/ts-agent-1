"use client"

import { useState } from "react"

export default function Page() {
    const [message, setMessage] = useState("")

    async function sendMessage() {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message,
            }),
        })

        const data = await response.json()

        console.log(data)
    }

    return (
        <div className="flex gap-2">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask something..."
                className="border rounded-2xl p-4"
            />

            <button onClick={sendMessage} className="border rounded-2xl p-4">
                Send message
            </button>
        </div>
    )
}

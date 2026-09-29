"use client"

export default function Page() {
    async function sendMessage() {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Hello agent!",
            }),
        })

        const data = await response.json()

        console.log(data)
    }

    return (
        <div>
            <button onClick={sendMessage} className="border rounded-2xl p-4">Send message</button>
        </div>
    )
}

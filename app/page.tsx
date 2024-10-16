"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function Home() {
	const [chat, setChat] = useState<{ Name: string; Text: string }[]>([]);
	const [text, setText] = useState("");

	const handleSubmit = async (form: FormEvent) => {
		form.preventDefault();

		const clone: { Name: string; Text: string }[] = Array.from(chat);
		clone.push({ Name: "User", Text: text });

		const response = await fetch(`/api/gemini?userInput=${text}`, {
			method: "GET",
			cache: "no-cache",
		});

		const json = await response.json();
		clone.push({ Name: "Bot", Text: json });

		setChat(clone);
	};

	return (
		<div>
			<div
				style={{
					height: "500px",
					overflow: "scroll",
					overflowX: "hidden",
					overflowY: "scroll",
				}}
			>
				{chat.map((message) => (
					// eslint-disable-next-line react/jsx-key
					<div>
						<h2>{message.Name}</h2>
						<p>{message.Text}</p>
					</div>
				))}
			</div>

			<form onSubmit={handleSubmit}>
				<input
					type="text"
					id="chat"
					name="chat"
					onChange={(e) => setText(e.target.value)}
				/>
				<input type="submit" value="Submit" />
			</form>
			<Link href="/adminPage">Admin</Link>
		</div>
	);
}

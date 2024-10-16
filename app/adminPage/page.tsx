"use client";
import Link from "next/link";
import "../styles.css";
import { useEffect, useState } from "react";

export default function Home() {
	const [questions, setQuestions] = useState<[]>([]);
	const [newQuestion, setNewQuestions] = useState("");
	const [newAnswer, setNewAnswer] = useState("");

	async function fetchData() {
		const response = await fetch(`/api/update`, {
			method: "GET",
			cache: "no-cache",
		});
		setQuestions(await response.json());
	}

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div>
			<table>
				<caption>Admin Page</caption>

				<tbody
					style={{
						width: "100%",
						overflow: "scroll",
						overflowX: "hidden",
						overflowY: "scroll",
					}}
				>
					<tr>
						<th>Question</th>
						<th>Answer</th>
						<th>Delete</th>
					</tr>

					{questions.map((message, index) => (
						// eslint-disable-next-line react/jsx-key
						<tr>
							<td>{message[0]}</td>
							<td>{message[1]}</td>
							<td>
								<button
									onClick={async () => {
										await fetch(`/api/update?id=${index}`, {
											method: "DELETE",
											cache: "no-cache",
										});
										fetchData();
									}}
								>
									delete
								</button>
							</td>
						</tr>
					))}

					<tr>
						<td>
							<input
								type="text"
								id="question"
								name="question"
								placeholder="Enter New Question"
								width="100%"
								onChange={(e) => setNewQuestions(e.target.value)}
							/>
						</td>
						<td>
							<input
								type="text"
								id="answer"
								name="answer"
								placeholder="Enter New Answer"
								width="100%"
								onChange={(e) => setNewAnswer(e.target.value)}
							/>
						</td>
						<td>
							<button
								onClick={async () => {
									await fetch(
										`/api/update?question=${newQuestion}&answer=${newAnswer}`,
										{
											method: "POST",
											cache: "no-cache",
										}
									);
									fetchData();
								}}
							>
								Add
							</button>
						</td>
					</tr>
				</tbody>
			</table>
			<Link href="/">Chatbot</Link>
		</div>
	);
}

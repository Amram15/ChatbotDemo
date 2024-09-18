import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import { parse } from "csv-parse";

const ErrorText =
	"Hey, Im just a dog! So I don't know that answer to that question. You can reach us at info@angelsrescue.org or if you need assistance from a human.";

export async function GET(request: NextRequest) {
	const search: URLSearchParams = await request.nextUrl.searchParams;
	const UserInput = search.get("userInput");

	const apiKey = process.env.GEMINI;
	const genAI = new GoogleGenerativeAI(apiKey ? apiKey : "");

	const parts = [
		{
			text: "You will be asked a question. Output the number corresponding to the closes string. Only output numbers.",
		},
	];
	const reference: unknown[] = [];

	function getCSV() {
		return new Promise((resolve) => {
			let i = 0;
			fs.createReadStream("./Data/questions.csv")
				.pipe(parse({ delimiter: ",", from_line: 2 }))
				.on("data", function (row) {
					i++;
					parts.push({ text: "input: " + row[0] });
					parts.push({ text: "output: " + i });
					reference.push(row[1]);
				})
				.on("end", function () {
					//Error
					parts.push({ text: "input: Anything else" });
					parts.push({ text: "output: -1" });

					//User input
					parts.push({ text: "input: " + UserInput });
					parts.push({ text: "output: " });

					resolve(true);
				});
		});
	}
	await getCSV();

	const model = genAI.getGenerativeModel({
		model: "gemini-1.5-flash",
	});

	const generationConfig = {
		temperature: 1,
		topP: 0.95,
		topK: 64,
		maxOutputTokens: 8192,
		responseMimeType: "text/plain",
	};

	async function run() {
		const result = await model.generateContent({
			contents: [{ role: "user", parts }],
			generationConfig,
		});
		return result.response.text();
	}

	const data = await run();

	console.log(data);
	let num = Number(data);
	num = num >= 0 ? num : NaN;
	const response = num ? reference[num - 1] : ErrorText;
	return NextResponse.json(response);
}

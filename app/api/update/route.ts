import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { parse } from "csv-parse";
import { stringify } from "csv-stringify";

export async function GET() {
	const questions: [string[]?] = [];

	function getCSV() {
		return new Promise((resolve) => {
			fs.createReadStream("./Data/questions.csv")
				.pipe(parse({ delimiter: ",", from_line: 2 }))
				.on("data", function (row) {
					questions.push(row);
				})
				.on("end", function () {
					resolve(true);
				});
		});
	}
	await getCSV();
	return NextResponse.json(questions);
}

export async function DELETE(request: NextRequest) {
	const search: URLSearchParams = await request.nextUrl.searchParams;
	const deleteID = Number(search.get("id"));
	const questions: [string[]?] = [];
	const columns = ["Questions", "Answers"];
	const stringifier = stringify({ header: true, columns: columns });

	function setCSV() {
		return new Promise((resolve) => {
			let i = 0;
			fs.createReadStream("./Data/questions.csv")
				.pipe(parse({ delimiter: ",", from_line: 2 }))
				.on("data", function (row) {
					if (deleteID != i) {
						stringifier.write(row);
						questions.push(row);
					}
					i++;
				})
				.on("end", function () {
					const writableStream = fs.createWriteStream("./Data/questions.csv");
					stringifier.pipe(writableStream);
					resolve(true);
				});
		});
	}

	await setCSV();
	return NextResponse.json(questions);
}

export async function POST(request: NextRequest) {
	const search: URLSearchParams = await request.nextUrl.searchParams;
	const question = String(search.get("question"));
	const answer = String(search.get("answer"));

	const questions: [string[]?] = [];
	const columns = ["Questions", "Answers"];
	const stringifier = stringify({ header: true, columns: columns });

	function setCSV() {
		return new Promise((resolve) => {
			fs.createReadStream("./Data/questions.csv")
				.pipe(parse({ delimiter: ",", from_line: 2 }))
				.on("data", function (row) {
					stringifier.write(row);
					questions.push(row);
				})
				.on("end", function () {
					const newQuestion = [question, answer];
					stringifier.write(newQuestion);
					questions.push(newQuestion);

					const writableStream = fs.createWriteStream("./Data/questions.csv");
					stringifier.pipe(writableStream);
					resolve(true);
				});
		});
	}

	await setCSV();
	return NextResponse.json(questions);
}

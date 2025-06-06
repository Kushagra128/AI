import React from "react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { getRandomInterviewCover } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import DisplayTechIcons from "./DisplayTechIcons";
import {
	getFeedbackByInterviewId,
	getInterviewById,
} from "@/lib/actions/general.action";

interface InterviewCardProps {
	id: string;
	userId?: string;
	role: string;
	type: string;
	techstack: string[];
	createdAt: Date;
}

const InterviewCard = async ({
	id,
	userId,
	role,
	type,
	techstack = [], // Default to empty array
	createdAt,
}: InterviewCardProps) => {
	// Get both feedback and interview data
	const [feedback, interview] = await Promise.all([
		userId && id ? getFeedbackByInterviewId({ interviewId: id, userId }) : null,
		id ? getInterviewById(id) : null,
	]);

	const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

	// Format the date correctly - use interview creation date if available, otherwise use createdAt prop
	const formattedDate = dayjs(
		interview?.createdAt || createdAt || Date.now()
	).format("MMM D, YYYY");

	// Check if interview is completed (either by feedback or status)
	const isCompleted = interview?.status === "completed" && feedback;

	// Get the score if available
	const score = feedback?.totalScore || (isCompleted ? "---" : null);

	return (
		<div className="card-border w-[360px] max-sm:w-full min-h-96">
			<div className="card-interview">
				<div className="relative">
					<div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
						<p className="badge-text">{normalizedType}</p>
					</div>
					<Image
						src={getRandomInterviewCover()}
						alt={`${role} interview cover`}
						width={90}
						height={90}
						className="rounded-full object-cover size-[90px]"
					/>
					<h3 className="mt-5 capitalize text-primary-200">{role} Interview</h3>
					<div className="flex flex-row gap-5 mt-3">
						<div className="flex flex-row gap-2 items-center">
							<Image
								src="/calendar.svg"
								alt="Calendar"
								width={22}
								height={22}
							/>
							<p>{formattedDate}</p>
						</div>
						{score !== null && (
							<div className="flex flex-row gap-2 items-center">
								<Image src="/star.svg" alt="Rating" width={22} height={22} />
								<p>{score}/100</p>
							</div>
						)}
					</div>
					<p className="line-clamp-2 mt-5 text-light-100">
						{isCompleted
							? feedback?.finalAssessment ||
							  "Interview completed. Check your feedback."
							: "You haven't taken this interview yet. Take it now to improve your skills."}
					</p>
				</div>
				<div className="flex flex-row justify-between items-center">
					<DisplayTechIcons techStack={techstack} />
					<Button className="btn-primary">
						<Link
							href={
								isCompleted ? `/interview/${id}/feedback` : `/interview/${id}`
							}
						>
							{isCompleted ? "Check Feedback" : "View Interview"}
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default InterviewCard;

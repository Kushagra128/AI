import Image from "next/image";
import { cn, getTechLogos } from "@/lib/utils";

interface TechIcon {
	tech: string;
	url: string;
}

interface TechIconProps {
	techStack: string[];
}

const DisplayTechIcons = async ({ techStack }: TechIconProps) => {
	let techIcons: TechIcon[] = [];
	try {
		techIcons = (await getTechLogos(techStack)) || [];
	} catch (error) {
		console.error("Failed to fetch tech logos:", error);
	}

	// Ensure techIcons is an array before rendering
	if (!Array.isArray(techIcons)) {
		console.error("techIcons is not an array:", techIcons);
		techIcons = [];
	}

	return (
		<div className="flex flex-row items-center">
			{techIcons.length > 0 ? (
				techIcons.slice(0, 3).map(({ tech, url }, index) => (
					<div
						key={tech}
						className={cn(
							"relative group bg-dark-300 rounded-full p-2 flex-center",
							index >= 1 && "-ml-2"
						)}
					>
						<span className="tech-tooltip">{tech}</span>
						<Image
							src={url}
							alt={`${tech} logo`}
							width={20}
							height={20}
							className="size-5 object-contain"
						/>
					</div>
				))
			) : (
				<span className="text-light-400 text-sm">No tech icons available</span>
			)}
		</div>
	);
};

export default DisplayTechIcons;

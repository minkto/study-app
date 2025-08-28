import { createResourcesAndChapters } from "@/services/resourceService";
import { Chapter, Resource } from "@/shared.types";
import { isStringEmpty } from "@/utils/stringUtils";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { userId } = await auth();

        if (isStringEmpty(userId)) {
            return new Response("Unauthorized", { status: 401 });
        }

        const res = await request.json();

        const resource: Resource =
        {
            name: res["resource"],
            userId: res["userId"],
        }

        const chapters: Chapter[] = res["chapters"];

        const result = await createResourcesAndChapters(resource, chapters);

        if (!result) {
            return NextResponse.json({ message: "An issue has occured with creating the resources and chapters." },
                { status: 500 });
        }

        return NextResponse.json({success: result}, { status: 200 });

    } catch (error) {
        console.log("An issue has occured with creating the resources and chapters.", error);
        return NextResponse.json({ message: "An issue has occured with creating the resources and chapters." },
            { status: 500 });
    }
}
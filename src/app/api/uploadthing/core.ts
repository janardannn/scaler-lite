import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();


export const ourFileRouter = {

    courseBanner: f({ image: { maxFileSize: "4MB" } })
        // check user auth 
        .middleware(async ({ req }) => {
            const session = await getServerSession(authOptions);
            if (!session || session.user.role !== "INSTRUCTOR") {
                throw new Error("Unauthorized");
            }

            return { userId: session.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log(file)
        }),

    lectureAttachment: f({ "application/pdf": { maxFileSize: "4MB" } })
        .middleware(async ({ req }) => {
            const session = await getServerSession(authOptions);
            if (!session || session.user.role !== "INSTRUCTOR") throw new Error("Unauthorized");
            return { userId: session.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log(file);
        }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
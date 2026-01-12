import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { Context } from "../../core"
import { Readable } from "stream"
import { createReadStream } from "fs"
import { extname } from "path"

const mimeTypes: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".pdf": "application/pdf",
    ".txt": "text/plain",
    ".json": "application/json",
    ".mp4": "video/mp4",
    ".mp3": "audio/mpeg"
};

export default new NativeFunction({
    name: "$sendFile",
    version: "2.0.0",
    description: "Sends a file to the response.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "File Path",
            description: "The file path to send.",
            type: ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "Status Code",
            description: "The status code of the response.",
            type: ArgType.Number,
            required: false,
            rest: false
        }
    ],
    async execute(ctx, [filePath, statusCode]) {
        const { ctx: c, resolve } = ctx.runtime.extras as { ctx: Context, resolve: (data: any) => void }
        
        const ext = extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || "application/octet-stream";

        const file = createReadStream(filePath)
        const stream = Readable.toWeb(file) as ReadableStream

        c.header("Content-Type", contentType);
        resolve(c.body(stream, (statusCode || 200) as any))

        return this.success()
    }
})

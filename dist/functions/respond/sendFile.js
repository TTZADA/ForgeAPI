"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const stream_1 = require("stream");
const fs_1 = require("fs");
const path_1 = require("path");

const mimeTypes = {
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

exports.default = new forgescript_1.NativeFunction({
    name: "$sendFile",
    version: "2.0.0",
    description: "Sends a file to the response with correct Content-Type.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "File Path",
            description: "The file path to send.",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "Status Code",
            description: "The status code of the response.",
            type: forgescript_1.ArgType.Number,
            required: false,
            rest: false
        }
    ],
    async execute(ctx, [filePath, statusCode]) {
        const extras = ctx.runtime.extras;
        const c = extras.ctx;
        const resolve = extras.resolve;

        const ext = (0, path_1.extname)(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || "application/octet-stream";

        const file = (0, fs_1.createReadStream)(filePath);
        const stream = stream_1.Readable.toWeb(file);

        c.header("Content-Type", contentType);
        resolve(c.body(stream, (statusCode || 200)));

        return this.success();
    }
});
//# sourceMappingURL=sendFile.js.map

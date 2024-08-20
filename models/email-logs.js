const { Schema, model } = require("mongoose");

const eMailLogsSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        from: {
            type: [String],
            required: true,
        },
        to: {
            type: [String],
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        messageId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = model("emailLogs", eMailLogsSchema);


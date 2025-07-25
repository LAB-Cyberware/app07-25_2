import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "El email es requerido."],
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: [true, "El nombre es requerido."],
        trim: true,
    },
    rol: {
        type: String,
        default: "user",
        enum: ["user", "admin", "premium"],
        trim: true,
    }
}, {
    timestamps: true,
})

export default models.User || model(`User`, userSchema)
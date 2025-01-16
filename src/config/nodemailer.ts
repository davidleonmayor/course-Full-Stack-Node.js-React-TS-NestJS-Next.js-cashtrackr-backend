import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const config = () => ({
  host: process.env.NODEMAILER_HOST,
  port: +process.env.NODEMAILER_PORT,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

export const transporter = nodemailer.createTransport(config());

import { app } from "electron";

export const is = {
  dev: process.env.NODE_ENV === "development" || !app.isPackaged,
  prod: process.env.NODE_ENV === "production" || app.isPackaged,
};

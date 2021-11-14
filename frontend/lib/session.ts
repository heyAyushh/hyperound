
// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import type { IronSessionOptions } from "iron-session";

export interface User {
  username: string;
  isCreator?: boolean;
  avatar?: string;
  isLoggedin: boolean;
}

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string || "secret____________________________________________________",
  cookieName: "iron-session/examples/next.js",
};

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  export interface IronSessionData {
    user?: User;
    token?: string;
  }
}
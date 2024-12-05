import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: {
      login?: string;
    } & DefaultSession["user"];
  }
}

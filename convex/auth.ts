import { convexAuth } from "@convex-dev/auth/server";
import CustomPasswordProvider from "./passwordProvider";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [CustomPasswordProvider],
});

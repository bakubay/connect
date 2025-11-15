import { Password } from "@convex-dev/auth/providers/Password";
import { DataModel } from "./_generated/dataModel";

export default Password<DataModel>({
  profile(params, ctx) {
    return {
      email: params.email as string,
      name: params.name as string | undefined,
      role: (params.role as "company" | "creator") || "creator",
    };
  },
});


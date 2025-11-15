import { Password } from "@convex-dev/auth/providers/Password";
import type { DataModel } from "./_generated/dataModel";

export default Password<DataModel>({
  profile(params) {
    return {
      email: params.email as string,
      name: params.name as string | undefined,
      role: (params.role as "company" | "creator") || "creator",
    };
  },
});


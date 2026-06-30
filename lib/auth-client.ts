import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  phoneNumberClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: {
        firstName: { type: "string", required: false, input: true },
        lastName: { type: "string", required: false, input: true },
        displayPhoto: { type: "string", required: false, input: true },
        bio: { type: "string", required: false, input: true },
        eventId: { type: "string", required: false, input: false },
      },
    }),
    phoneNumberClient(),
  ],
});

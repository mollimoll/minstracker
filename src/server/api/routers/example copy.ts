import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const pelotonRouter = createTRPCRouter({
  getChallenges: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const res = await fetch(
        `https://api.onepeloton.com/api/user/${userId}/challenges/current`,
        {
          headers: {
            ContentType: "application/json",
            Cookie: "peloton_session_id=" + input.sessionId,
            pelotonPlatform: "web",
          },
        }
      );
      const json = await res.json();
      console.log("json", json);
      return json;
    }),
});

import { Static, Type } from "@sinclair/typebox";

export const TournamentResponse = Type.Object({
	x: Type.String(),
	y: Type.Number(),
	z: Type.Boolean(),
})

export type TournamentResponseType = Static<typeof TournamentResponse>

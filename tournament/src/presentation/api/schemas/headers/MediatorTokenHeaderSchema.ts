import { Static, StringOptions, Type } from "@sinclair/typebox"


export type MediatorTokenHeaderSchema = Static<ReturnType<typeof MediatorTokenHeaderSchema>>
export function MediatorTokenHeaderSchema(options?: StringOptions) {
	return Type.Object({
		"X-Mediator-Token": Type.String({ description: "調停者（スーパーユーザ）であることを示すトークン。", ...options })
	});
}

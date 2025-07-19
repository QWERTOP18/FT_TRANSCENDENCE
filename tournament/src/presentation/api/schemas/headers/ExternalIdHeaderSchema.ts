import { Static, StringOptions, Type } from "@sinclair/typebox"


export type ExternalIdHeaderSchema = Static<ReturnType<typeof ExternalIdHeaderSchema>>
export function ExternalIdHeaderSchema(options?: StringOptions) {
	return Type.Object({
		"X-External-Id": Type.String({ description: "外部ID", ...options })
	});
}


# Authorization

認可のもととなるライブラリです。
設定した、ルール・ユーザー情報をもとに、ユーザーインスタンスを作成し、
そのインスタンスが、データに対してアクションを実行できるかを判定します。
中身を自由に設定でき柔軟性があります。
シンプルで理解しやすいです。

# 機能
 * 補完が効きます。


# 使用例

## Implicit Type
```ts

(() => {
	const rules = {
		edit: (user: {id: number}, resource: {ownerId: number}) => user.id === resource.ownerId,
		delete: (user: {id: number}, resource: {ownerId: number}) => user.id === resource.ownerId,
		publish: (user: {role: string}, resource: {ownerId: number}) => user.role === "admin"
	};

	const authorizer = new Authorizer(rules);
	const authUser = authorizer.createPolicyUser({ id: 1, role: "admin" });

	// 補完される ✅
	authUser.can("edit", { ownerId: 1 });     // ✅ OK
	authUser.can("publish", { ownerId: 2 });  // ✅ OK
	// authUser.can("archive", { ownerId: 1 }); // ❌ コンパイルエラー: "archive" は存在しない

})();

```

## Explicit Type
```ts
(() => {
	type AppUser = {
		id: number,
		role: string,
	};

	type AppData = {
		ownerId: number
	};

	const ruleEdit: Rule<AppUser, AppData> = (user: AppUser, resource: AppData) => user.id === resource.ownerId;
	const ruleDelete: Rule<AppUser, AppData> = (user: AppUser, resource: AppData) => user.id === resource.ownerId;
	const rulePublish: Rule<AppUser, AppData> = (user: AppUser, resource: AppData) => user.role === "admin";
	const rules: RuleSet<AppUser, AppData> = {
		edit: ruleEdit,
		delete: ruleDelete,
		publish: rulePublish,
	};

	const appUser: AppUser = { id: 1, role: "admin" };
	const authorizer: Authorizer<RuleSet<AppUser, AppData>> = new Authorizer(rules);
	const authUser: AuthUser<RuleSet<AppUser, AppData>> = authorizer.createPolicyUser(appUser);

	// 補完される ✅
	const appData1: AppData = { ownerId: 1 };
	const appData2: AppData = { ownerId: 2 };
	const canEdit: boolean = authUser.can("edit", appData1);     // ✅ OK
	const canPublish: boolean = authUser.can("publish", appData2);  // ✅ OK
	// authUser.can("archive", { ownerId: 1 }); // ❌ コンパイルエラー: "archive" は存在しない

})();

```

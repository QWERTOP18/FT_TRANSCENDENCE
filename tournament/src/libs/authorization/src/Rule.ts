

export type Rule<User, Resource> = (user: User, resource: Resource) => boolean;

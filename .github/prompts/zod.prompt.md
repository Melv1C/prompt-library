Zod Schema is used to parse data for Form, API Endpoint and other stuff. You must always follow the rules.

## Naming rules

All Schema must start with uppercase and be suffixed by `Schema` :

* UserSchema
* CreateUserSchema
* UpdateUserSchema

## Extract types

All Zod Schema must have a type associated with it. This type must be named with the same name as the schema but without the `Schema` suffix and with `Type` suffix:

* UserType
* CreateUserType
* UpdateUserType

```ts
export type UpdateUserType = z.infer<
  typeof UpdateUserSchema
>;
```
import { usernameSchema, type Username } from "./username-schema";

const username = usernameSchema.parse("  Ada.Lovelace  ");

const openProfile = (handle: Username) => {
  console.log(`/users/${handle}`);
};

openProfile(username);
// Output: /users/ada.lovelace

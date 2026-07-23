import { stripIndent } from "./stripIndent";

const query = stripIndent(`
  SELECT *
    FROM users
  WHERE active = true
`);

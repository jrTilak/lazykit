import { z } from "zod";

import {
  displayNameSchema,
  type DisplayName,
} from "../../registry/zod-schemas/display-name-schema";
import {
  emailSchema,
  type Email,
} from "../../registry/zod-schemas/email-schema";
import {
  loginIdentifierSchema,
  type LoginIdentifier,
} from "../../registry/zod-schemas/login-identifier-schema";
import { optionalFormField } from "../../registry/zod-schemas/optional-form-field";
import {
  createPasswordConfirmationSchema,
  passwordConfirmationSchema,
  type PasswordConfirmation,
} from "../../registry/zod-schemas/password-confirmation-schema";
import {
  createPasswordSchema,
  passwordSchema,
  type Password,
  type ValidatedPassword,
} from "../../registry/zod-schemas/password-schema";
import {
  slugSchema,
  type Slug,
} from "../../registry/zod-schemas/slug-schema";
import {
  strongPasswordSchema,
  type StrongPassword,
} from "../../registry/zod-schemas/strong-password-schema";
import {
  usernameSchema,
  type Username,
} from "../../registry/zod-schemas/username-schema";

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <Value>() =>
    Value extends Right ? 1 : 2
    ? true
    : false;
type IsAssignable<Source, Target> = [Source] extends [Target] ? true : false;
type Expect<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;

type EmailInputIsString = Expect<
  Equal<z.input<typeof emailSchema>, string>
>;
type EmailOutputIsExportedType = Expect<
  Equal<z.output<typeof emailSchema>, Email>
>;
type EmailIsAString = Expect<IsAssignable<Email, string>>;
type StringIsNotEmail = ExpectFalse<IsAssignable<string, Email>>;

type UsernameInputIsString = Expect<
  Equal<z.input<typeof usernameSchema>, string>
>;
type UsernameOutputIsExportedType = Expect<
  Equal<z.output<typeof usernameSchema>, Username>
>;
type UsernameIsAString = Expect<IsAssignable<Username, string>>;
type StringIsNotUsername = ExpectFalse<IsAssignable<string, Username>>;
type EmailIsNotUsername = ExpectFalse<IsAssignable<Email, Username>>;
type UsernameIsNotEmail = ExpectFalse<IsAssignable<Username, Email>>;

type LoginIdentifierInputIsString = Expect<
  Equal<z.input<typeof loginIdentifierSchema>, string>
>;
type LoginIdentifierOutputIsExportedType = Expect<
  Equal<z.output<typeof loginIdentifierSchema>, LoginIdentifier>
>;
type LoginIdentifierIsEmailOrUsername = Expect<
  Equal<LoginIdentifier, Email | Username>
>;
type EmailIsLoginIdentifier = Expect<IsAssignable<Email, LoginIdentifier>>;
type UsernameIsLoginIdentifier = Expect<
  IsAssignable<Username, LoginIdentifier>
>;
type StringIsNotLoginIdentifier = ExpectFalse<
  IsAssignable<string, LoginIdentifier>
>;

type PasswordInputIsString = Expect<
  Equal<z.input<typeof passwordSchema>, string>
>;
type PasswordOutputIsExportedType = Expect<
  Equal<z.output<typeof passwordSchema>, Password>
>;
type StringIsNotPassword = ExpectFalse<IsAssignable<string, Password>>;
type PasswordIsValidatedPassword = Expect<
  IsAssignable<Password, ValidatedPassword>
>;

const customPasswordSchema = createPasswordSchema({
  minLength: 1,
  maxLength: 1,
});
type CustomPassword = z.output<typeof customPasswordSchema>;
type CustomPasswordIsValidated = Expect<
  IsAssignable<CustomPassword, ValidatedPassword>
>;
type CustomPasswordIsNotDefaultPassword = ExpectFalse<
  IsAssignable<CustomPassword, Password>
>;

type StrongPasswordInputIsString = Expect<
  Equal<z.input<typeof strongPasswordSchema>, string>
>;
type StrongPasswordOutputIsExportedType = Expect<
  Equal<z.output<typeof strongPasswordSchema>, StrongPassword>
>;
type StrongPasswordIsPassword = Expect<
  IsAssignable<StrongPassword, Password>
>;
type StrongPasswordIsValidated = Expect<
  IsAssignable<StrongPassword, ValidatedPassword>
>;
type PasswordIsNotStrongPassword = ExpectFalse<
  IsAssignable<Password, StrongPassword>
>;

type PasswordConfirmationInput = z.input<
  typeof passwordConfirmationSchema
>;
type PasswordConfirmationOutput = z.output<
  typeof passwordConfirmationSchema
>;
type PasswordConfirmationInputIsPlainStrings = Expect<
  Equal<
    PasswordConfirmationInput,
    {
      password: string;
      confirmPassword: string;
    }
  >
>;
type PasswordConfirmationOutputIsExportedType = Expect<
  Equal<PasswordConfirmationOutput, PasswordConfirmation>
>;
type PasswordConfirmationPasswordIsBranded = Expect<
  Equal<PasswordConfirmationOutput["password"], Password>
>;
type PasswordConfirmationMatchIsBranded = Expect<
  Equal<PasswordConfirmationOutput["confirmPassword"], Password>
>;

const flexiblePasswordSchema = z
  .union([z.string(), z.number()])
  .transform((value) => String(value))
  .brand<"FlexiblePassword">();
const flexibleConfirmationSchema =
  createPasswordConfirmationSchema(flexiblePasswordSchema);

type FlexiblePassword = z.output<typeof flexiblePasswordSchema>;
type FlexibleConfirmationInput = z.input<
  typeof flexibleConfirmationSchema
>;
type FlexibleConfirmationOutput = z.output<
  typeof flexibleConfirmationSchema
>;
type GenericConfirmationPreservesInput = Expect<
  Equal<
    FlexibleConfirmationInput,
    {
      password: string | number;
      confirmPassword: string | number;
    }
  >
>;
type GenericConfirmationPreservesPasswordOutput = Expect<
  Equal<FlexibleConfirmationOutput["password"], FlexiblePassword>
>;
type GenericConfirmationPreservesMatchOutput = Expect<
  Equal<FlexibleConfirmationOutput["confirmPassword"], FlexiblePassword>
>;

createPasswordConfirmationSchema(z.string());
// @ts-expect-error The supplied schema must produce a string.
createPasswordConfirmationSchema(z.string().transform((value) => value.length));

type DisplayNameInputIsString = Expect<
  Equal<z.input<typeof displayNameSchema>, string>
>;
type DisplayNameOutputIsExportedType = Expect<
  Equal<z.output<typeof displayNameSchema>, DisplayName>
>;
type StringIsNotDisplayName = ExpectFalse<IsAssignable<string, DisplayName>>;
type DisplayNameIsNotUsername = ExpectFalse<
  IsAssignable<DisplayName, Username>
>;

type SlugInputIsString = Expect<Equal<z.input<typeof slugSchema>, string>>;
type SlugOutputIsExportedType = Expect<
  Equal<z.output<typeof slugSchema>, Slug>
>;
type StringIsNotSlug = ExpectFalse<IsAssignable<string, Slug>>;
type SlugIsNotUsername = ExpectFalse<IsAssignable<Slug, Username>>;

const optionalNumberField = optionalFormField(z.number().int());
type OptionalNumberInput = Expect<
  Equal<z.input<typeof optionalNumberField>, number | "" | undefined>
>;
type OptionalNumberOutput = Expect<
  Equal<z.output<typeof optionalNumberField>, number | undefined>
>;

const optionalTransformedField = optionalFormField(
  z.string().transform((value) => value.length),
);
type OptionalTransformInput = Expect<
  Equal<z.input<typeof optionalTransformedField>, string | undefined>
>;
type OptionalTransformOutput = Expect<
  Equal<z.output<typeof optionalTransformedField>, number | undefined>
>;

const optionalEmailField = optionalFormField(emailSchema);
type OptionalEmailInput = Expect<
  Equal<z.input<typeof optionalEmailField>, string | undefined>
>;
type OptionalEmailOutput = Expect<
  Equal<z.output<typeof optionalEmailField>, Email | undefined>
>;

// @ts-expect-error The adapter accepts Zod schemas, not parsed values.
optionalFormField("not a schema");

declare const email: Email;
declare const username: Username;
declare const password: Password;
declare const strongPassword: StrongPassword;

const emailAsLoginIdentifier: LoginIdentifier = email;
const usernameAsLoginIdentifier: LoginIdentifier = username;
const strongAsPassword: Password = strongPassword;

// @ts-expect-error Parsed username values are not email values.
const usernameAsEmail: Email = username;
// @ts-expect-error A base password has not passed the strong-password schema.
const passwordAsStrong: StrongPassword = password;
// @ts-expect-error Branded output must come from parsing.
const unparsedEmail: Email = "person@example.com";

void emailAsLoginIdentifier;
void usernameAsLoginIdentifier;
void strongAsPassword;
void usernameAsEmail;
void passwordAsStrong;
void unparsedEmail;

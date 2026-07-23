import { slugify } from "./slugify";

const slug = slugify("Déjà Vu: A Guide");
// "deja-vu-a-guide"

const unicodeSlug = slugify("नमस्ते संसार", "_");
// "नमस्ते_संसार"

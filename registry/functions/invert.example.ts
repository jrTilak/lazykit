import { invert } from "./invert";

const byCode = invert({ success: 200, missing: 404 });
// { 200: "success", 404: "missing" }

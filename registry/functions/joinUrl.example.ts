import { joinUrl } from "./joinUrl";

const endpoint = joinUrl("https://api.example.com/v1/", "/users/", "ada");
// "https://api.example.com/v1/users/ada"

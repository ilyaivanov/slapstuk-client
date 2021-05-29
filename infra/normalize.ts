import { style } from "./style";

//core is taken from https://github.com/necolas/normalize.css/blob/master/normalize.css
//not using npm package cause I want full control over my resultings css
style.tag("body", { margin: 0 });

style.tag("html", { lineHeight: 1.5 });

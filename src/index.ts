import React from "react";
import ReactDOM from "react-dom";
import "./Shared/fonts/fonts.scss";
import "./externals.scss";
import "./main.scss";

import "./Localization/i18n";
import { routing } from "./routes/routing";
import "./Shared/FontAwesome/icons-library";
import { toast } from "react-toastify";

toast.configure({
    autoClose: 8000,
    position: toast.POSITION.TOP_RIGHT,
    className: "text-sm"
});

if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const whyDidYouRender = require("@welldone-software/why-did-you-render");
    whyDidYouRender(React);
}

ReactDOM.render(routing, document.getElementById("main"));

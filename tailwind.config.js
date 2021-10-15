/* eslint-disable @typescript-eslint/no-var-requires */
const { colors, maxWidth } = require("tailwindcss/defaultTheme");
const tinycolor = require("tinycolor2");

module.exports = {
    theme: {
        extend: {
            flex: {
                "0-auto": "0 0 auto"
            },
            minWidth: {
                "0": "0",
                "1/4": "25%",
                "1/2": "50%",
                "3/4": "75%",
                full: "100%",
                600: "600px"
            },
            maxWidth: {
                screen: "100vw"
            },
            colors: {
                husk: { default: "#baa35d" },
                seance: {
                    default: "#9C27B0",
                    50: tinycolor("#9C27B0")
                        .setAlpha(0.5)
                        .toRgbString()
                },
                gray: {
                    ...colors.gray,
                    gallery: "#eee",
                    silver: "#ccc",
                    emperor: "#555",
                    silverChalice: "#aaa"
                },
                blue: {
                    ...colors.blue,
                    oxford: "#3C4858",
                    brightTurquoise: "#00d3ee",
                    sanJuan: "#365672"
                },
                green: {
                    ...colors.green,
                    fern: "#5cb860"
                },
                orange: {
                    ...colors.orange,
                    treePoppy: "#ffa21a"
                },
                red: {
                    ...colors.red,
                    carnation: "#f55a4e"
                }
            }
        },
        variants: {},
        plugins: []
    }
};

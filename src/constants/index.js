const COLORS = {
    primary: "#111111",
    secondary: "#999999",
    accent: "#333333"
}

const SIZES = {
    padding: 19,
    borderRadius: 15,
    textBoxRadius: 25,
    h1: 24,
    h2: 20
}

const FONTS = {
    h1_semiBold: { fontSize: SIZES.h1, fontFamily : "Monts" },
    h2_semiBold: { fontSize: SIZES.h2, fontFamily : "Monts" }
}

const SHADOW = {
    elevation: 5,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 2, height: 12 },
    shadowRadius: 12,
}

export { COLORS, SIZES, FONTS, SHADOW }
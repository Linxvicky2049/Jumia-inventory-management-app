const generateSKU = (name = "", category = "") => {
    const cleanName = String(name || "")
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "")
        .slice(0, 4);

    const cleanCategory = String(category || "")
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "")
        .slice(0, 4);

    const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();

    const prefix = cleanName || cleanCategory || "PRD";
    const categoryPrefix = cleanCategory || "GEN";

    return `${prefix}-${categoryPrefix}-${randomPart}`;
};

module.exports = {
    generateSKU,
};

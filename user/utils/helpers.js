// Scroll đến element với offset
export const scrollToElement = (elementId, offsetRem = 5) => {
    const el = document.getElementById(elementId);
    if (!el) return;

    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const offset = offsetRem * rem;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top: y, behavior: "smooth" });
};

export const dateFormat = (date) => {
    return new Date(date).toLocaleString(`en-ZA`, {
        dateStyle: "medium",
        timeStyle: "short"
    });
};
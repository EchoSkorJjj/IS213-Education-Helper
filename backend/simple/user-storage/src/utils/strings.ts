export const toPascalCase = (originalString: string): string => {
    const matched = originalString.match(/[a-z]+/gi);
    if (!matched) {
        return originalString;
    }

    return matched
        .map((word: string) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
        .join('');
};
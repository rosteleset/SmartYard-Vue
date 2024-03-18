
const basePathValidator = (path: string) => {
    if (typeof path !== 'string')
        return ""
    if (path.charAt(path.length - 1) === '/')
        return path.slice(0, -1);
    else
        return path
}

export const getBasePath = () => {
    return basePathValidator(import.meta.env.VITE_BASE_PATH)
}
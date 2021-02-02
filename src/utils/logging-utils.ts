
export function setLogLevel(level: 'TRACE' | 'DEBUG' | 'INFO' | 'WARN'): void {
    switch (level) {
        case 'WARN':
            console.info = () => {}
        case 'INFO':
            console.debug = () => {}
        case 'DEBUG':
            console.trace = () => {}
        default:
            console.log('Console level set to ' + level)
    }
}
export function getDisplayName(fullName?: string, username?: string): string {
    if (fullName && fullName.trim()) {
        return fullName.split(' ')[0];
    }
    return username || 'User';
}

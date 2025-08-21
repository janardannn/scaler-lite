export function getAvatarInitial(name?: string, username?: string): string {
    if (name && name.trim().length > 0) {
        return name.trim().charAt(0).toUpperCase();
    } else if (username && username.trim().length > 0) {
        return username.trim().charAt(0).toUpperCase();
    } else {
        return 'User'; // fallback
    }
}

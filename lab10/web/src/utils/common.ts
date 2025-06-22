export const timeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    const days = Math.floor(seconds / 86400);
    const interval = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    let result = 'updated ';

    if (days > 0) {
        result += `${days} day${days > 1 ? 's' : ''} `;
    }
    if (interval > 0) {
        result += `${interval} hour${interval > 1 ? 's' : ''} `;
    }
    if (minutes > 0) {
        result += `${minutes} minute${minutes > 1 ? 's' : ''} `;
    }

    return result.trim() + ' ago';
}
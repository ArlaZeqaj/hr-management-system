// components/utils/projectUtils.js
export const getProgressColor = (status) => {
    if (!status) return '#FFB547';
    const s = status.toLowerCase();
    if (s === 'done') return '#05CD99';
    if (s === 'ongoing') return '#4318FF';
    if (s === 'canceled') return '#FF5B5B';
    return '#FFB547';
};

export const getStatusIcon = (status) => {
    if (!status) return '⏳';
    const s = status.toLowerCase();
    if (s === 'done') return '✔️';
    if (s === 'ongoing') return '🛠️';
    if (s === 'canceled') return '❌';
    return '⏳';
};

export const calculateDaysLeft = (endDate) => {
    if (!endDate || !endDate.seconds) return null;
    const today = new Date();
    const end = new Date(endDate.seconds * 1000);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : `⚠️ Overdue`;
};

export const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return '—';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
};

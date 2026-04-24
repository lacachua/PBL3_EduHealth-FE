export const ADMIN_REPORT_CARD_METADATA = {
    'total-students': {
        icon: 'groups',
        iconTone: 'slate',
        iconFill: false,
        noteTone: 'neutral',
        valueTone: 'default',
    },
    'stable': {
        icon: 'check_circle',
        iconTone: 'success',
        iconFill: true,
        noteTone: 'success-soft',
        valueTone: 'default',
    },
    'follow-up': {
        icon: 'visibility',
        iconTone: 'warning',
        iconFill: false,
        noteTone: 'neutral',
        valueTone: 'default',
    },
    'critical': {
        icon: 'warning',
        iconTone: 'danger',
        iconFill: false,
        noteTone: 'neutral',
        valueTone: 'danger',
    },
    'vaccine-coverage': {
        icon: 'vaccines',
        iconTone: 'slate',
        iconFill: false,
        noteTone: 'neutral',
        valueTone: 'default',
    },
};

/**
 * Fallback metadata for unknown card IDs
 */
export const DEFAULT_CARD_METADATA = {
    icon: 'analytics',
    iconTone: 'slate',
    iconFill: false,
    noteTone: 'neutral',
    valueTone: 'default',
};

/**
 * Get UI metadata for a summary card by ID
 * @param {string} cardId - The card identifier from backend
 * @returns {object} UI metadata object
 */
export const getCardMetadata = (cardId) => {
    return ADMIN_REPORT_CARD_METADATA[cardId] || DEFAULT_CARD_METADATA;
};

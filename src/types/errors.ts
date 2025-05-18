export class AppError extends Error {
    constructor(
        message: string,
        public code: string,
        public status: number = 400
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export const ErrorCodes = {
    NO_CAMPAIGN: 'NO_CAMPAIGN',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
} as const;

export const ErrorMessages = {
    [ErrorCodes.NO_CAMPAIGN]: "Il n'y a actuellement aucune campagne en cours.",
    [ErrorCodes.AUTHENTICATION_ERROR]: "Impossible de lire la session de l'utilisateur. Essayez de vous reconnecter.",
    [ErrorCodes.DATABASE_ERROR]: "Une erreur est survenue, merci de réessayer ultérieurement.",
    [ErrorCodes.VALIDATION_ERROR]: "Les données fournies sont invalides.",
    [ErrorCodes.RATE_LIMIT_ERROR]: "Trop de requêtes, veuillez réessayer plus tard.",
} as const; 
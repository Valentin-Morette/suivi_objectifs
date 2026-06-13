const CONNECTION_ERRORS: Record<string, string> = {
  ETIMEDOUT:
    'MySQL injoignable (délai dépassé). Vérifiez que MySQL/MAMP est démarré et que DB_HOST / DB_PORT dans .env sont corrects.',
  ECONNREFUSED:
    'Connexion refusée. MySQL n’écoute probablement pas sur ce port (MAMP : souvent 8889, pas 3306).',
  ENOTFOUND: 'Hôte MySQL introuvable. Vérifiez DB_HOST dans .env.',
  EHOSTUNREACH: 'Hôte MySQL inaccessible. Vérifiez le réseau ou le VPN.',
}

export function getDbErrorMessage(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null

  const code = 'code' in err && typeof err.code === 'string' ? err.code : null
  const errno = 'errno' in err && typeof err.errno === 'number' ? err.errno : null
  const sqlMessage =
    'sqlMessage' in err && typeof err.sqlMessage === 'string' ? err.sqlMessage : ''

  if (code && code in CONNECTION_ERRORS) {
    return CONNECTION_ERRORS[code]
  }

  if (
    errno === 1265 ||
    sqlMessage.includes("column 'activity'") ||
    sqlMessage.includes('Data truncated for column')
  ) {
    return (
      'La base n’a pas les bonnes activités (badminton, muscu, course, velo). ' +
      'Mettez à jour la colonne activity (voir script SQL dans la doc / le chat).'
    )
  }

  if (errno === 1364 || sqlMessage.includes("Field 'id' doesn't have a default value")) {
    return (
      'La colonne sessions.id doit être en AUTO_INCREMENT. ' +
      'Exécutez le ALTER TABLE indiqué dans la doc / le chat.'
    )
  }

  return null
}

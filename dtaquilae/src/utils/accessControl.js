const roles = {
  CDFRE: {
    domaine: {
      user: ["create", "search", "consult", "update", "delete"],
      stage: ["create", "search", "consult", "update", "delete"],
      questionnaire: ["create", "search", "consult", "update", "delete"],
      question: ["search", "consult", "validate", "delete"],
      test: ["export", "consult", "search", "conforme"],
    },
  },
  ADM: {
    domaine: {
      user: ["create", "search", "consult", "update", "delete"],
      stage: ["create", "search", "consult", "update", "delete"],
      questionnaire: ["create", "search", "consult", "update", "delete"],
      question: ["create", "search", "consult", "verify", "delete"],
      test: ["create", "search", "export", "edit", "delete", "conforme"],
    },
  },
  IEC: {
    domaine: {
      user: ["create", "search", "consult", "update", "delete"],
      stage: ["create", "search", "consult", "update"],
      questionnaire: [],
      question: ["create", "search", "consult"],
      test: ["export", "edit"],
    },
  },
  PGS: {
    domaine: {
      user: ["create", "search", "consult", "update", "delete"],
      stage: ["search", "consult"],
      questionnaire: [],
      question: [],
      test: ["export", "edit"],
    },
  },
  STA: {
    domaine: {
      user: [],
      stage: [],
      questionnaire: [],
      question: [],
      test: ["pass"],
    },
  },
};

/**
 * Vérifie si l'utilisateur connecté possède les droits nécessaire.
 *
 * @param {String} userRole - Le rôle de l'utilisateur connecté
 * @param {String} permission - La permission nécessaire. Format : domaine.droit -> exemple : user.consult
 * @returns {Boolean} true|false
 */
export function hasPermission(permission) {
  let arrayPermission = permission.split(".");
  return (
    roles[localStorage.getItem("ROLE")]?.domaine[arrayPermission[0]]?.includes(
      arrayPermission[1]
    ) || false
  );
}

/**
 * Vérifie sir l'utilisateur connecté possède le rôle nécessaire.
 *
 * @param {String} requiredRole - L'abrégé du rôle nécessaire
 * @returns {Boolean} true|false
 */
export function hasRole(role, requiredRole) {
  return role === requiredRole;
}

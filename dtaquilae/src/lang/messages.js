/**
 * ! Les messages utilisés pour les "models" doivent corrélé avec le préfixe utilisés pour leurs routes APIs
 * ! (nécéssaire pour le bon fonctionnement de certains composants)
 */
export const messages = {
  common: {
    unauthorized: "Vous ne possédez pas l'autorisation nécessaire.",
  },
  users: {
    delete: {
      confirmation: "Êtes-vous sûr de vouloir supprimer cet utilisateur ?",
      success: "L'utilisateur a été archivé avec succès.",
    },
    active: {
      confirmation: "Êtes-vous sûr de vouloir activer cet utilisateur ?",
      success: "L'utilisateur a été désarchivé avec succès.",
    },
    update: {
      success: "L'utilisateur a été modifié avec succès.",
    },
    create: {
      success: "L'utilisateur a été créé avec succès.",
    },
    pdf: {
      error: "Erreur lors du chargement des utilisateurs.",
    },
    token: {
      expired: "Votre session a expiré.",
    },
  },
  questions: {
    delete: {
      confirmation: "Êtes-vous sûr de vouloir supprimer cette question ?",
      success: "La question a été supprimée avec succès.",
    },
    active: {
      confirmation: "Êtes-vous sûr de vouloir activer cette question ?",
      success: "La question a été activée avec succès.",
    },
    update: {
      success: "La question a été modifiée avec succès.",
    },
    create: {
      success: "La question a été créée avec succès.",
    },
    verifiee: {
      success: "La question a été vérifiée avec succès.",
    },
    validee: {
      success: "La question a été validée avec succès.",
    },
    pdf: {
      error: "Erreur lors du chargement des questions. ",
    },
    refus: {
      confirmation:
        "Êtes-vous sûr de vouloir refuser cette question ? Cette action est irréversible.",
      success: "La question a bien été refusée.",
    },
  },
  stage: {
    update: {
      success: "Le stage a été modifié avec succès.",
    },
    create: {
      success: "Le stage a été créé avec succès.",
    },
    delete: {
      success: "Le stage a été supprimé avec succès.",
    },
  },
  questionnaire: {
    create: {
      success: "Le questionnaire a été créé avec succès.",
      error: "Veuillez compléter la base de donnée pour ces cours.",
    },
    delete: {
      success: "Le questionnaire a été supprimé avec succès.",
      error: "erreur lors de la suppression du questionnaire.",
    },
  },
  reponse: {
    update: {
      success: "Mise à jour des réponses effectuée.",
    },
  },  
  test: {
    create: {
      success: "Le test a été créé avec succès.",
    },
    update: {
      date: {
        success: "La date du test a été modifiée avec succès.",
      },
    },
  },
};

import axios from "axios";

/**
 * Initialisation de l'URL pointant vers l'API
 * TODO prod : L'URL est à modifier lors d'une mise en prod
 */
const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  withCredentials: false,
});

/**
 * Configuration de base pour chaque requête vers l'API
 * Ajout du token dans le header de la requête, sinon rejet de la part du serveur
 */
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Retour de chaque requête vers l'API
 * En cas d'erreur 401 (accès non autorisé) le jeton est supprimé et l'utilisateur envoyé vers la page de connexion
 */
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    try {
      const { response } = error;
      switch (response.status) {
        case 401:
          localStorage.removeItem("ACCESS_TOKEN");
          localStorage.removeItem("ROLE");
          localStorage.removeItem("USER");
          window.location = '/login?token="Votre session a expiré"';
          break;
        case 403:
          window.location = "/dashboard?forbidden=true";
          break;
      }
    } catch (e) {
      console.log(e);
    }

    throw error;
  }
);

export default axiosClient;

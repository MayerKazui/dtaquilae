//Importation des modules React nécessaires
import { useEffect, useState, useRef } from "react";
import axiosClient from "../../axios-client";
import { useNavigate, useParams } from "react-router-dom";
import { getLabels, getMessages } from "../../lang/langFunctions";
import BackButton from "../../components/common/BackButton";
import { useStateContext } from "../../context/ContextProvider";
import ExportPDFCreateUser from "./ExportPDFCreateUser";
import bcrypt from "bcryptjs";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";

// composant principal du formulaire
export default function CreeUtilisateur() {
  const { id } = useParams();
  //! Utilisation du useRef pour palier au fait que le setter du useState intervient une fois re-render est fait et donc délai sur la frappe pour le nom et prénom
  const userRef = useRef({
    id: "",
    matricule: "",
    numeroAlliace: "",
    grade_id: "",
    nom: "",
    prenom: "",
    email: "",
    role_id: "",
    password: "",
    login: "",
  });
  //Etats pour stocker les données du formulaire
  const [utilisateur, setUtilisateur] = useState({
    id: "",
    matricule: "",
    numeroAlliance: "",
    grade_id: "",
    nom: "",
    prenom: "",
    email: "",
    role_id: "",
    password: "",
    login: "",
  });
  let monInputMat = document.getElementById("matricule");
  let divMatricule = document.getElementById("div_matricule");
  const [optionsGrade, setOptionsGrade] = useState([]);
  const [optionsRole, setOptionsRole] = useState([]);
  const tmpPwd = useRef("");
  const hashedPwd = useRef("");
  const navigate = useNavigate();
  const { setNotification, blockMain, unblockMain } = useStateContext();
  const [errors, setErrors] = useState(null);
  const [changePwd, setChangePwd] = useState(false);
  const [showNumeroAlliance, setShowNumeroAlliance] = useState(false);

  // ----------------------------------------------------------------------------------------------------------------------------------

  // au chargement de la page
  useEffect(() => {
    blockMain();
    // Appeler la fonction pour récupérer les grades
    if (id != "add") {
      axiosClient
        .get(`/users/${id}`)
        .then(({ data }) => {
          setUtilisateur(data);
          userRef.current = data;
          console.log(data);
          if (
            data.grade_libelle == "Monsieur" ||
            data.grade_libelle == "Madame"
          ) {
            setShowNumeroAlliance(false);
            console.log("yolo");
          }
          tmpPwd.current = "Mot de passe inchangé";
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
    fetchOptionsGrade();
    // Appeler la fonction pour récupérer les roles
    fetchOptionsRole();
  }, []); // Le tableau vide [] assure que l'effet est exécuté une seule fois au montage du composant

  useEffect(() => {
    userRef.current = utilisateur;
    implementeLogin();
  }, [utilisateur]);

  useEffect(() => {
    controleGrade(utilisateur.grade_id); // Appeler la fonction pour contrôler l'affichage initial
  }, [utilisateur.grade_id]);

  // ----------------------------------------------------------------------------------------------------------------------------------

  function genererMotDePasse(taille = 12) {
    // Listes de caractères
    const chiffres = "0123456789";
    const caracteresSpeciaux = "!@#$%&*()-+";
    const majuscules = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const minuscules = "abcdefghijklmnopqrstuvwxyz";

    // Fonction pour générer un caractère aléatoire
    function getRandomChar(liste) {
      return liste[Math.floor(Math.random() * liste.length)];
    }

    // Construction du mot de passe
    let motDePasse = "";
    for (let i = 0; i < taille; i++) {
      // Déterminer le type de caractère à générer
      let typeChar;
      if (!/[0-9]/.test(motDePasse)) {
        typeChar = "chiffre";
      } else if (!/[!@#$%^&*()-+]/.test(motDePasse)) {
        typeChar = "caractereSpecial";
      } else if (!/[A-Z]/.test(motDePasse)) {
        typeChar = "majuscule";
      } else {
        typeChar = "minuscule";
      }

      // Générer un caractère aléatoire du type choisi
      motDePasse += getRandomChar(
        typeChar === "chiffre"
          ? chiffres
          : typeChar === "caractereSpecial"
          ? caracteresSpeciaux
          : typeChar === "majuscule"
          ? majuscules
          : minuscules
      );
    }

    // Mélange des caractères
    motDePasse = motDePasse
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    return motDePasse;
  }

  function genererMatricule() {
    let tabMatriculeAleatoire = [];

    tabMatriculeAleatoire.push(8);
    for (let i = 1; i < 10; i++) {
      const chiffreAleatoire = Math.floor(Math.random() * 10);
      tabMatriculeAleatoire.push(chiffreAleatoire);
    }

    let matriculeAleatoire = tabMatriculeAleatoire.join("");
    return matriculeAleatoire;
  }

  const handleGeneratePdf = async () => {
    try {
      await ExportPDFCreateUser({
        nom: userRef.current.nom,
        prenom: userRef.current.prenom,
        login: userRef.current.login,
        password: tmpPwd.current,
      });
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
    }
  };

  const implementeLogin = () => {
    if (
      userRef.current.nom.length !== 0 &&
      userRef.current.prenom.length !== 0
    ) {
      let urlApi =
        id != "add"
          ? `/users/construct-login/${userRef.current.nom}/${userRef.current.prenom}/${id}`
          : `/users/construct-login/${userRef.current.nom}/${userRef.current.prenom}`;
      axiosClient.get(urlApi).then((data) => {
        userRef.current.login = data.data;
        if (id == "add") {
          hashPassword();
        }
      });
    }
  };

  const hashPassword = () => {
    tmpPwd.current = genererMotDePasse();
    bcrypt.hash(tmpPwd.current, 10, (err, hash) => {
      if (err) {
        console.error(err);
      } else {
        hashedPwd.current = hash;
      }
    });
  };

  // soumission du formulaire
  const handleSubmit = (e) => {
    // annule le comportement associer par default a un envenement. ici l'appel à e.preventDefault() garantit que la page ne se recharge pas lorsque le formulaire est soumis
    e.preventDefault();

    if (id != "add") {
      let generatePdf = false;
      if (changePwd) {
        generatePdf = true;
        utilisateur.password = hashedPwd.current;
      }
      axiosClient
        .put(`/users/${id}`, userRef.current)
        .then(() => {
          setNotification(getMessages("users.update.success"));
          navigate("/users");
          if (generatePdf) handleGeneratePdf();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      utilisateur.password = hashedPwd.current;
      axiosClient
        .post("/users", userRef.current)
        .then(() => {
          setNotification(getMessages("users.create.success"));
          navigate("/users");
          handleGeneratePdf();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  // Effectuer une requête Axios pour récupérer les grades
  const fetchOptionsGrade = async () => {
    // recupere les grade et les met directement dans la variable option grade ( a fair pour charger automatiquement au lancement de la page)
    axiosClient
      .get("/grades")
      .then(({ data }) => {
        setOptionsGrade(data.data);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
      });
  };

  // Effectuer une requête Axios pour récupérer les roles
  const fetchOptionsRole = async () => {
    // recupere les grade et les met directement dans la variable option grade ( a fair pour charger automatiquement au lancement de la page)
    axiosClient
      .get("/roles")
      .then(({ data }) => {
        setOptionsRole(data.data);
        unblockMain();
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
      });
  };

  //------------------------------------------------------------------------------------------------------------------------------------------------------

  //Mise ajour de l'objet utilisateur en fonction des changements (evenement) du champ. l'ojet utilisateur est ensuite utilisé pour la soumission du formulaire.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUtilisateur((prevUtilisateur) => ({
      ...prevUtilisateur,
      [name]: value,
    }));
    // appelle de la méthode permettant de contrôler s'il s'agit d'un stagiaire etranger
    controleEtranger(name, value);
    if (name === "grade_id") {
      controleGrade(value); // Appeler la fonction de contrôle lorsque le grade change
    }
  };

  // Contrôle de l'affichage des champs en fonction du grade sélectionné
  const controleGrade = (gradeId) => {
    const grade = optionsGrade.find((option) => option.id == gradeId);
    if (grade && (grade.libelle === "Monsieur" || grade.libelle === "Madame")) {
      setShowNumeroAlliance(false); 
      setUtilisateur((prevUtilisateur) => ({
        ...prevUtilisateur,
        matricule: "", 
      }));
    } else {
      setShowNumeroAlliance(true); 
    }
  };


  const controleEtranger = (nomDuChamp, value) => {
    if (nomDuChamp === "grade_id") {
      if (value === "30") { // Si le grade est "Étranger"
        const matriculeAleatoire = genererMatricule();
        monInputMat.value = matriculeAleatoire;
        setUtilisateur((prevUtilisateur) => ({
          ...prevUtilisateur,
          matricule: matriculeAleatoire,
        }));
        divMatricule.classList.add("hidden"); 
      } else {
        monInputMat.value = ""; 
        setUtilisateur((prevUtilisateur) => ({
          ...prevUtilisateur,
          matricule: "", 
        }));
        divMatricule.classList.remove("hidden");
      }
    }
  };

  return (
    <>
      {utilisateur.id ? (
        <span className="title">
          {getLabels("users.update.title").replace(
            "%s",
            utilisateur.nom + " " + utilisateur.prenom
          )}
        </span>
      ) : (
        <span className="title">{getLabels("users.create.title")}</span>
      )}
      {errors && (
        <div className={"alert"}>
          {Object.keys(errors).map((key) => (
            <p key={key}>{errors[key][0]}</p>
          ))}
        </div>
      )}

      <form
        id="form-create-user"
        onSubmit={handleSubmit}
        className="modern-form"
      >
        <label className="label-form">
          {getLabels("users.fields.role")}
          <select
            name="role_id"
            value={utilisateur.role_id}
            onChange={handleChange}
            className="selectForm"
            required
          >
            <option value="">Sélectionnez... </option>
            {optionsRole.map((option) => (
              <option key={option.id} value={option.id}>
                {option.libelle}
              </option>
            ))}
          </select>
        </label>

        <label className="label-form">
          {getLabels("users.fields.grade")}
          <select
            name="grade_id"
            value={utilisateur.grade_id}
            onChange={handleChange}
            className="selectForm"
            required
          >
            <option value="">Sélectionnez... </option>
            {optionsGrade.map((option) => (
              <option key={option.id} value={option.id}>
                {option.libelle}
              </option>
            ))}
          </select>
        </label>

        {/* Affichage conditionnel des champs */}
        {showNumeroAlliance ? (
          <div className="text-gray-600" id="div_matricule">
            <label className="label-form" htmlFor="matricule">
              {getLabels("users.fields.matricule")}
            </label>
            <InputText
              id="matricule"
              value={utilisateur.matricule}
              name="matricule"
              onChange={handleChange}
              keyfilter="int"
              maxLength={10}
              minLength={10}
              required={!showNumeroAlliance}
            />
          </div>
        ) : (
          <div className="text-gray-600" id="div_numeroAlliance">
            <label className="label-form" htmlFor="numeroAlliance">
              {getLabels("users.fields.numeroAlliance")}
            </label>
            <InputText
              id="numeroAlliance"
              value={utilisateur.numeroAlliance}
              name="numeroAlliance"
              onChange={handleChange}
              keyfilter="string"
              maxLength={12}
              minLength={12}
              required={showNumeroAlliance}
            />
          </div>
        )}
        <div className="text-gray-600">
          <label className="label-form" htmlFor="nom">
            {getLabels("users.fields.nom")}
          </label>
          <InputText
            id="nom"
            name="nom"
            value={utilisateur.nom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="text-gray-600">
          <label htmlFor="prenom" className="label-form">
            {getLabels("users.fields.prenom")}
          </label>
          <InputText
            id="prenom"
            name="prenom"
            value={utilisateur.prenom}
            onInput={handleChange}
            required
          />
        </div>
        {id != "add" && (
          <div className="flex">
            <label
              htmlFor="chkbox_change_pwd"
              className="mb-4 mr-4 text-base label-form"
            >
              Générer un nouveau mot de passe
            </label>
            <Checkbox
              inputId="chkbox_change_pwd"
              onChange={() => {
                changePwd ? setChangePwd(false) : setChangePwd(true);
                hashPassword();
              }}
              checked={changePwd}
              pt={{
                box: ({ props }) => ({
                  style: {
                    backgroundColor: props.checked ? "#3b82f6" : "#555",
                  },
                }),
              }}
            />
          </div>
        )}
        <div>
          <button className="btn" type="submit">
            {getLabels("common.btn.save")}
          </button>
          <BackButton />
        </div>
      </form>
    </>
  );
}

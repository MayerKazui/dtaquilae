import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../context/ContextProvider";
import BackButton from "../../components/common/BackButton";
import { getLabels, getMessages } from "../../lang/langFunctions";
import { hasPermission } from "../../utils/accessControl";
import { Carousel } from "primereact/carousel";
import { Image } from "primereact/image";
import { saveAs } from "file-saver";
import { InputNumber } from "primereact/inputnumber";
import classNames from "classnames";
import { MultiSelect } from "primereact/multiselect";

export default function GererQuestionnaire() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setNotification, blockMain, unblockMain } = useStateContext();

  // Initialisation des états
  const [errors, setErrors] = useState(null);
  const [isCoursVisible, setIsCoursVisible] = useState(false);
  const [formations, setFormation] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [selectedFormationId, setSelectedFormationId] = useState("");
  const [selectedFormation, setSelectedFormation] = useState("");
  const [coursParSousChapitre, setCoursParSousChapitre] = useState({});
  const [consultation, setConsultation] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isSaveVisible, setIsSaveVisible] = useState(false);
  const [urlsImages, setUrlsImages] = useState({});
  const [isCounterTest, setIsCounterTest] = useState(false);
  const [modules, setModules] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [numberQuestionsAddCours, setNumberQuestionsAddCours] = useState({});
  const [questionnaire, setQuestionnaire] = useState({
    id: null,
    nom: "",
    date: "",
    supprimable: "",
    questions: [],
  });

  const getFormation = async () => {
    axiosClient
      .get(`/formation`)
      .then(({ data }) => {
        setFormation(data.data);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
      });
  };

  const getQuestionnaire = async () => {
    try {
      const { data } = await axiosClient.get(`/questionnaires/${id}`);
      setQuestionnaire(data);
      setConsultation(true);

      const urlsImages = {};
      data.questions.forEach((question) => {
        urlsImages[question.id] = question.images.map((image) => image);
      });
      setUrlsImages(urlsImages);
    } catch (err) {
      const response = err.response;
      if (response && response.status == 422) {
        setErrors(response.data.errors);
      }
    }
  };
  // chargement des formation à l'affichage
  useEffect(() => {
    axiosClient
      .get(`/formation`)
      .then(({ data }) => {
        setFormation(data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  //un seul use effect pour le changement de formation ou d'etat de la checkbox
  useEffect(() => {
    setModules([]); 
    setSelectedModules([]);
    setTests([]); 
    setSelectedTest("");
    if (!selectedFormationId) return; //si l'utilisateur change la check box avant de selectionner une formation

    blockMain();
    
    const url = isCounterTest
      ? `/questionnaires/module/${selectedFormationId}`
      : `/questionnaires/formation/${selectedFormationId}`;

    axiosClient
      .get(url)
      .then(({ data }) => {
        unblockMain();
        if (isCounterTest) {
          setModules(data);
        } else {
          setTests(data);
        }
      })
      .catch((err) => {
        unblockMain();
        console.error(err);
      });
  }, [selectedFormationId, isCounterTest]);

  const handleCheckboxChange = () => {
    setIsCounterTest((prev) => !prev);
  };

  const handleFormationChange = (event) => {
    const selectedId = event.target.value;
    const selectedName = event.target.options[event.target.selectedIndex].text; // Récupérer le texte du <option>
  
    setSelectedFormationId(selectedId);
    setSelectedFormation(selectedName);
  };

  // Fonction pour vérifier si chaque cours a suffisamment de questions
  const checkNombreQuestions = () => {
    let isValid = true;
    // Parcourir chaque cours
    Object.values(coursParSousChapitre).forEach((cours) => {
      // Vérifier si le nombre de questions est suffisant pour chaque cours en fonction du niveau
      cours.forEach((c) => {
        // Vérifier le niveau du cours
        if (c.niveau === 1 && c.questionsNiveauUn < c.nb_questions_ref) {
          isValid = false;
        } else if (
          c.niveau === 3 &&
          c.questionsNiveauTrois < c.nb_questions_ref
        ) {
          isValid = false;
        }
      });
    });
    return isValid;
  };

  // Effet pour mettre à jour la visibilité du bouton "Enregistrer" en fonction de la validation des questions
  useEffect(() => {
    // Vérifier la validation des questions
    const isValid = checkNombreQuestions();
    // Mettre à jour l'état pour afficher/masquer le bouton "Enregistrer"
    setIsSaveVisible(isValid);
  }, [coursParSousChapitre]);

  useEffect(() => {
    if (selectedModules.length > 0) {
      blockMain();
      const modulesParam = selectedModules.join(","); // Convertir en chaîne pour l'API
      axiosClient
        .get(`/questionnaires/test/${selectedFormationId}/null/${modulesParam}`)
        .then(({ data }) => {
          unblockMain();
          // Organiser les cours par sous-chapitres
          const coursData = data.data;
          const coursGroupedBySousChapitre = {};
          coursData.forEach((cours) => {
            if (!coursGroupedBySousChapitre[cours.sous_chapitre]) {
              coursGroupedBySousChapitre[cours.sous_chapitre] = [];
            }
            coursGroupedBySousChapitre[cours.sous_chapitre].push(cours);
          });
          setCoursParSousChapitre(coursGroupedBySousChapitre);
          setIsCoursVisible(true); // Afficher les cours
        })
        .catch((err) => {
          unblockMain();
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      // Réinitialiser si aucun module n'est sélectionné
      setCoursParSousChapitre({});
      setIsCoursVisible(false);
    }
  }, [selectedModules, selectedFormationId]);

  const handleTestChange = (event) => {
    blockMain();
    const selectedTest = event.target.value;
    setSelectedTest(selectedTest);
    setIsCoursVisible(true);
    // Reinitialiser les etats necessaires
    setSelectedOptions({});
    setCoursParSousChapitre({});
    setNumberQuestionsAddCours([]);
    axiosClient
      .get(
        `/questionnaires/test/${selectedFormationId}/${selectedTest}/${selectedModules}`
      )
      .then(({ data }) => {
        unblockMain();

        const coursData = data.data;
        const coursGroupedBySousChapitre = {};
        coursData.forEach((cours) => {
          if (!coursGroupedBySousChapitre[cours.sous_chapitre]) {
            coursGroupedBySousChapitre[cours.sous_chapitre] = [];
          }
          coursGroupedBySousChapitre[cours.sous_chapitre].push(cours);
        });
        setCoursParSousChapitre(coursGroupedBySousChapitre);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
      });
  };

  // Fonction pour gérer le changement d'option sélectionnée pour un cours
  const handleOptionChange = (event, cours) => {
    const { value } = event.target;
    const updatedCoursParSousChapitre = { ...coursParSousChapitre };
    updatedCoursParSousChapitre[cours.sous_chapitre].forEach((c, index) => {
      if (c.id === cours.id) {
        updatedCoursParSousChapitre[cours.sous_chapitre][index].nb_questions =
          c.nb_questions_ref;
      }
    });
    // Mise à jour de l'état de coursParSousChapitre
    setCoursParSousChapitre(updatedCoursParSousChapitre);

    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [cours.id]: value,
    }));
    setNumberQuestionsAddCours((prevNumberQuestionsAddCours) => ({
      ...prevNumberQuestionsAddCours,
      [cours.id]: 0,
    }));
  };

  const gestionModification = (cours, value) => {
    // Copiez le cours pour le modifier sans modifier directement l'état
    const updatedCours = { ...cours };
    // Mettez à jour le nombre de questions
    updatedCours.nb_questions = updatedCours.nb_questions_ref + value;

    // Mettez à jour l'état de coursParSousChapitre avec le cours mis à jour
    const updatedCoursParSousChapitre = { ...coursParSousChapitre };
    updatedCoursParSousChapitre[cours.sous_chapitre].forEach((c, index) => {
      if (c.id === cours.id) {
        updatedCoursParSousChapitre[cours.sous_chapitre][index] = updatedCours;
      }
    });
    setNumberQuestionsAddCours((prevNumberQuestionsAddCours) => ({
      ...prevNumberQuestionsAddCours,
      [cours.id]: value,
    }));
    // Mettez à jour l'état de coursParSousChapitre
    setCoursParSousChapitre(updatedCoursParSousChapitre);
  };

  const calculerQuestionsDisponibles = (cours) => {
    const selectedOption = selectedOptions[cours.id];
    let nbAjoutQuestions;
    switch (selectedOption) {
      case "random":
        nbAjoutQuestions =
          cours.questionsNiveauUn +
          cours.questionsNiveauTrois -
          cours.nb_questions_ref;
        break;
      case "1":
        nbAjoutQuestions =
          cours.niveau === 1
            ? cours.questionsNiveauUn - cours.nb_questions_ref
            : cours.questionsNiveauUn;
        break;
      case "3":
        nbAjoutQuestions =
          cours.niveau === 3
            ? cours.questionsNiveauTrois - cours.nb_questions_ref
            : cours.questionsNiveauTrois;
        break;
    }
    return nbAjoutQuestions;
  };

  const handleSuppression = () => {
    axiosClient
      .delete(`/questionnaires/${questionnaire.id}`)
      .then(() => {
        setNotification(getMessages("questionnaire.delete.success"));
        navigate(`/questionnaires`);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        } else {
          setNotification(getMessages("questionnaire.delete.error"));
        }
      });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (questionnaire.id) {
      axiosClient
        .put(`/questionnaires/${questionnaire.id}`, questionnaire)
        .then(() => {
          setNotification(getMessages("questionnaire.update.success"));
          navigate(`/questionnaires/${questionnaire.id}`);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      // Enregistrer le nouveau questionnaire
      const dataToSend = {
        selectedFormationId,
        selectedFormation,
        selectedTest,
        selectedModules,
        selectedOptions,
        coursParSousChapitre,
      };
      axiosClient
        .post(`/questionnaires`, dataToSend)
        .then((response) => {
          setNotification(getMessages("questionnaire.create.success"));
          navigate(`/questionnaires/${response.data.idQuestionnaire}`);
          setSelectedModules([]);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  useEffect(() => {
    // Effet déclenché lors du changement d'URL (id)
    blockMain();
    if (id) {
      getQuestionnaire();
      setConsultation(true);
    } else {
      setConsultation(false);
    }
    getFormation();
    unblockMain();

    // Retour de la fonction de nettoyage
    return () => {
      // Réinitialisation des états nécessaires ici
      setErrors(null);
      setIsCoursVisible(false);
      setFormation([]);
      setTests([]);
      setSelectedTest("");
      setSelectedFormationId("");
      setSelectedFormation("");
      setCoursParSousChapitre({});
      setUrlsImages({});
      setQuestionnaire({
        id: null,
        nom: "",
        date: "",
        supprimable: "",
        questions: [],
      });
      setConsultation(true);
      setSelectedOptions({});
      setIsSaveVisible(false);
    };
  }, [id]);

  function base64toBlob(base64Data, contentType) {
    contentType = contentType || "";
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);

      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  const handleDownloadPDF = () => {
    axiosClient
      .get(`/questionnaires/questionnairePDF/${id}`)
      .then((response) => {
        const blob = new Blob([base64toBlob(response.data.pdfData)], {
          type: "application/pdf",
        });
        saveAs(blob, `${questionnaire.nom}.pdf`);
      })
      .catch((error) => {
        console.error("Une erreur s'est produite:", error);
      });
  };

  return (
    <div>
      {consultation && (
        <>
          <h1 className="title">
            {getLabels("questionnaire.fields.questionnaire")} :{" "}
            {questionnaire.nom}
          </h1>
          <div className="card">
            <table className="w-full overflow-x-auto border-collapse">
              <thead>
                <tr className="text-white bg-gray-600">
                  <th className="w-1/4 px-8 py-4 text-center bg-gray-600 border border-gray-300">
                    {getLabels("questionnaire.fields.libelle")}
                  </th>
                  <th className="px-8 py-4 text-center bg-gray-600 border border-gray-300 w-1/10">
                    {getLabels("questionnaire.fields.niveau")}
                  </th>
                  <th className="w-1/6 py-4 text-center bg-gray-600 border border-gray-300 px-7">
                    {getLabels("questionnaire.fields.numero")}
                  </th>
                  <th className="w-1/3 px-8 py-4 text-center bg-gray-600 border border-gray-300">
                    {getLabels("questionnaire.fields.propositions")}
                  </th>
                  <th className="px-8 py-4 text-center bg-gray-600 border border-gray-300 w-1/7">
                    {getLabels("questionnaire.fields.image")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(
                  questionnaire.questions.reduce((acc, question) => {
                    if (!acc[question.libelle_cours]) {
                      acc[question.libelle_cours] = [];
                    }
                    acc[question.libelle_cours].push(question);
                    return acc;
                  }, {})
                ).map(([cours, questions]) => (
                  <React.Fragment key={cours}>
                    <tr>
                      <td
                        colSpan="5"
                        className="px-8 py-4 bg-gray-300 border border-gray-300"
                      >
                        <strong>Cours :</strong> {cours}
                      </td>
                    </tr>
                    {questions.map((question) => (
                      <React.Fragment key={question.id}>
                        <tr>
                          <td
                            rowSpan={question.proposition_une ? "3" : "1"}
                            className="px-8 py-4 text-center whitespace-normal border border-gray-300"
                          >
                            {question.libelle}
                          </td>
                          <td
                            rowSpan={question.proposition_une ? "3" : "1"}
                            className="px-8 py-4 text-center whitespace-normal border border-gray-300"
                          >
                            {question.niveau}{" "}
                            {question.proposition_une ? "" : "QCD"}
                          </td>
                          <td
                            rowSpan={question.proposition_une ? "3" : "1"}
                            className="px-8 py-4 text-center whitespace-normal border border-gray-300"
                          >
                            {question.numero_question}
                          </td>
                          {question.proposition_une ? (
                            <>
                              <td
                                className={`whitespace-normal border border-gray-300 px-8 py-4 text-center ${
                                  question.proposition_une === question.reponse
                                    ? "bg-green-300"
                                    : ""
                                }`}
                              >
                                <strong>A</strong> : {question.proposition_une}
                              </td>
                              <td
                                rowSpan="3"
                                className="px-8 py-4 text-center whitespace-normal border border-gray-300"
                              >
                                {urlsImages[question.id] && (
                                  <Carousel
                                    value={urlsImages[question.id]}
                                    numVisible={5}
                                    itemTemplate={(image) => (
                                      <div className="flex flex-col items-center m-2 text-center">
                                        <Image
                                          src={image}
                                          preview
                                          className="flex m-auto"
                                        />
                                      </div>
                                    )}
                                    showNavigators={false}
                                  />
                                )}
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-8 py-4 text-center whitespace-normal border border-gray-300">
                                {question.reponse}
                              </td>
                              <td className="px-8 py-4 text-center whitespace-normal border border-gray-300">
                                {urlsImages[question.id] && (
                                  <Carousel
                                    value={urlsImages[question.id]}
                                    numVisible={5}
                                    itemTemplate={(image) => (
                                      <div className="flex flex-col items-center m-2 text-center">
                                        <Image
                                          src={image}
                                          preview
                                          className="flex m-auto"
                                        />
                                      </div>
                                    )}
                                    showNavigators={false}
                                  />
                                )}
                              </td>
                            </>
                          )}
                        </tr>
                        {!question.proposition_une && (
                          <>
                            <tr></tr> <tr></tr>
                          </>
                        )}
                        {question.proposition_une && (
                          <>
                            <tr>
                              <td
                                className={`whitespace-normal border border-gray-300 px-8 py-4 text-center ${
                                  question.proposition_deux === question.reponse
                                    ? "bg-green-300"
                                    : ""
                                }`}
                              >
                                <strong>B</strong> : {question.proposition_deux}
                              </td>
                            </tr>
                            <tr>
                              <td
                                className={`whitespace-normal border border-gray-300 px-8 py-4 text-center ${
                                  question.proposition_trois ===
                                  question.reponse
                                    ? "bg-green-300"
                                    : ""
                                }`}
                              >
                                <strong>C</strong> :{" "}
                                {question.proposition_trois}
                              </td>
                            </tr>
                          </>
                        )}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {!consultation && (
        <div>
          <h1 className="title">{getLabels("questionnaire.create.title")}</h1>
          <form onSubmit={onSubmit}>
            {/* Checkbox pour gérer le mode Counter Test */}
            <div className="flex">
              <label htmlFor="counter_test" className="label-form">
                {getLabels("tests.fields.is_counter_test")}
              </label>
              <input
                id="counter_test"
                type="checkbox"
                className="w-4 mb-1 ml-3"
                checked={isCounterTest}
                onChange={handleCheckboxChange}
              />
            </div>

            {/* Liste déroulante des formations */}
            <select onChange={handleFormationChange} defaultValue="">
              <option value="" disabled>
                {getLabels("questionnaire.select.titreFormation")}
              </option>
              {formations.map((formation) => (
                <option key={formation.id} value={formation.id}>
                  {formation.libelle}
                </option>
              ))}
            </select>

            {/* Affichage dynamique en fonction de isCounterTest */}
            {selectedFormationId && // N'afficher que si une formation est sélectionnée
              (isCounterTest ? (
                // Affichage des modules (MultiSelect)
                <div className="mt-4">
                  <label htmlFor="modules" className="label-form">
                    {getLabels("questionnaire.select.modules")}
                  </label>
                  <MultiSelect
                    id="modules"
                    value={selectedModules}
                    options={modules}
                    onChange={(e) => setSelectedModules(e.value)} // Déclenche l'effet useEffect
                    placeholder={getLabels("questionnaire.select.modules")}
                    className="w-full mb-5"
                  />
                </div>
              ) : (
                // Affichage des tests (Single Select)
                <div className="mt-4">
                  <label htmlFor="tests" className="label-form">
                    {getLabels("questionnaire.select.titreTest")}
                  </label>
                  <select
                    id="tests"
                    onChange={handleTestChange}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      {getLabels("questionnaire.select.titreTest")}
                    </option>
                    {tests.map((test) => (
                      <option key={test} value={test}>
                        {test}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

            {isCoursVisible && (
              <>
                {Object.keys(coursParSousChapitre).map(
                  (sousChapitreId, index) => (
                    <div key={sousChapitreId} id="cours">
                      {index > 0 && <hr />}
                      <span className="text-xl font-bold">
                        {getLabels("questionnaire.consult.sousChapitre")} :{" "}
                        {coursParSousChapitre[sousChapitreId][0].sous_chapitre}
                      </span>
                      <div>
                        {coursParSousChapitre[sousChapitreId].map((cours) => (
                          <div key={cours.id}>
                            <div className="modern-form">
                              <p>
                                <strong>
                                  {getLabels("questionnaire.fields.cours")} :
                                </strong>{" "}
                                {cours.libelle}
                              </p>
                              <p>
                                <strong>
                                  {getLabels("questionnaire.fields.ata")} :
                                </strong>{" "}
                                {cours.ata}
                              </p>
                              <p>
                                <strong>
                                  {getLabels("questionnaire.fields.niveau")} :
                                </strong>{" "}
                                {cours.niveau}
                              </p>
                              {!selectedOptions[cours.id] && (
                                <p>
                                  <strong>
                                    {getLabels(
                                      "questionnaire.fields.nbQuestions"
                                    )}{" "}
                                    :
                                  </strong>{" "}
                                  {cours.nb_questions}
                                </p>
                              )}
                              {selectedOptions[cours.id] && (
                                <>
                                  <div className="flex items-center">
                                    <p className="mr-4">
                                      <strong>
                                        {getLabels(
                                          "questionnaire.fields.nbQuestions"
                                        )}{" "}
                                        :
                                      </strong>{" "}
                                      {cours.nb_questions_ref}
                                    </p>
                                  </div>
                                  <div className="flex items-center">
                                    <strong>
                                      {getLabels(
                                        "questionnaire.fields.nbQuestionsSupplémentaire"
                                      )}{" "}
                                      :
                                    </strong>
                                    <InputNumber
                                      inputId="nb-questions-supplementaires"
                                      value={numberQuestionsAddCours[cours.id]}
                                      onValueChange={(e) =>
                                        gestionModification(cours, e.value)
                                      }
                                      showButtons
                                      className="flex"
                                      min={0}
                                      max={calculerQuestionsDisponibles(cours)}
                                      pt={{
                                        incrementButton: () => ({
                                          className: classNames(
                                            "bg-gray-500 text-white w-8 h-4 m-0 border-0 border-b-2 border-solid border-white hover:bg-gray-600"
                                          ),
                                        }),
                                        decrementButton: () => ({
                                          className: classNames(
                                            "bg-gray-500 text-white w-8 h-4 m-0 border-0 border-t-2 border-solid border-white hover:bg-gray-600"
                                          ),
                                        }),
                                        input: () => ({
                                          root: () => ({
                                            style: {
                                              margin: 0,
                                              padding: "0.5rem",
                                              width: "2.5rem",
                                              height: "2.25rem",
                                              borderRadius: "0.3rem 0 0 0.3rem",
                                              borderWidth: 1,
                                              textAlign: "center",
                                            },
                                          }),
                                        }),
                                        root: () => ({
                                          style: {
                                            flex: true,
                                            alignItems: "center",
                                            margin: "0.5rem",
                                          },
                                        }),
                                      }}
                                    />
                                  </div>
                                </>
                              )}
                              <p>
                                <strong>
                                  {getLabels(
                                    "questionnaire.fields.nbQuestionsNiveauUn"
                                  )}{" "}
                                  :
                                </strong>{" "}
                                {cours.questionsNiveauUn}
                              </p>
                              <p className="mb-4">
                                <strong>
                                  {getLabels(
                                    "questionnaire.fields.nbQuestionsNiveauTrois"
                                  )}{" "}
                                  :
                                </strong>{" "}
                                {cours.questionsNiveauTrois}
                              </p>
                              {((cours.questionsNiveauUn <
                                cours.nb_questions_ref &&
                                cours.niveau === 1) ||
                                (cours.questionsNiveauTrois <
                                  cours.nb_questions_ref &&
                                  cours.niveau === 3)) && (
                                <p style={{ color: "red" }}>
                                  {getLabels(
                                    "questionnaire.fields.questionsManquantes"
                                  )}
                                </p>
                              )}
                              {!(
                                cours.questionsNiveauUn <
                                  cours.nb_questions_ref && cours.niveau === 1
                              ) &&
                                !(
                                  cours.questionsNiveauTrois <
                                    cours.nb_questions_ref && cours.niveau === 3
                                ) && (
                                  <div>
                                    <select
                                      onChange={(event) =>
                                        handleOptionChange(event, cours)
                                      }
                                      defaultValue=""
                                    >
                                      <option value="" disabled>
                                        {getLabels(
                                          "questionnaire.select.titreAjoutQuestions"
                                        )}
                                      </option>
                                      <option value="random">
                                        {getLabels(
                                          "questionnaire.select.random"
                                        )}
                                      </option>
                                      <option value="1">
                                        {getLabels(
                                          "questionnaire.select.niveauUn"
                                        )}
                                      </option>
                                      <option value="3">
                                        {getLabels(
                                          "questionnaire.select.niveauTrois"
                                        )}
                                      </option>
                                    </select>
                                  </div>
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
                {isSaveVisible && hasPermission("questionnaire.create") && (
                  <button className="btn">
                    {getLabels("common.btn.save")}
                  </button>
                )}
              </>
            )}
          </form>
        </div>
      )}
      <div className="mt-4">
        {consultation && (
          <div>
            <button className="mr-3 btn" onClick={handleDownloadPDF}>
              Générer PDF
            </button>
            {questionnaire.supprimable && (
              <button
                className="ml-4 btn btn-danger"
                onClick={handleSuppression}
              >
                {getLabels("common.btn.supprimer")}
              </button>
            )}
          </div>
        )}
        <BackButton />
      </div>
    </div>
  );
}

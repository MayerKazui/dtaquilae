import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import BackButton from "../../components/common/BackButton";
import Form from "../../components/common/Form";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import TextArea from "../../components/common/TextArea";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Image } from "primereact/image";
import { Carousel } from "primereact/carousel";
import { Avatar } from "primereact/avatar";
import { Timeline } from "primereact/timeline";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useStateContext } from "../../context/ContextProvider";
import { getLabels, getMessages } from "../../lang/langFunctions";
import { AutoComplete } from "primereact/autocomplete";

export default function GererQuestion() {
  const { setNotification, blockMain, unblockMain, user } = useStateContext();
  const { id } = useParams();
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();
  const [questionType, setQuestionType] = useState("QCM"); // Pour gérer le type de question
  const [typeQuestionQCM, setTypeQuestionQCM] = useState(true); // Pour gérer le type de question
  const [selectedBonneReponse, setSelectedBonneReponse] = useState(null);
  const [question, setQuestion] = useState({
    // Pour stocker les parametres de la question
    numero_question: "",
    chapitre_id: "",
    sous_chapitre_id: "",
    libelle: "",
    ata: "",
    proposition_une: "",
    proposition_deux: "",
    proposition_trois: "",
    reponse: null,
    niveau: null,
    niveau_taxinomique_id: null,
    verificateur: "",
    date_verif: "",
    valideur: "",
    date_validation: "",
    actif: "",
    reference_documentaire: "",
    auteur: "",
    created_at: "",
  });
  const [selectedCoursLibelle, setselectedCoursLibelle] = useState(null); // Pour stocker l'ID du cours sélectionné
  const [niveauTax, setNiveauTax] = useState([]); // Pour stocker les niveaux taxinomiques récupérés depuis l'API
  const [modifier, setModifier] = useState(false);
  const dateDuJour = () => {
    let d = new Date();
    let date = d.toISOString().split("T")[0];
    let time = d.toTimeString().split(" ")[0];
    return `${date} ${time}`;
  };
  const [Consultation, setConsultation] = useState(true);
  // Création de l'objet permettant la création d'un select pour les index de bonne réponse
  const IndexBonneReponseObject = (index, indice) => {
    return {
      index: index,
      value: "proposition_" + index,
      display: getLabels("questions.form.proposition") + " " + indice,
    };
  };
  // Implémentation des index de bonne réponse et de la liste
  const indexBonneReponseUne = IndexBonneReponseObject(1, "A");
  const indexBonneReponseDeux = IndexBonneReponseObject(2, "B");
  const indexBonneReponseTrois = IndexBonneReponseObject(3, "C");
  const arrayIndexBonneReponse = [
    {
      index: 1,
      value: question.proposition_une,
      display: getLabels("questions.form.proposition") + " A",
    },
    {
      index: 2,
      value: question.proposition_deux,
      display: getLabels("questions.form.proposition") + " B",
    },
    {
      index: 3,
      value: question.proposition_trois,
      display: getLabels("questions.form.proposition") + " C",
    },
  ];
  // Création de l'objet permettant la création d'un select pour les niveaux de question
  const NiveauQuestionObject = (niveau) => {
    return {
      value: niveau,
      display: getLabels("questions.select.niveau") + " " + niveau,
    };
  };
  // Implémentation des niveaux de question et de la liste
  const niveauQuestionUn = NiveauQuestionObject(1);
  const niveauQuestionTrois = NiveauQuestionObject(3);
  const arrayNiveauxQuestion = [niveauQuestionUn, niveauQuestionTrois];
  // Création d' lobjet permettant la création d'un select pour les types de question
  const TypeQuestionObject = (key, value, display) => {
    return {
      key: key,
      value: value,
      display: display,
    };
  };
  // Implémentation des types de question et de la liste
  const typeQuestionQcm = TypeQuestionObject(
    1,
    "QCM",
    getLabels("questions.select.qcmSelect")
  );
  const typeQuestionQcd = TypeQuestionObject(
    2,
    "OUVERTE",
    getLabels("questions.select.ouverteSelect")
  );
  const arrayTypesQuestion = [typeQuestionQcm, typeQuestionQcd];
  const [images, setImages] = useState([]);
  const toast = useRef(null);
  const fileUpload = useRef(null);
  const [urlsImages, setUrlsImages] = useState([]);
  const [ataAutoComplete, setAtaAutoComplete] = useState([]);
  const [atas, setAtas] = useState([]);

  useEffect(() => {
    blockMain();
    if (id) {
      //Ramène les infos de la question dont l'id est passé en paramètre
      axiosClient
        .get(`/questions/${id}`)
        .then(({ data }) => {
          setQuestion(data);
 // Vérification de la bonne réponse et sélection de l'option correspondante
 if (data.reponse === data.proposition_une) {
  setSelectedBonneReponse(data.proposition_une);
} else if (data.reponse === data.proposition_deux) {
  setSelectedBonneReponse(data.proposition_deux);
} else if (data.reponse === data.proposition_trois) {
  setSelectedBonneReponse(data.proposition_trois);
}

          if (data.proposition_une === null) {
            setTypeQuestionQCM(false);
          } else {
            setTypeQuestionQCM(true);
          }
          getUrlsImages();
          unblockMain();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      // Effet de chargement initial pour récupérer les chapitres depuis l'API
      axiosClient
        .get("/chapitres")
        .then(({ data }) => {
          unblockMain();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    }
    axiosClient.get("/cours/atas/getAll").then(({ data }) => {
      setAtaAutoComplete(Object.values(data));
      setAtas(Object.values(data));
    });
  }, [question.statut_id]);

  useEffect(() => {
    !id || modifier ? setConsultation(false) : setConsultation(true);
  }, [modifier]);

  useEffect(() => {
    //Ramène la liste des niveaux taxinomiqus
    axiosClient
      .get(`/niveauTax`)
      .then(({ data }) => {
        setNiveauTax(data.data);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
      });
  }, []);

  
  const getUrlsImages = () => {
    axiosClient.get(`ressources/urls/${id}`).then(({ data }) => {
      setUrlsImages(data);
    });
  };

  const handleBonneReponseChange = (event) => {
    const selectedValue = event.target.value;


    // Mettre à jour la bonne réponse dans question
    setSelectedBonneReponse(selectedValue);
    setQuestion({
      ...question,
      reponse: selectedValue,  // Mettre à jour la bonne réponse avec la valeur sélectionnée
    });
  };

  const handleNiveauChange = (event) => {
    handleInputChange("niveau", event.target.value);
  };

  const handleQuestionTypeChange = (event) => {
    setErrors(null);
    if (event.target.value === "QCM") {
      setTypeQuestionQCM(true);
      setQuestionType(event.target.value);
    } else {
      setTypeQuestionQCM(false);
      setQuestionType(event.target.value);
    }
    // Efface les données inutiles si le type de question change

    setQuestion({
      proposition_une: "",
      proposition_deux: "",
      proposition_trois: "",
      reponse: "",
    });
  };

  const modifierQuestion = () => {
    modifier === true ? setModifier(false) : setModifier(true);
  };

  const verifierQuestion = () => {
    question.verificateur = user.grade + " " + user.nom + " " + user.prenom;
    question.date_verif = dateDuJour();
    question.statut_id = 4;
    axiosClient
      .put(`/questions/${question.id}`, question)
      .then(() => {
        setNotification(getMessages("questions.verifiee.success"));
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
      });
  };

  const verifierVigilance = () => {
    question.statut_id = 6;
    axiosClient
      .post(`/questions/verifierVigilance/${question.id}`)
      .then(() => {
        setNotification(getMessages("questions.verifiee.success"));
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
      });
  };

  const validerQuestion = () => {
    question.valideur = user.grade + " " + user.nom + " " + user.prenom;
    question.date_validation = dateDuJour();
    question.statut_id = 2;
    axiosClient
      .put(`/questions/${question.id}`, question)
      .then(() => {
        setNotification(getMessages("questions.validee.success"));
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
      });
  };

  const refuserQuestion = () => {
    question.statut_id = 7;
    axiosClient
      .put(`/questions/${question.id}`, question)
      .then(() => {
        toast.current.show({
          severity: "info",
          summary: "Réussite",
          detail: getMessages("questions.refus.success"),
        });
        navigate("#");
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
      });
  };

  const handleInputChange = (field, value) => {
    setQuestion({ ...question, [field]: value });
  };

  const handleNiveauTaxChange = (e) => {
    handleInputChange("niveau_taxinomique_id", e.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (question.id) {
      axiosClient
        .put(`/questions/${question.id}`, question)
        .then(() => {
          setNotification(getMessages("questions.update.success"));
          navigate(`/questions/${question.id}`);
          modifierQuestion();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      // Ajouter le type de question à l'objet question
      const updatedQuestion = { ...question, type: questionType };
      updatedQuestion["libelle_cours"] = selectedCoursLibelle;
      axiosClient
        .post(`/questions`, updatedQuestion)
        .then((response) => {
          setNotification(getMessages("questions.create.success"));
          navigate(`/questions/${response.data.idQuestion}`);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  const fileUploadHandler = async () => {
    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append("images[]", images[i]);
    }
    formData.append("idQuestion", id);
    axiosClient
      .post("/ressources", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        toast.current.show({
          severity: "info",
          summary: "Réussite",
          detail: "Fichiers téléversés",
        });
        fileUpload.current.clear();
        getUrlsImages();
      })
      .catch((err) => {
        toast.current.show({
          severity: "warn",
          summary: "Echec",
          detail: `Les fichiers n'ont pas pu être téléversés. Contactez un administrateur avec le code erreur suivant : ${err}`,
        });
      });
  };

  const archiveQuestion = (questionId) => {
    confirmDialog({
      message: (
        <div className="flex flex-col justify-start gap-2">
          <div>
            <span>Vous êtes sur le point d'archiver cette question.</span>
          </div>
          <div>
            <span>
              Si cette question est actuellement en <b>vigilance</b>, les
              réponses du dernier test seront impactées.
            </span>
          </div>
          <div>
            <span>
              Êtes-vous sûr de vouloir effectuer cette action maintenant ?
            </span>
          </div>
        </div>
      ),
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: () => {
        axiosClient
          .delete(`/questions/${questionId}`)
          .then(() => {
            toast.current.show({
              severity: "info",
              summary: "Succès",
              detail: `La question a bien été archivée.`,
            });
            navigate("/questions"); // Redirect to the questions list after archiving
          })
          .catch((e) => {
            toast.current.show({
              severity: "error",
              summary: "Echec",
              detail: `L'archivage de la question a échoué. Contactez un administrateur avec le code erreur suivant : ${e}`,
              life: 20000,
            });
          });
      },
      acceptClassName: "bg-blue-500 text-white m-2 p-3",
      rejectClassName: "text-blue-500 m-2 p-3",
      acceptLabel: "Archiver",
      rejectLabel: "Annuler",
    });
  };

  //
  //
  //  Templates des composants primereact
  //
  //

  /**
   *
   * @param {*} file
   * @param {*} props
   * @returns
   */
  const itemTemplateFileUpload = (file, props) => {
    return (
      <div className="align-items-center flex flex-wrap">
        <div className="align-items-center flex" style={{ width: "40%" }}>
          <img src={file.objectURL} alt={file.name} width={100} />
          <span className="flex-column ml-3 flex text-left">{file.name}</span>
        </div>
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => props.onRemove()}
        />
      </div>
    );
  };

  /**
   *
   * @param {*} image
   * @returns
   */
  const imagesTemplates = (image) => {
    return (
      <div className="m-2 flex flex-col items-center text-center">
        <div className="flex h-32 w-32 content-center justify-center">
          <Image src={image} preview className="m-auto flex" />
        </div>
        {!Consultation && id && (
          <div className="flex flex-wrap justify-center">
            <Button
              icon="pi pi-times"
              rounded
              severity="danger"
              onClick={handleDeleteFile(image)}
            />
          </div>
        )}
      </div>
    );
  };

  /**
   *
   * @param {*} file
   * @param {*} props
   * @returns
   */
  const itemTemplate = (file, props) => {
    return (
      <div className="align-items-center flex flex-wrap">
        <div className="align-items-center flex" style={{ width: "40%" }}>
          <img src={file.objectURL} width={100} />
          <span className="flex-column align-items-center ml-3 flex self-center text-left">
            {file.name}
          </span>
        </div>
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => props.onRemove()}
        />
      </div>
    );
  };

  /**
   *
   * @param {*} image
   * @returns
   */
  const handleDeleteFile = (image) => {
    return () => {
      let arrayImage = image.split("&");
      let imageName = arrayImage[1].slice(-arrayImage[1].length + 5);
      axiosClient
        .delete(`/ressources/delete/${imageName}`)
        .then(() => {
          toast.current.show({
            severity: "info",
            summary: "Réussite",
            detail: "Fichier supprimé.",
          });
          getUrlsImages();
        })
        .catch((err) => {
          toast.current.show({
            severity: "warn",
            summary: "Echec",
            detail: `Le fichier n'a pas pu être supprimé. Contactez un administrateur avec le code erreur suivant : ${err}`,
          });
        });
    };
  };

  /**
   *
   * @param {*} observation
   * @returns
   */
  const timeLineTemplate = (observation) => {
    return (
      <>
        <div>
          <small>{observation.user}</small>
        </div>
        <div>
          <small>
            {new Date(observation.created_at).toLocaleDateString("fr")}
          </small>
        </div>
      </>
    );
  };

  /**
   *
   * @param {*} observation
   * @returns
   */
  const timeLineOppositeTemplate = (observation) => {
    console.log("observation");
    console.log(observation.observation);
    if (observation.observation.includes("Vigilance")) {
      let valueSubstr = 9;
      if (observation.observation.includes("vérifiée")) {
        valueSubstr = 18;
      }
      observation.observation = observation.observation.substr(
        -observation.observation.length,
        valueSubstr
      );
    }
    return <div className="max-w-xs">{observation.observation}</div>;
  };

  /**
   *
   * @param {*} observation
   * @returns
   */
  const getColorForObservation = (observation) => {
    switch (observation) {
      case "Création":
        return "#0EA5E9";
      case "Vérification":
        return "#06B6D4";
      case "Validation":
        return "#22C55E";
      case "Archivage":
        return "#374151";
      case "Refusée":
        return "#1F2937";
      case "Vigilance":
        return "#EF4444";
      case "Vigilance vérifiée":
        return "#F97316";
      case "Mise à jour":
        return "#22C55E";
    }
  };

  /**
   *
   * @param {*} observation
   * @returns
   */
  const timeLineCustomMarker = (observation) => {
    let color = getColorForObservation(observation.observation);
    return (
      <Avatar
        shape="circle"
        style={{
          backgroundColor: `${color}`,
          width: "1rem",
          height: "1rem",
        }}
      />
    );
  };

  const confirmRefus = () => {
    confirmDialog({
      message: getMessages("questions.refus.confirmation"),
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: () => refuserQuestion(),
      acceptClassName: "bg-blue-500 text-white m-2 p-3",
      rejectClassName: "text-blue-500 m-2 p-3",
      acceptLabel: "Refuser",
      rejectLabel: "Annuler",
    });
  };

  const searchAutocompleteAtas = (event) => {
    const filteredAts = atas.filter((ata) => ata.startsWith(event.query));
    setAtaAutoComplete(filteredAts);
  };

  return (
    <>
      <div className="heading">
        <h1 className="title">
          {id
            ? getLabels("questions.consulter.title") + question.numero_question
            : getLabels("questions.form.title")}
        </h1>
        <div className="ga-4 ml-auto flex">
          {question.actif && (
            <>
              <button
                onClick={() => archiveQuestion(question.id)}
                className="btn btn-gerer-questions"
              >
                Archiver
              </button>
              <button
                onClick={modifierQuestion}
                className="btn btn-gerer-questions"
              >
                {modifier === true
                  ? getLabels("common.btn.consult")
                  : getLabels("common.btn.update")}
              </button>
              {user.role_id == 4 &&
                (question.statut === "À vérifier" ||
                  question.statut === "Vigilance") && (
                  <>
                    <button
                      onClick={
                        question.statut === "Vigilance"
                          ? verifierVigilance
                          : verifierQuestion
                      }
                      className="btn btn-gerer-questions"
                    >
                      {getLabels("common.btn.verif")}
                    </button>
                    {!question.statut === "Vigilance" && (
                      <button
                        onClick={() => confirmRefus()}
                        className="btn btn-gerer-questions"
                      >
                        {getLabels("common.btn.refus")}
                      </button>
                    )}
                  </>
                )}
              {user.role_id == 5 &&
                (question.statut === "À valider" ||
                  question.statut === "Vigilance vérifiée") && (
                  <>
                    <button
                      onClick={validerQuestion}
                      className="btn btn-gerer-questions"
                    >
                      {getLabels("common.btn.valid")}
                    </button>
                    {question.statut === "À valider" && (
                      <button
                        onClick={() => confirmRefus()}
                        className="btn btn-gerer-questions"
                      >
                        {getLabels("common.btn.refus")}
                      </button>
                    )}
                  </>
                )}
            </>
          )}
        </div>
      </div>
      <Toast ref={toast} position="bottom-right" />
      <ConfirmDialog />
      <div>
        {errors && (
          <div className={"alert"}>
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
      </div>
      {id && (
        <div className="my-2">
          <Timeline
            value={question.observations}
            align="top"
            layout="horizontal"
            content={timeLineTemplate}
            opposite={timeLineOppositeTemplate}
            marker={timeLineCustomMarker}
          />
        </div>
      )}
      {!Consultation && id && (
        <div className="card">
          <FileUpload
            ref={fileUpload}
            name="images[]"
            multiple
            accept="image/*"
            maxFileSize={1000000}
            customUpload
            emptyTemplate={
              <p className="m-0">
                Cliquez/Glissez vos fichiers ici pour les téléverser.
              </p>
            }
            onRemove={(e) => setImages(e.file)}
            onSelect={(e) => setImages(e.files)}
            chooseLabel="Choisir"
            uploadLabel="Téléverser"
            cancelLabel="Tout supprimer"
            uploadHandler={fileUploadHandler}
            itemTemplateFileUpload={itemTemplateFileUpload}
            itemTemplate={itemTemplate}
          />
        </div>
      )}
      {urlsImages.length > 0 && (
        <div className="card">
          <Carousel
            value={urlsImages}
            numVisible={5}
            itemTemplate={imagesTemplates}
            showNavigators={false}
          />
        </div>
      )}
      <Form onSubmit={onSubmit}>
        {!Consultation && !id ? (
          <>
            <label htmlFor="ata" className="label-form">
              ATA
            </label>
            <AutoComplete
              value={question.ata}
              suggestions={ataAutoComplete}
              onChange={(e) => handleInputChange("ata", e.value)}
              completeMethod={searchAutocompleteAtas}
              forceSelection
              required
              style={{ display: "flex" }}
              inputId="ata"
              className="inputForm"
            />
          </>
        ) : (
          <>
            <label htmlFor="ata" className="label-form">
              ATA
            </label>
            <AutoComplete
              value={question.ata}
              suggestions={ataAutoComplete}
              onChange={(e) => handleInputChange("ata", e.value)}
              completeMethod={searchAutocompleteAtas}
              forceSelection
              required
              style={{ display: "flex" }}
              inputId="ata"
              disabled={Consultation}
              className="inputForm"
            />
          </>
        )}

        {/** Référence documentaire */}
        <Input
          value={question.reference_documentaire}
          setData={setQuestion}
          model={question}
          fieldModel={"reference_documentaire"}
          placeHolder={"questions.select.referenceDocumentaire"}
          className={`border ${
            errors && errors.reference_documentaire ? "input-error" : ""
          }`}
          label={"questions.form.referenceDocumentaire"}
          disabled={Consultation}
        />
        {/** Type question */}
        <Select
          value={questionType}
          optionKeyField={"key"}
          optionValueField={"value"}
          optionDisplayField={"display"}
          onChange={handleQuestionTypeChange}
          models={arrayTypesQuestion}
          fieldModel={"type_question"}
          label={"questions.form.typeQuestion"}
          disabled={Consultation || modifier}
        />
        {/** Numéro question */}
        <Input
          value={question.numero_question}
          setData={setQuestion}
          model={question}
          fieldModel={"numero_question"}
          placeHolder={"questions.form.numero_question"}
          className={`border ${
            errors && errors.numero_question ? "input-error" : ""
          }`}
          label={"questions.form.numero_question"}
          disabled={Consultation}
        />
        {/** Libellé question */}
        <Input
          value={question.libelle}
          setData={setQuestion}
          model={question}
          fieldModel={"libelle"}
          placeHolder={"questions.form.libelleQuestion"}
          className={`border ${errors && errors.libelle ? "input-error" : ""}`}
          label={"questions.form.libelleQuestion"}
          disabled={Consultation}
        />
        {/** QCM */}
        {typeQuestionQCM && (
          <>
            {/** Proposition une */}
            <Input
              value={question.proposition_une}
              setData={setQuestion}
              model={question}
              fieldModel={"proposition_une"}
              placeHolder={"questions.form.proposition_une"}
              className={`border ${
                errors && errors.proposition_une ? "input-error" : ""
              }`}
              label={"questions.form.proposition_une"}
              disabled={Consultation}
            />
            {/** Proposition deux */}
            <Input
              value={question.proposition_deux}
              setData={setQuestion}
              model={question}
              fieldModel={"proposition_deux"}
              placeHolder={"questions.form.proposition_deux"}
              className={`border ${
                errors && errors.proposition_deux ? "input-error" : ""
              }`}
              label={"questions.form.proposition_deux"}
              disabled={Consultation}
            />
            {/** Proposition trois */}
            <Input
              value={question.proposition_trois}
              setData={setQuestion}
              model={question}
              fieldModel={"proposition_trois"}
              placeHolder={"questions.form.proposition_trois"}
              className={`border ${
                errors && errors.proposition_trois ? "input-error" : ""
              }`}
              label={"questions.form.proposition_trois"}
              disabled={Consultation}
            />
            {/** Bonne réponse */}
            <Select
              value={selectedBonneReponse}
              optionKeyField={"index"}
              optionValueField={"value"} // Utilisation de la valeur textuelle de la proposition
              optionDisplayField={"display"}
              onChange={handleBonneReponseChange}
              models={arrayIndexBonneReponse}
              fieldModel={"bonne_reponse"}
              label={"questions.form.bonneReponse"}
              defaultSelectedLabel={"questions.select.reponse"}
              className={`border ${errors && errors.reponse ? "input-error" : ""}`}
              disabled={Consultation}
            />
          </>
        )}
        {/** QCR */}
        {!typeQuestionQCM && (
          <>
            {/** Réponse libre */}
            <TextArea
              value={question.reponse}
              setData={setQuestion}
              model={question}
              fieldModel={"reponse"}
              placeHolder={"questions.form.reponse"}
              className={`border ${
                errors && errors.reponse ? "input-error" : ""
              }`}
              label={"questions.form.reponse"}
              disabled={Consultation}
            />
          </>
        )}
        {/** Niveau de la question */}
        <Select
          value={question.niveau}
          optionKeyField={"value"}
          optionValueField={"value"}
          optionDisplayField={"display"}
          onChange={handleNiveauChange}
          models={arrayNiveauxQuestion}
          fieldModel={"niveau_question"}
          className={`${errors && errors.niveau ? "input-error" : ""}`}
          label={"questions.form.niveauQuestion"}
          defaultSelectedLabel={"questions.select.niveauSelect"}
          disabled={Consultation}
        />
        {/** Niveau taxinomique */}
        <Select
          value={question.niveau_taxinomique_id}
          optionKeyField={"id"}
          optionValueField={"id"}
          optionDisplayField={"niveau"}
          onChange={handleNiveauTaxChange}
          models={niveauTax}
          fieldModel={"cours"}
          className={`${
            errors && errors.niveau_taxinomique_id ? "input-error" : ""
          }`}
          label={"questions.form.niveauTaxinomique"}
          defaultSelectedLabel={"questions.select.niveauTaxinomique"}
          disabled={Consultation}
        />

        <div>
          {!Consultation && (
            <button className="btn">{getLabels("common.btn.save")}</button>
          )}
          <BackButton />
        </div>
      </Form>
    </>
  );
}

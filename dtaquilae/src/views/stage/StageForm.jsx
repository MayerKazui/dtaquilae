import { saveAs } from "file-saver";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { PickList } from "primereact/picklist";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import BackButton from "../../components/common/BackButton";
import { useStateContext } from "../../context/ContextProvider";
import { getLabels, getMessages } from "../../lang/langFunctions";
import { hasPermission } from "../../utils/accessControl";
import { Calendar } from "primereact/calendar";
import { addLocale } from "primereact/api";
import { Checkbox } from "primereact/checkbox";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

export default function StageForm() {
  const navigate = useNavigate();
  const toast = useRef(null);
  const { id } = useParams();
  const { setNotification, blockMain, unblockMain } = useStateContext();
  const [directeurs, setDirecteurs] = useState([]);
  const [adjoint, setAdjoint] = useState([]);
  const [formation, setFormation] = useState([]);
  const [errors, setErrors] = useState(null);
  const [PdfData, setPdfData] = useState(null);
  const [stage, setStage] = useState({
    id: null,
    libelle: "",
    debut: "",
    fin: "",
    formation_id: "",
    directeur_id: "",
    adjoint_id: "",
    selectedUsers: [],
    stagiaires: [],
  });
  const [source, setSource] = useState([]);
  const [target, setTarget] = useState([]);
  const [consultation, setConsultation] = useState(true);
  const [dates, setDates] = useState(null);
  const [expandedRows, setExpandedRows] = useState(null);
  const [expandedRowsStagiaire, setExpandedRowsStagiaire] = useState(null);
  const [expandedRowsModuleStagiaire, setExpandedRowsModuleStagiaire] = useState(null);
  const [testsStagiaire, setTestsStagiaire] = useState();
  const [moyennesModulesStagiaire, setMoyennesModulesStagiaire] = useState();
  const [reponsesStagiaires, setReponsesStagiaires] = useState();

  addLocale("fr", {
    firstDayOfWeek: 1,
    showMonthAfterYear: true,
    dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
    dayNamesShort: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"],
    dayNamesMin: ["D", "L", "M", "M", "J", "V", "S"],
    monthNames: [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre",
    ],
    monthNamesShort: [
      "jan",
      "fév",
      "mars",
      "avr",
      "mai",
      "juin",
      "jui",
      "août",
      "sept",
      "oct",
      "nov",
      "déc",
    ],
  });

  const toggleConsultation = () => {
    consultation === true ? setConsultation(false) : setConsultation(true);
  };

  const getStage = () => {
    axiosClient
      .get(`/stages/${id}`)
      .then(({ data }) => {
        setStage(data);
        setTarget(data.stagiaires);
        setDates([new Date(data.debut), new Date(data.fin)]);
      })
      .catch((err) => {
        console.error(err);
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
      });
  };

  const fetchStagiaire = () => {
    axiosClient
      .get(`/stages/stagiaire/${stage.debut}/${stage.fin}`)
      .then(({ data }) => {
        setSource(
          data.data.filter((dispos) => {
            return !stage.stagiaires.some((select) => select.id === dispos.id);
          })
        );
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
      });
  };
  const getDirecteurs = () => {
    axiosClient
      .get(`/stages/directeur/${stage.debut}/${stage.fin}/${stage.directeur_id}`)
      .then(({ data }) => {
        setDirecteurs(data.data);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
      });
  };
  const getAdjoint = () => {
    axiosClient
      .get(`/stages/adjoint/${stage.debut}/${stage.fin}/${stage.adjoint_id}`)
      .then(({ data }) => {
        setAdjoint(data.data);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
      });
  };
  const getFormation = () => {
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
  const handleSuppression = () => {
    axiosClient
      .delete(`/stages/${stage.id}`)
      .then(() => {
        setNotification(getMessages("stage.delete.success"));
        navigate(`/stages`); // Redirige vers la liste des stages après suppression
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 403) {
          setNotification(getMessages("stage.delete.errorWithTests"));
        } else {
          setNotification(getMessages("stage.delete.error"));
        }
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  useEffect(() => {
    blockMain();
    if (stage.debut && stage.fin) {
      fetchStagiaire();
      getDirecteurs();
      getAdjoint();
    }
    unblockMain();
  }, [stage.debut, stage.fin]);

  useEffect(() => {
    blockMain();
    if (id) {
      getStage();
      setConsultation(true);
    } else {
      setConsultation(false);
    }
    getFormation();
    unblockMain();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStage((prevStage) => ({
      ...prevStage,
      [name]: value,
    }));
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    // Logique de soumission du formulaire
    if (stage.id) {
      axiosClient
        .put(`/stages/${stage.id}`, stage)
        .then(() => {
          setNotification(getMessages("stage.update.success"));
          setConsultation(true);
          getStage();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/stages`, stage)
        .then((response) => {
          setNotification(getMessages("stage.create.success"));
          navigate(`/stages/${response.data.idStage}`);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };
  const onClickConforme = (testId) => {
    confirmDialog({
      message: (
        <div className="flex flex-col justify-start gap-2">
          <div>
            <span>Vous êtes sur le point de valider la conformité de ce test.</span>
          </div>
          <div>
            <span>Êtes-vous sûr de vouloir effectuer cette action maintenant ?</span>
          </div>
        </div>
      ),
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: () => lancerConforme(testId),
      acceptClassName: "bg-blue-500 text-white m-2 p-3",
      rejectClassName: "text-blue-500 m-2 p-3",
      acceptLabel: "Valider",
      rejectLabel: "Annuler",
    });
  };
  const lancerConforme = async (testId) => {
    toast.current.show({
      severity: "info",
      summary: "En cours",
      detail: "Validation de la conformité du test en cours.",
    });
    axiosClient.put(`/tests/conforme/${testId}`).then((response) => {
      toast.current.show({
        severity: "info",
        summary: "Terminé",
        detail: "Validation de la conformité du test terminée.",
      });
    });
  };

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

  const handleDownloadPDF = (stageId, testId) => {
    axiosClient
      .get(`/stages/CRResultat/${stageId}/test/${testId}/`)
      .then((response) => {
        const pdfData = response.data.pdfData;
        setPdfData(pdfData);
        const blob = new Blob([base64toBlob(pdfData)], {
          type: "application/pdf",
        });
        saveAs(blob, `Resultats_Stage_${testId}_Test_${testId}.pdf`);
      })
      .catch((error) => {
        console.error("Une erreur s'est produite:", error);
      });
  };

  const onChangePicklist = (e) => {
    setSource(e.source);
    setTarget(e.target);
    setStage((prevStage) => ({
      ...prevStage,
      stagiaires: e.target,
    }));
  };

  const itemPicklistTemplate = (item) => {
    return (
      <div className="align-items-center flex flex-wrap gap-3 p-2">
        <div className="flex-column flex flex-1 gap-2">
          <span className="font-bold">
            {item.nom} {item.prenom} - {item.matricule}
          </span>
        </div>
      </div>
    );
  };

  const handleChangeDates = (e) => {
    if (e.value[1]) {
      let dateDebut = e.value[0];
      let dateFin = e.value[1];
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
      };
      console.log(`Date de fin ${dateFin}`);
      setStage((prevStage) => ({
        ...prevStage,
        debut: formatDate(dateDebut),
        fin: formatDate(dateFin),
      }));
    }
    setDates(e.value);
  };

  const testDatatableReussiteTemplate = (rowData) => {
    let backgroundColor = rowData.reussite >= 75 ? "bg-green-500" : "bg-red-500";
    return (
      <span className={backgroundColor + " rounded-full px-2 text-white"}>
        {rowData.reussite} %
      </span>
    );
  };

  /*

   * Expansion du tableau des tests

  */

  const onRowExpandDatatableTests = (event) => {
    axiosClient.get(`/tests/stageConsultation/${event.data.id}`).then((response) => {
      setTestsStagiaire(response.data.data);
      let _expandedRows = {};
      stage.tests.forEach((s) => {
        if (s.id == event.data.id) _expandedRows[`${s.id}`] = true;
      });
      setExpandedRows(null);
      setExpandedRows(_expandedRows);
    });
  };

  const rowExpansionTemplate = (data) => {
    return (
      <DataTable
        value={testsStagiaire}
        emptyMessage={getLabels("common.table.noEntries")}
        dataKey="id"
        rowExpansionTemplate={rowExpansionStagiaireTemplate}
        onRowToggle={(e) => setExpandedRowsStagiaire(e.data)}
        onRowExpand={onRowExpandDatatableStagiaireTests}
        expandedRows={expandedRowsStagiaire}
        stripedRows
      >
        <Column expander style={{ width: "5rem" }} />
        <Column field="stagiaire" header={"Stagiaire"}></Column>
        <Column header={"Moyenne"} body={testDatatableReussiteTemplate}></Column>
      </DataTable>
    );
  };

  /*

   ! Fin expansion du tableau des tests

  */

  /*

   * Expansion du tableau des stagiaires

  */

  const onRowExpandDatatableStagiaireTests = (event) => {
    axiosClient.get(`/tests/calculer-moyenne-modules/${event.data.id}`).then((response) => {
      setMoyennesModulesStagiaire(response.data.modules);
      let _expandedRows = {};
      testsStagiaire.forEach((s) => {
        if (s.id_stagiaire == event.data.id_stagiaire) _expandedRows[`${s.id}`] = true;
      });
      setExpandedRowsStagiaire(null);
      setExpandedRowsStagiaire(_expandedRows);
    });
  };

  const rowExpansionStagiaireTemplate = (data) => {
    return (
      <DataTable
        value={moyennesModulesStagiaire}
        emptyMessage={getLabels("common.table.noEntries")}
        dataKey="module"
        rowExpansionTemplate={rowExpansionModuleTemplate}
        onRowToggle={(e) => setExpandedRowsModuleStagiaire(e.data)}
        onRowExpand={onRowExpandDatatableModuleStagiaire}
        expandedRows={expandedRowsModuleStagiaire}
        stripedRows
      >
        <Column expander style={{ width: "5rem" }} />
        <Column field="module" header={"Module"}></Column>
        <Column header={"Moyenne"} body={testDatatableReussiteTemplate}></Column>
      </DataTable>
    );
  };

  /*

    ! Fin expansion du tableau des stagiaires

  */

  /*

    * Expansion du tableau des modules

  */

  const onRowExpandDatatableModuleStagiaire = (event) => {
    axiosClient
      .get(`/reponses/stage/${event.data.test_id}/${event.data.questions_id}`)
      .then((response) => {
        setReponsesStagiaires(response.data.data);
        let _expandedRows = {};
        moyennesModulesStagiaire.forEach((s) => {
          console.log(event.data);
          if (s.module == event.data.module) _expandedRows[`${s.module}`] = true;
        });
        console.log(_expandedRows);
        setExpandedRowsModuleStagiaire(null);
        setExpandedRowsModuleStagiaire(_expandedRows);
      });
  };

  const reponseDatatableBodyTemplate = (rowData) => {
    return (
      <>
        <span>
          {rowData.reponse} : <Checkbox checked={rowData.is_good_answer} disabled />
        </span>
      </>
    );
  };

  const rowExpansionModuleTemplate = (data) => {
    return (
      <DataTable
        value={reponsesStagiaires}
        emptyMessage={getLabels("common.table.noEntries")}
        dataKey="id"
        selectionMode="single"
        onRowSelect={(e) => navigate(`/questions/${e.data.id_question}`)}
        stripedRows
      >
        <Column field="numero_question" header={"Numéro question"}></Column>
        <Column
          header={"Réponse"}
          body={reponseDatatableBodyTemplate}
          headerStyle={{ textAlign: "center" }}
        ></Column>
      </DataTable>
    );
  };

  /*

    ! Fin expansion du tableau des modules

  */

  return (
    <div>
      <h1 className="title">
        {id
          ? getLabels("stage.consulter.title").replace("%s", stage.libelle)
          : getLabels("stage.create.title")}
      </h1>
      {id && hasPermission("stage.update") && (
        <div className="heading">
          <button className="btn btn-flex-right btn-gerer-questions" onClick={toggleConsultation}>
            {consultation ? "Modifier" : "Consulter"}
          </button>
        </div>
      )}

      {consultation && (
        <>
          <div className="modern-form">
            <div>
              <label htmlFor="date_debut">{getLabels("stage.consulter.date_debut")}</label>
              <span id="date_debut">{stage.debut.split("-").reverse().join("/")}</span>
            </div>
            <div>
              <label htmlFor="date_fin">{getLabels("stage.consulter.date_fin")}</label>
              <span id="date_fin">{stage.fin.split("-").reverse().join("/")}</span>
            </div>
            <div>
              <label htmlFor="formation">{getLabels("stage.consulter.formation")}</label>
              <span id="formation">{stage.formation}</span>
            </div>
            <div>
              <label htmlFor="directeur">{getLabels("stage.consulter.directeur")}</label>
              <span id="directeur">{stage.directeur}</span>
            </div>
            {stage.adjoint_id && (
              <div>
                <label htmlFor="adjoint">{getLabels("stage.consulter.adjoint")}</label>
                <span id="adjoint">{stage.adjoint}</span>
              </div>
            )}
          </div>

          <div id="affichage" className="mt-3">
            <span className="text-xl font-bold">{getLabels("stage.consulter.stagiaires")}</span>
            <div className="card">
              <DataTable
                value={stage.stagiaires}
                emptyMessage={getLabels("common.table.noEntries")}
                stripedRows
              >
                <Column field="matricule" header={getLabels("users.fields.matricule")}></Column>
                <Column field="grade_abrege" header={getLabels("users.fields.grade")}></Column>
                <Column field="nom" header={getLabels("users.fields.nom")}></Column>
                <Column field="prenom" header={getLabels("users.fields.prenom")}></Column>
              </DataTable>
            </div>
            {/**
             * Liste des tests avec les résultats globaux et par stagiaire ainsi que les
             * récapitulatifs des réponses par stagiaire
             */}
            {stage.tests && (
              <>
                <ConfirmDialog />
                <span className="text-xl font-bold">{getLabels("stage.consulter.tests")}</span>
                <div className="card">
                  <Toast ref={toast} position="bottom-right" />
                  <DataTable
                    value={stage.tests}
                    emptyMessage={getLabels("common.table.noEntries")}
                    rowExpansionTemplate={rowExpansionTemplate}
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    onRowExpand={onRowExpandDatatableTests}
                    onRowSelect={(event) => navigate(`/tests/${event.data.id}`)}
                    dataKey="id"
                    selectionMode="single"
                    stripedRows
                    onRowCollapse={(e) => {
                      setExpandedRowsStagiaire(null);
                    }}
                  >
                    <Column expander style={{ width: "5rem" }} />
                    <Column
                      field="libelle"
                      header={getLabels("stage.consult.tests.datatable.nom")}
                    ></Column>
                    <Column
                      field="date"
                      header={getLabels("stage.consult.tests.datatable.date")}
                    ></Column>
                    <Column
                      field="reussite"
                      header={getLabels("stage.consult.tests.datatable.reussite")}
                      body={testDatatableReussiteTemplate}
                    ></Column>
                    <Column
                      header={getLabels("stage.consult.tests.datatable.pdf")}
                      body={(test) => (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleDownloadPDF(stage.id, test.id)}
                        >
                          {getLabels("stage.consult.tests.datatable.download")}
                        </button>
                      )}
                      style={{ textAlign: "center", width: "10rem" }}
                    ></Column>
                    <Column
                      header={getLabels("stage.consult.tests.datatable.conforme")}
                      body={(test) =>
                        !test.is_conforme && hasPermission("test.conforme") ? (
                          <button
                            className="btn btn-primary"
                            onClick={() => onClickConforme(test.id)}
                          >
                            {getLabels("stage.consult.tests.datatable.validerConforme")}
                          </button>
                        ) : null
                      }
                      style={{ textAlign: "center", width: "10rem", paddingLeft: "10rem" }}
                    ></Column>
                  </DataTable>
                </div>
              </>
            )}
            {consultation && id && hasPermission("stage.delete") && (
              <button className="btn btn-danger ml-4" onClick={handleSuppression}>
                {getLabels("common.btn.supprimer")}
              </button>
            )}
          </div>
        </>
      )}
      {!consultation && (
        <div>
          <div className="card animated fadeInDown">
            {errors && (
              <div className={"alert"}>
                {Object.keys(errors).map((key) => (
                  <p key={key}>{errors[key][0]}</p>
                ))}
              </div>
            )}
            <form onSubmit={onSubmit}>
              <label className="label-form">{getLabels("stage.fields.libelle")}</label>
              <input
                value={stage.libelle}
                onChange={(ev) => setStage({ ...stage, libelle: ev.target.value })}
                placeholder={getLabels("stage.fields.libelle")}
                required
              />
              <label className="label-form">
                Formation
                <select
                  id="listeformation"
                  name="formation_id"
                  value={stage.formation_id}
                  className="selectForm"
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionnez... </option>
                  {formation.map((option) => (
                    <option key={formation.id} value={option.id}>
                      {option.libelle}
                    </option>
                  ))}
                </select>
              </label>
              <label className="label-form">{getLabels("stage.fields.dates")}</label>
              <Calendar
                value={dates}
                onChange={handleChangeDates}
                minDate={new Date()}
                locale="fr"
                selectionMode="range"
                readOnlyInput
                hideOnRangeSelection
                dateFormat="dd/mm/yy"
                required
              />
              {stage.debut &&
                stage.fin && ( // Condition pour afficher la zone de glisser-déposer
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="label-form">
                        Directeur
                        <select
                          id="listedirecteur"
                          name="directeur_id"
                          value={stage.directeur_id}
                          className="selectForm"
                          onChange={handleChange}
                          required
                        >
                          <option value="">Sélectionnez... </option>
                          {directeurs.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.grade_abrege} {option.nom} {option.prenom}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="label-form">
                        Adjoint
                        <select
                          id="listeAdjoint"
                          name="adjoint_id"
                          value={stage.adjoint_id}
                          className="selectForm"
                          onChange={handleChange}
                        >
                          <option key="null" value="">
                            Sélectionnez...{" "}
                          </option>
                          {adjoint.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.grade_abrege} {option.nom} {option.prenom}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <PickList
                      dataKey="id"
                      source={source}
                      target={target}
                      onChange={onChangePicklist}
                      filter
                      filterBy="nom"
                      sourceHeader="Disponibles"
                      targetHeader="Sélectionnés"
                      sourceFilterPlaceholder="Chercher par le nom"
                      targetFilterPlaceholder="Chercher par le nom"
                      itemTemplate={itemPicklistTemplate}
                      className="w-4/5"
                    />
                  </div>
                )}

              <button className="btn">{getLabels("common.btn.save")}</button>
            </form>
          </div>
        </div>
      )}
      <BackButton />
    </div>
  );
}

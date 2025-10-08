import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { getLabels } from "../../lang/langFunctions";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { SelectButton } from "primereact/selectbutton";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const SaisieManuelle = () => {
  const { id } = useParams();
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const toast = useRef(null);
  const selectChoiceOptions = [
    { value: 1, display: "A" },
    { value: 2, display: "B" },
    { value: 3, display: "C" },
    { value: null, icon: "pi pi-times" },
  ];

  const columnsDatatableResponse = [
    {
      field: "numero_question",
      header: "Numéro de la question",
    },
    {
      field: "reponse",
      header: "Réponse",
      body: (rowData) => {
        if (rowData.proposition_une) {
          var valueSelectButton =
            rowData.reponse[0].reponse == null
              ? null
              : Number(rowData.reponse[0].reponse);
          return (
            <div className="card flex justify-center bg-gray-100">
              <SelectButton
                value={valueSelectButton}
                onChange={(e) => {
                  onResponseChange(e, rowData);
                }}
                itemTemplate={choiceTemplate}
                options={selectChoiceOptions}
              />
            </div>
          );
        } else {
          return (
            <div className="card flex items-center justify-center gap-4 bg-gray-100">
              <InputTextarea
                autoResize
                value={
                  rowData.reponse[0].reponse ? rowData.reponse[0].reponse : ""
                }
                className="m-0"
                onChange={(e) => {
                  onResponseChange(e, rowData);
                }}
              />
              <Checkbox
                onChange={(e) => {
                  onResponseQCDChange(e, rowData);
                }}
                pt={{
                  box: ({ props }) => ({
                    style: {
                      backgroundColor: props.checked ? "#3b82f6" : "#ff7373",
                    },
                  }),
                }}
                checked={rowData.reponse[0].is_good_answer}
              />
            </div>
          );
        }
      },
    },
  ];

  const onResponseChange = (event, rowData) => {
    const updatedQuestions = questions.map((question) => {
      if (question.id === rowData.id) {
        return {
          ...question,
          reponse: [
            { ...question.reponse[0], reponse: event.target.value },
            ...question.reponse.slice(1),
          ],
        };
      } else {
        return question;
      }
    });
    setQuestions(updatedQuestions);
  };

  const onResponseQCDChange = (event, rowData) => {
    const updatedQuestions = questions.map((question) => {
      if (question.id === rowData.id) {
        return {
          ...question,
          reponse: [
            { ...question.reponse[0], is_good_answer: event.checked },
            ...question.reponse.slice(1),
          ],
        };
      } else {
        return question;
      }
    });
    setQuestions(updatedQuestions);
  };

  const choiceTemplate = (option) => {
    if (option.icon) {
      return <i className={option.icon} style={{ height: "1rem" }}></i>;
    } else {
      return <span style={{ height: "1rem" }}>{option.display}</span>;
    }
  };

  const onRowSelect = (event) => {
    axiosClient
      .get(`/questions/test/saisieManuelle/${event.data.id}`)
      .then((response) => {
        setQuestions(response.data.data);
        setDialogVisible(true);
      });
  };

  const validateEntries = () => {
    axiosClient
      .post("/reponses/saisieManuelle", questions)
      .then((data) => {
        toast.current.show({
          severity: "info",
          summary: "Réussite",
          detail: "Les résultats ont été enregistrés avec succès.",
        });
        initalizeTests();
      })
      .catch((err) => {
        toast.current.show({
          severity: "warn",
          summary: "Echec",
          sticky: true,
          detail: `Impossible d'enregistrer les résultats. Contactez un administrateur avec le code erreur suivant : ${JSON.stringify(
            err.response.data.message.split("\n")[0]
          )}`,
        });
      });
  };

  const footerDialogTemplate = (
    <Button
      label="Valider"
      icon="pi pi-check"
      className="bg-[#3b82f6] text-white hover:bg-[#2563eb]"
      onClick={validateEntries}
    />
  );

  const initalizeTests = () => {
    axiosClient.get(`/tests/saisieManuelle/${id}`).then((response) => {
      setTests(response.data.data);
    });
  };

  const onClickAnalyse = () => {
    confirmDialog({
      message: (
        <div className="flex flex-col justify-start gap-2">
          <div>
            <span>
              Vous êtes sur le point de lancer l'analyse des questions pour ce
              test.
            </span>
          </div>
          <div>
            <span>
              Si des réponses sont manquantes pour un test, celles-ci seront
              comptabilisées comme <b>fausses</b>.
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
      accept: lancerAnalyse,
      acceptClassName: "bg-blue-500 text-white m-2 p-3",
      rejectClassName: "text-blue-500 m-2 p-3",
      acceptLabel: "Analyser",
      rejectLabel: "Annuler",
    });
  };

  const lancerAnalyse = async () => {
    toast.current.show({
      severity: "info",
      summary: "En cours",
      detail: "Analyse des résultats en cours.",
    });
    axiosClient
      .put(`/tests/analyse/${tests[0].questionnaire_id}/${true}`)
      .then((response) => {
        toast.current.show({
          severity: "info",
          summary: "Terminé",
          detail: "Analyse des résultats terminée.",
        });
      });
  };

  useEffect(() => {
    initalizeTests();
  }, []);

  return (
    <>
      {tests.length > 0 && (
        <>
          <ConfirmDialog />
          <div className="mb-2 flex justify-between">
            <span className="justify-center text-center text-2xl font-bold">
              Questionnaire : {tests[0].questionnaire}
            </span>
            <Button
              className="m-0 bg-[#3b82f6] text-white"
              onClick={onClickAnalyse}
            >
              {getLabels("common.btn.analyse")}
            </Button>
          </div>
          <div className="card">
            <Toast ref={toast} position="bottom-right" />
            <Dialog
              visible={dialogVisible}
              onHide={() => {
                if (!dialogVisible) return;
                setDialogVisible(false);
              }}
              style={{ width: "50vw" }}
              header={questions.length > 0 ? questions[0].stagiaire : ""}
              modal={false}
              position={"top-right"}
              footer={footerDialogTemplate}
            >
              {questions && (
                <DataTable value={questions} dataKey="id">
                  {columnsDatatableResponse.map((col) => (
                    <Column key={col.field} {...col} />
                  ))}
                </DataTable>
              )}
            </Dialog>
            <DataTable
              value={tests}
              dataKey="id"
              onRowSelect={onRowSelect}
              selectionMode="single"
              rowClassName={(data) => {
                return {
                  "bg-red-100": data.completed === "Incomplet",
                  "bg-green-100": true,
                };
              }}
            >
              <Column
                header={getLabels("users.fields.matricule")}
                field="stagiaire_matricule"
              />
              <Column
                header={getLabels("users.fields.grade")}
                field="stagiaire_grade"
              />
              <Column
                header={getLabels("users.fields.nom")}
                field="stagiaire_nom"
              />
              <Column
                header={getLabels("users.fields.prenom")}
                field="stagiaire_prenom"
              />
              <Column
                header={getLabels("tests.fields.etat")}
                field="completed"
              />
            </DataTable>
          </div>
        </>
      )}
    </>
  );
};

export default SaisieManuelle;

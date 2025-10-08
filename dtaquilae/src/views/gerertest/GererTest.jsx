import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { getLabels, getMessages } from "../../lang/langFunctions";
import Form from "../../components/common/Form";
import Select from "../../components/common/Select";
import Input from "../../components/common/Input";
import { useStateContext } from "../../context/ContextProvider";
import BackButton from "../../components/common/BackButton";
import { Calendar } from "primereact/calendar";
import { addLocale } from "primereact/api";
import { PickList } from "primereact/picklist";

export default function GererTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState({
    libelle: "",
    questionnaire_id: "",
    stage_id: "",
    is_counter_test: false,
    date: "",
  });
  const [questionnaires, setQuestionnaires] = useState([]);
  const [stages, setStages] = useState([]);
  const [errors, setErrors] = useState(null);
  const { setNotification, blockMain, unblockMain } = useStateContext();
  const [date, setDate] = useState("");
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [source, setSource] = useState([]); // Stagiaires disponibles
  const [target, setTarget] = useState([]); // Stagiaires sélectionnés

  addLocale("fr", {
    firstDayOfWeek: 1,
    showMonthAfterYear: true,
    dayNames: [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ],
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

  useEffect(() => {
    if (id) {
      axiosClient
        .get(`/tests/${id}`)
        .then(({ data }) => {
          setTest(data);
        })
        .catch((error) => {
          console.error("Failed to fetch test:", error);
        });
    }
  }, [id]);

  useEffect(() => {
    getStages();
    getQuestionnaires();
  }, []);

  const getStages = () => {
    blockMain();
    axiosClient
      .get(`/stages`)
      .then(({ data }) => {
        unblockMain();
        setStages(data.data);
      })
      .catch((err) => {
        blockMain();
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  const getQuestionnaires = (stageId, isCounterTest) => {
    if (!stageId) return;
    blockMain();
    axiosClient
      .get(`/questionnaires/sansTest/${stageId}/${isCounterTest}`)
      .then(({ data }) => {
        unblockMain();
        setQuestionnaires(data.data);
      })
      .catch((err) => {
        unblockMain();
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  const handleInputChange = (field, value) => {
    setTest({ ...test, [field]: value });
  };
  const handleQuestionnaireChange = (e) => {
    handleInputChange("questionnaire_id", e.target.value);
  };

  const handleStageChange = (e) => {
    handleInputChange("stage_id", e.target.value);

    stages.map((stage) => {
      if (stage.id == e.target.value) {
        setMinDate(new Date(stage.debut));
        setMaxDate(new Date(stage.fin));

        // Charger les stagiaires du stage
        if (test.is_counter_test) {
          setSource(
            stage.stagiaires.filter(
              (stagiaire) => !target.some((t) => t.id === stagiaire.id)
            )
          );
          setTarget([]);
        }
      }
    });

    // Charger les questionnaires après que le stage est sélectionné
    if (e.target.value) {
      getQuestionnaires(e.target.value, test.is_counter_test);
    }
  };

  const handleCounterTestChange = (e) => {
    const isChecked = e.target.checked;
    handleInputChange("is_counter_test", isChecked);

    // Si un stage est sélectionné, recharger les stagiaires
    if (test.stage_id) {
      const stage = stages.find((s) => s.id == test.stage_id);
      if (isChecked) {
        setSource(
          stage.stagiaires.filter(
            (stagiaire) => !target.some((t) => t.id === stagiaire.id)
          )
        );
        setTarget([]);
      } else {
        setSource([]);
        setTarget([]);
      }
      getQuestionnaires(test.stage_id, isChecked);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (test.is_counter_test) {
      axiosClient
        .post("/tests/storeCounterTest", {
          libelle: test.libelle,
          questionnaire_id: test.questionnaire_id,
          stage_id: test.stage_id,
          date: test.date,
          is_counter_test: test.is_counter_test,
          stagiaires: target.map((stagiaire) => stagiaire.id), // Stagiaires pour contre-test
        })
        .then(() => {
          setNotification(getMessages("test.create.success"));
          navigate("/tests");
        })
        .catch((err) => {
          if (err.response?.status === 422) {
            setErrors(err.response.data.errors);
          }
        });
    } else {
      axiosClient
        .post("/tests", {
          libelle: test.libelle,
          questionnaire_id: test.questionnaire_id,
          stage_id: test.stage_id,
          date: test.date,
        })
        .then(() => {
          setNotification(getMessages("tests.create.success"));
          navigate("/tests");
        })
        .catch((err) => {
          if (err.response?.status === 422) {
            setErrors(err.response.data.errors);
          }
        });
    }
  };

  return (
    <>
      <h1 className="title">
        {id ? getLabels("tests.update.title") : getLabels("tests.create.title")}
      </h1>

      <div>
        {errors && (
          <div className={"alert"}>
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
      </div>

      <Form onSubmit={handleSubmit}>
        <div className="flex">
          <label htmlFor="counter_test" className="label-form">
            {getLabels("tests.fields.is_counter_test")}
          </label>
          <input
            id="counter_test"
            type="checkbox"
            checked={test.is_counter_test}
            onChange={handleCounterTestChange}
            className="mb-1 ml-3 w-4"
          />
        </div>

        <Select
          value={test.stage_id}
          onChange={handleStageChange}
          label={"tests.fields.stage"}
          models={stages}
          defaultSelectedLabel={"tests.select.stage"}
          optionValueField="id"
          optionKeyField="id"
          optionDisplayField="libelle"
          fieldModel="stage"
          className={`border ${errors && errors.reponse ? "input-error" : ""}`}
          disabledDefault={false}
        />

        <Select
          value={test.questionnaire_id}
          onChange={handleQuestionnaireChange}
          label={"tests.fields.questionnaire"}
          models={questionnaires}
          defaultSelectedLabel={"tests.select.questionnaire"}
          optionValueField="id"
          optionKeyField="id"
          optionDisplayField="nom"
          fieldModel="questionnaire"
          className={`border ${errors && errors.reponse ? "input-error" : ""}`}
          disabledDefault={false}
        />

        <Input
          value={test.libelle}
          label={"tests.fields.libelle"}
          placeHolder={"tests.fields.libelle"}
          setData={setTest}
          model={test}
          fieldModel={"libelle"}
        />

        {test.is_counter_test && test.stage_id && (
          <div className="mt-4">
            <h2>Attribuer des stagiaires pour le contre test</h2>
            <PickList
              source={source}
              target={target}
              onChange={(e) => {
                setSource(e.source);
                setTarget(e.target);
                // Vous pouvez également mettre à jour test avec les stagiaires sélectionnés si nécessaire
                handleInputChange("selected_stagiaires", e.target);
              }}
              dataKey="id"
              sourceHeader="Stagiaires disponibles"
              targetHeader="Stagiaires sélectionnés"
              itemTemplate={(stagiaire) => (
                <div>
                  {stagiaire.grade_abrege} {stagiaire.nom} {stagiaire.prenom}
                </div>
              )}
              sourceStyle={{ height: "200px" }}
              targetStyle={{ height: "200px" }}
            />
          </div>
        )}

        {minDate && (
          <div id="dateTest">
            <label htmlFor={"date"} className="label-form">
              {getLabels("tests.fields.date")}
            </label>
            <Calendar
              value={date}
              onChange={(e) => {
                setTest((prevTest) => ({
                  ...prevTest,
                  date: new Date(
                    e.value.getTime() - e.value.getTimezoneOffset() * 60000
                  ),
                }));
                setDate(e.value);
              }}
              locale="fr"
              minDate={minDate}
              maxDate={maxDate}
              dateFormat="dd/mm/yy"
              required
              readOnlyInput
              inputId="date"
            />
          </div>
        )}

        <button className="btn" type="submit">
          {id ? getLabels("common.btn.update") : getLabels("common.btn.add")}
        </button>
        <BackButton />
      </Form>
    </>
  );
}

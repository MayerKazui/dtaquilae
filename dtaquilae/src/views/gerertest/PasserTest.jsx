import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../context/ContextProvider";
import { getLabels } from "../../lang/langFunctions";
import { Image } from "primereact/image";
import { Carousel } from "primereact/carousel";
import { Button } from "primereact/button";

const PasserTest = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [questionnaire, setQuestionnaire] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0); // en secondes
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [recordedAnswers, setRecordedAnswers] = useState([]);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [testId, setTestId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [shuffledPropositions, setShuffledPropositions] = useState([]);
  const { setNotification } = useStateContext();
  const toast = useRef(null);
  const fileUpload = useRef(null);
  const [urlsImages, setUrlsImages] = useState({});

  useEffect(() => {
    if (id) {
      axiosClient
        .get(`/questionnaires/testStagiaire/${id}`)
        .then(({ data }) => {
          setQuestionnaire(data);
          setLoading(false);

          const dureeQuestionnaire = parseInt(data.dureequestionnaire, 10);
          if (!isNaN(dureeQuestionnaire)) {
            setTimeRemaining(dureeQuestionnaire);
          } else {
            console.error(
              "Durée du questionnaire invalide:",
              data.dureequestionnaire
            );
          }

          const initialAnswers = data["0"].questions.map(
            (question) => question.reponseStagiaire?.reponse || null
          );
          const initialRecordedAnswers = data["0"].questions.map((question) =>
            question.reponseStagiaire && question.reponseStagiaire.reponse
              ? true
              : false
          );

          setAnswers(initialAnswers);
          setRecordedAnswers(initialRecordedAnswers);
          setTestId(id);
          setUserId(data.userId);

          // Fetch images for each question
          data["0"].questions.forEach((question) => {
            axiosClient
              .get(`ressources/urls/${question.id}`)
              .then(({ data }) => {
                setUrlsImages((prevUrlsImages) => ({
                  ...prevUrlsImages,
                  [question.id]: data,
                }));
              });
          });
        })
        .catch((error) => {
          console.error("Failed to fetch questionnaire:", error);
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    if (questionnaire && questionnaire["0"] && currentQuestionIndex >= 0) {
      const currentQuestion = questionnaire["0"].questions[currentQuestionIndex];
  
      if (currentQuestion) {
        const propositions = [
          { key: "proposition_une", value: currentQuestion.proposition_une },
          { key: "proposition_deux", value: currentQuestion.proposition_deux },
          { key: "proposition_trois", value: currentQuestion.proposition_trois },
        ];
  
        // Mélange une seule fois au chargement de la question
        setShuffledPropositions(propositions.sort(() => Math.random() - 0.5));
      }
    }
  }, [questionnaire, currentQuestionIndex]); // Le useEffect se déclenche lorsque 'questionnaire' ou 'currentQuestionIndex' changent

  useEffect(() => {
    let timer = null;
    if (timerRunning && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isTestStarted && timeRemaining === 0) {
      clearInterval(timer);
      setTimerRunning(false);
      handleFinishTest();
    }
    return () => clearInterval(timer);
  }, [timerRunning, timeRemaining]);

  const startTimer = () => {
    setTimerRunning(true);
    setIsTestStarted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionnaire["0"].questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleAnswerChange = (event) => {
    const { value } = event.target;
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = value;
    setAnswers(updatedAnswers);
  };

  const handleSaveAnswer = () => {
    const currentQuestionId =
      questionnaire["0"].questions[currentQuestionIndex].id;
    const answer = answers[currentQuestionIndex];

    if (answer === null || answer === "") {
      return;
    }

    axiosClient
      .post("/reponse", {
        reponses: { [currentQuestionId]: answer },
        test: { id: testId, stagiaire: userId },
      })
      .then((response) => {
        const updatedRecordedAnswers = [...recordedAnswers];
        updatedRecordedAnswers[currentQuestionIndex] = true;
        setRecordedAnswers(updatedRecordedAnswers);

        if (currentQuestionIndex < questionnaire["0"].questions.length - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        }
      })
      .catch((error) => {
        console.error("Erreur lors de l'enregistrement de la réponse:", error);
      });
  };

  const saveAllUnansweredQuestions = () => {
    const unansweredQuestions = answers
      .map((answer, index) => {
        if (answer === null) {
          return { [questionnaire["0"].questions[index].id]: null };
        }
        return null;
      })
      .filter((answer) => answer !== null);

    if (unansweredQuestions.length > 0) {
      axiosClient
        .post("/reponse", {
          reponses: Object.assign({}, ...unansweredQuestions),
          test: { id: testId, stagiaire: userId },
        })
        .then((response) => {
          console.log(
            "Toutes les réponses non répondues ont été enregistrées:",
            response.data
          );
        })
        .catch((error) => {
          console.error(
            "Erreur lors de l'enregistrement des réponses non répondues:",
            error
          );
        });
    }
  };

  const handleFinishTest = () => {
    saveAllUnansweredQuestions();

    axiosClient
      .post(`/tests/terminerTest/${testId}`)
      .then(() => {
        navigate(`/stagiaire/accueil`);
      })
      .catch((error) => {
        console.error("Erreur lors de l'enregistrement du test:", error);
      });
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!questionnaire) {
    return <p>Aucun questionnaire trouvé</p>;
  }

  const currentQuestion = questionnaire["0"].questions[currentQuestionIndex];
  const isMultipleChoice = currentQuestion.proposition_trois !== null;

  const isAnswerEmpty =
    answers[currentQuestionIndex] === null ||
    answers[currentQuestionIndex] === "";

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {!isTestStarted && (
        <div className="modern-form w-2/5 text-center">
          <h1 className="title mb-4 text-2xl font-bold">
            {getLabels("tests.fields.libelle")} : {questionnaire["0"].nomTest}
          </h1>
          <p>Durée du test : {formatTime(timeRemaining)}</p>
          <button
            className="btn btn-flex-center btn-gerer-questions mt-4 rounded bg-blue-500 px-4 py-2 text-white"
            onClick={startTimer}
          >
            Commencer le test
          </button>
          <p className="mt-4 font-bold text-red-600">
            IL EST NÉCESSAIRE DE RÉPONDRE À L'INTÉGRALITÉ DES QUESTIONS POUR POUVOIR COMPLÉTER LE TEST
          </p>
        </div>
      )}
      {isTestStarted && currentQuestion && (
        <div className="w-full max-w-4xl">
          <p className="mb-4 text-center text-lg font-semibold">
            Temps restant: {formatTime(timeRemaining)}
          </p>
          <div className="mb-4">
            <h3 className="text-xl font-bold">
              Question {currentQuestionIndex + 1}
            </h3>
            <h4 className="mb-2 text-lg">{currentQuestion.libelle}</h4>
          </div>
          {urlsImages[currentQuestion.id] && (
            <Carousel
              value={urlsImages[currentQuestion.id]}
              numVisible={1}
              itemTemplate={(image) => (
                <div className="m-2 flex flex-col items-center text-center">
                  <Image src={image} preview className="m-auto flex" />
                </div>
              )}
              showNavigators={false}
            />
          )}
          <div className="mb-4 rounded-lg border p-4">
            {!isMultipleChoice && (
              <textarea
                value={answers[currentQuestionIndex] || ""}
                onChange={handleAnswerChange}
                placeholder="Votre réponse..."
                className="w-full rounded border p-2"
              />
            )}
            {isMultipleChoice && currentQuestion && (
            <div className="flex flex-col space-y-2">
              {shuffledPropositions.map((proposition) => (
                <label
                  key={proposition.key}
                  className={`flex cursor-pointer items-center justify-center space-x-2 rounded border p-2 hover:bg-gray-200 ${
                    answers[currentQuestionIndex] === proposition.value
                      ? "bg-blue-200 hover:bg-blue-200"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="choice"
                    value={proposition.value}
                    checked={answers[currentQuestionIndex] === proposition.value}
                    onChange={handleAnswerChange}
                    className="hidden"
                  />
                  <span className="w-full text-center">{proposition.value}</span>
                </label>
              ))}
            </div>
          )}
          </div>

          <div className="mb-4 flex justify-between">
            <button
              className={`btn btn-prev rounded bg-gray-500 px-4 py-2 text-white ${
                currentQuestionIndex === 0 ? "invisible" : ""
              }`}
              onClick={handlePrevQuestion}
            >
              Précédent
            </button>
            <div className="flex flex-1 justify-center">
              <button
                className="btn btn-save rounded bg-blue-500 px-4 py-2 text-white"
                onClick={handleSaveAnswer}
                disabled={isAnswerEmpty}
              >
                Enregistrer la réponse
              </button>
            </div>
            <button
              className={`btn btn-next rounded bg-gray-500 px-4 py-2 text-white ${
                currentQuestionIndex === questionnaire["0"].questions.length - 1
                  ? "invisible"
                  : ""
              }`}
              onClick={handleNextQuestion}
            >
              Suivant
            </button>
          </div>
          <div className="flex flex-wrap justify-center">
            {isTestStarted &&
              questionnaire["0"].questions.map((question, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`m-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full ${
                    recordedAnswers[index] ? "bg-green-500" : "bg-gray-500"
                  }`}
                >
                  {index + 1}
                </div>
              ))}
          </div>
          <div className="mb-4 flex justify-center">
            {isTestStarted && recordedAnswers.every(answered => answered) && (
              <button
                className="btn btn-finish rounded bg-red-500 px-4 py-2 text-white"
                onClick={handleFinishTest}
              >
                Terminer le test
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PasserTest;

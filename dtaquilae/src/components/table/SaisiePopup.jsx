import React, { useState, useEffect } from "react";
import axiosClient from "../../axios-client";
import { getMessages } from "../../lang/langFunctions";
import { useStateContext } from "../../context/ContextProvider";

const SaisiePopup = ({
  stagiaire,
  questions,
  test,
  closePopup,
  refreshData,
}) => {
  const reponsesInitiales = test ? test.reponses : [];
  const { setNotification } = useStateContext();

  const [reponses, setReponses] = useState(() => {
    const initialReponses = {};
    questions.forEach((question) => {
      const reponse = reponsesInitiales.find(
        (r) => r.question_id === question.id
      );
      initialReponses[question.id] = reponse ? reponse.reponse : null;
    });
    return initialReponses;
  });

  const handleCheckboxChange = (questionId, value) => {
    setReponses((prevReponses) => ({
      ...prevReponses,
      [questionId]: value,
    }));
  };

  const handleTextChange = (questionId, value) => {
    setReponses((prevReponses) => ({
      ...prevReponses,
      [questionId]: value,
    }));
  };

  useEffect(() => {
    return () => {
      setReponses(() => {
        const initialReponses = {};
        questions.forEach((question) => {
          initialReponses[question.id] = null;
        });
        return initialReponses;
      });
    };
  }, [closePopup, questions]);

  const enregistrerReponses = () => {
    const dataToSend = {
      reponses,
      test: {
        ...test,
        stagiaire: stagiaire.id,
      },
    };
    axiosClient
      .post(`/reponse`, dataToSend)
      .then((response) => {
        setNotification(getMessages("reponse.update.success"));
        refreshData();
        closePopup();
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  const allQuestionsAnswered = reponsesInitiales.length === questions.length;

  return (
    <div className="popup">
      <h3 className="stagiaire-name">
        Saisie pour {stagiaire.prenom} {stagiaire.nom}
      </h3>
      <table>
        <thead>
          <tr>
            <th>Question</th>
            <th>Numéro</th>
            <th>Réponse</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => {
            const existingReponse = reponsesInitiales.find(
              (r) => r.question_id === question.id
            );
            return (
              <tr key={question.id}>
                <td>{question.libelle}</td>
                <td>{question.numero_question}</td>
                <td>
                  {existingReponse ? (
                    existingReponse.reponse || "Non répondu"
                  ) : question.proposition_une === null ? (
                    <input
                      type="text"
                      value={reponses[question.id] || ""}
                      onChange={(e) =>
                        handleTextChange(question.id, e.target.value)
                      }
                      className="textInput w-full"
                    />
                  ) : (
                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={reponses[question.id] === 1}
                          onChange={() => handleCheckboxChange(question.id, 1)}
                          className="smallCheck h-[20px] w-[20px]"
                        />
                        <span className="ml-2">A</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={reponses[question.id] === 2}
                          onChange={() => handleCheckboxChange(question.id, 2)}
                          className="smallCheck h-[20px] w-[20px]"
                        />
                        <span className="ml-2">B</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={reponses[question.id] === 3}
                          onChange={() => handleCheckboxChange(question.id, 3)}
                          className="smallCheck h-[20px] w-[20px]"
                        />
                        <span className="ml-2">C</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={reponses[question.id] === null}
                          onChange={() =>
                            handleCheckboxChange(question.id, null)
                          }
                          className="smallCheck h-[20px] w-[20px]"
                        />
                        <span className="ml-2">non répondu</span>
                      </label>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={closePopup}
          className="rounded bg-red-500 px-4 py-2 text-white"
        >
          Fermer
        </button>
        {!allQuestionsAnswered && (
          <button
            onClick={enregistrerReponses}
            className="rounded bg-blue-500 px-4 py-2 text-white"
          >
            Enregistrer
          </button>
        )}
      </div>
    </div>
  );
};

export default SaisiePopup;

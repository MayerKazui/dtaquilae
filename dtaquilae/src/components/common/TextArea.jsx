import { useId } from "react";
import { getLabels } from "../../lang/langFunctions";

/**
 * Méthode héritée du composant parent permettant d'affecter les valeurs de textArea dans le model de la page
 * @callback setData
 */

/**
 * Composant textArea permettant d'éviter la répétition de 3 instances dans une même page pour la consultation/création/modification
 *
 * @param {*} value - La valeur affectée/affectable
 * @param {setData} setData - La méthode d'affectation de la valeur
 * @param {Object} model - Le model ciblé
 * @param {string} fieldModel - Le champd du modèle ciblé
 * @param {string} [className=null] - Le CSS supplémentaire
 * @param {string} [placeholder=null] - Le placeholder
 * @param {string} [label=null] - Le label affecté au textArea
 * @param {boolean} [disabled=false] - L'activation/désactivation du champ
 * @returns Le composant textArea
 */
function TextArea({
  value,
  setData,
  model,
  fieldModel,
  className = null,
  placeHolder = null,
  label = null,
  disabled = false,
}) {
  const idTextArea = useId() + "-" + fieldModel;
  const idDiv = useId() + "-" + fieldModel;

  const handleTextAreaChange = (field, value) => {
    setData({ ...model, [field]: value });
  };

  return (
    <>
      <div id={idDiv}>
        {label && (
          <label htmlFor={idTextArea} className="label-form">
            {getLabels(label)}
          </label>
        )}
        <textarea
          id={idTextArea}
          value={value}
          className={className}
          placeholder={getLabels(placeHolder)}
          onChange={(e) => {
            handleTextAreaChange(fieldModel, e.target.value);
          }}
          disabled={disabled}
        />
      </div>
    </>
  );
}

export default TextArea;

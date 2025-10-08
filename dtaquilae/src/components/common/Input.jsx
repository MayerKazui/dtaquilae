import { useId } from "react";
import { getLabels } from "../../lang/langFunctions";

/**
 * Méthode héritée du composant parent permettant d'affecter les valeurs de l'input dans le model de la page
 * @callback setData
 */

/**
 * Composant input permettant d'éviter la répétition de 3 instances dans une même page pour la consultation/création/modification
 *
 * @param {*} value - La valeur affectée/affectable
 * @param {setData} setData - La méthode d'affectation de la valeur
 * @param {Object} model - Le model ciblé
 * @param {string} fieldModel - Le champd du modèle ciblé
 * @param {string} [className=null] - Le CSS supplémentaire
 * @param {string} [placeholder=null] - Le placeholder
 * @param {string} [label=null] - Le label affecté à l'input
 * @param {string} [type="text"] - Le type de l'input
 * @param {boolean} [disabled=false] - L'activation/désactivation du champ
 * @returns Le composant input
 */
function Input({
  value,
  setData,
  model,
  fieldModel,
  className = null,
  placeHolder = null,
  label = null,
  type = "text",
  disabled = false,
}) {
  const idInput = useId() + "-" + fieldModel;
  const idDiv = useId() + "-" + fieldModel;

  const handleInputChange = (field, value) => {
    setData({ ...model, [field]: value });
  };

  return (
    <>
      <div id={idDiv}>
        {label && (
          <label htmlFor={idInput} className="label-form">
            {getLabels(label)}
          </label>
        )}
        <input
          id={idInput}
          type={type}
          value={value}
          className={className ? "inputForm " + className : "inputForm"}
          placeholder={getLabels(placeHolder)}
          onChange={(e) => {
            handleInputChange(fieldModel, e.target.value);
          }}
          disabled={disabled}
        />
      </div>
    </>
  );
}

export default Input;

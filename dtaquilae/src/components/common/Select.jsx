import { useId } from "react";
import { getLabels } from "../../lang/langFunctions";

/**
 * Méthode héritée du composant parent permettant d'affecter l'option choisit
 * @callback onChange
 */

/**
 *
 * @param {*} value - La valeur affectée/affectable
 * @param {string} optionValueField - La valeur utilisée pour chaque option (se doit d'être une variable du model)
 * @param {string} optionKeyField - La valeur utilisée comme clé pour chaque option (se doit d'être une variable !unique du model)
 * @param {string} optionDisplayField - La valeur utilisée pour l'affichage de chaque option (se doit d'être une variable du model)
 * @param {onChange} onChange - La méthode d'affectation de la valeur
 * @param {[Object]} models - La liste des models utilisés
 * @param {string} fieldModel - Chaîne de caractère utilisée pour la création d'id unique
 * @param {string} [label=null] - Le label affecté au select
 * @param {string} [defaultSelectedLabel=null] -L'affichage de l'option par défaut
 * @param {*} [defaultSelectedValue=null] - La valeur de l'option par défaut
 * @param {string} [className=""] - Le CSS supplémentaire
 * @param {boolean} [disabledDefault=true] - Désactivation/Activation de l'option par défaut
 * @param {boolean} [disabled=false] - Désactivation/Activation du select
 * @returns
 */
function Select({
  value,
  optionValueField,
  optionKeyField,
  optionDisplayField,
  onChange,
  models,
  fieldModel,
  label = null,
  defaultSelectedLabel = null,
  defaultSelectedValue = null,
  className = "",
  disabledDefault = true,
  disabled = false,
}) {
  const idSelect = useId() + "-" + fieldModel;
  const idDiv = useId() + "-" + fieldModel;

  function getOption(model) {
    let optionKey;
    let optionValue;
    let optionDisplay;
    for (const [key, value] of Object.entries(model)) {
      switch (key) {
        case optionKeyField:
          optionKey = value;
        case optionValueField:
          optionValue = value;
        case optionDisplayField:
          optionDisplay = value;
        default:
          break;
      }
    }
    return (
      <>
        <option key={optionKey} value={optionValue}>
          {optionDisplay}
        </option>
      </>
    );
  }

  return (
    <>
      <div id={idDiv}>
        {label && (
          <label htmlFor={idSelect} className="label-form">
            {getLabels(label)}
          </label>
        )}
        <select
          id={idSelect}
          name={"select-" + fieldModel}
          value={value}
          className={className ? "selectForm " + className : "selectForm"}
          onChange={onChange}
          disabled={disabled}
        >
          {defaultSelectedLabel && (
            <option
              value={defaultSelectedValue}
              selected
              disabled={disabledDefault}
            >
              {getLabels(defaultSelectedLabel)}
            </option>
          )}
          {models.map((model) => getOption(model))}
        </select>
      </div>
    </>
  );
}

export default Select;

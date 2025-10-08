import { useId } from "react";

/**
 *
 * @param {Object} props - Contient les données (onSubmit) affectées directement dans le composant :
 ** <Form onSubmit={callback}>
 *   ...
 *  </Form>
 * et les balises enfants :
 * <Form onSubmit={callback}>
 ** <div>
 **    <span>children</span>
 ** </div>
 * </Form>
 *
 * @returns
 */
function Form(props) {
  const idForm = useId();
  const idDiv = useId();

  return (
    <div id={idDiv} className="modern-form">
      <form id={idForm} onSubmit={props.onSubmit}>
        {props.children}
      </form>
    </div>
  );
}

export default Form;

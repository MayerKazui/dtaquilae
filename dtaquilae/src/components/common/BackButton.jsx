import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="btn btn-delete ml-1"
      onClick={() => {
        navigate(-1);
      }}
    >
      Retour
    </button>
  );
};

export default BackButton;

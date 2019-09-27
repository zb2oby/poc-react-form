import {isNotEmpty} from "./ValidationUtils";

export const rules = {
    nom: [
    {
        key: "nom_invalide",
        message: "ce nom est impossible",
        isValid: (value) => (value !== "boubee")
    },
    {
        key: "nom_vide",
        message: "le nom est obligatoire",
        isValid: (value) => (isNotEmpty(value))
    }
],
    prenom: [
    {
        key: "prenom_vide",
        message: "le prénom est obligatoire",
            isValid: (value) => (isNotEmpty(value))
        }
    ],
}


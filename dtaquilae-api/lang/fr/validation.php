<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => 'Le champ :attribute doit être accepté.',
    'accepted_if' => 'Le champ :attribute doit être accepté si :other est égal à :value.',
    'active_url' => 'Le champ :attribute doit être une URL valide.',
    'after' => 'Le champ :attribute doit être une date après :date.',
    'after_or_equal' => 'Le champ :attribute doit être une date après ou égale à :date.',
    'alpha' => 'Le champ :attribute ne doit contenir que des lettres.',
    'alpha_dash' => 'Le champ :attribute ne doit conteir que des lettres, des tirets, des chiffres ou des underscores.',
    'alpha_num' => 'Le champ :attribute ne doit contenir que des lettres et des chiffres.',
    'array' => 'Le champ :attribute doit être une liste.',
    'ascii' => 'Le champ :attribute ne contenir que des caractères alaphanumériques mono-bit et des symboles.',
    'before' => 'Le champ :attribute doit être une date avant :date.',
    'before_or_equal' => 'Le champ :attribute doit être une date avant ou égale à :date.',
    'between' => [
        'array' => 'Le champ :attribute doit comprendre entre :min et :max objets.',
        'file' => 'Le champ :attribute doit faire entre :min et :max kilobytes.',
        'numeric' => 'Le champ :attribute doit être comprit entre :min et :max.',
        'string' => 'Le champ :attribute dont contenir entre :min et :max caractères.',
    ],
    'boolean' => 'Le champ :attribute doit être vrai ou faux.',
    'confirmed' => 'Le champ ":attribute" de confirmation ne correspond pas.',
    'current_password' => 'Le mot de passe est incorrect.',
    'date' => 'Le champ :attribute doit être une date valide.',
    'date_equals' => 'Le champ :attribute doit être une date égale à :date.',
    'date_format' => 'Le champ :attribute doit être au format suivant : :format.',
    'decimal' => 'Le champ :attribute doit avoir :decimal décimales.',
    'declined' => 'Le champ :attribute doit être refusé.',
    'declined_if' => 'Le champ :attribute doit êre refusé quand la valeur de :other est :value.',
    'different' => 'Le champ :attribute et :other doivent être différents.',
    'digits' => 'Le champ :attribute doit avoir :digits chiffres.',
    'digits_between' => 'Le champ :attribute doit comprendre entre :min et :max chiffres.',
    'dimensions' => 'Le champ :attribute a une résolution invalide.',
    'distinct' => 'Le champ :attribute a une valeur en doublon.',
    'doesnt_end_with' => 'Le champ :attribute ne doit pas finir avec l\'une des valeurs suivantes : :values.',
    'doesnt_start_with' => 'Le champ :attribute ne doit pas commencer avec l\'une des valeurs suivantes : :values.',
    'email' => 'Le champ :attribute dooit être une adresse mail valide.',
    'ends_with' => 'Le champ :attribute doit terminer avec l\'une des valeurs suivantes : :values.',
    'enum' => 'L\'objet :attribute sélectionné est invalide.',
    'exists' => 'L\'objet :attribute sélectionné est invalide.',
    'file' => 'Le champ :attribute doit être un fichier.',
    'filled' => 'Le champ :attribute doit avoir une valeur.',
    'gt' => [
        'array' => 'La liste :attribute doit contenir plus de :value objets.',
        'file' => 'Le fichier :attribute doit avoir une taille supérieure à :value kilobytes.',
        'numeric' => 'Le nombre :attribute doit être supérieur :value.',
        'string' => 'Le texte :attribute doit contenir plus de :value caractères.',
    ],
    'gte' => [
        'array' => 'La liste :attribute doit contenir :value objets ou plus.',
        'file' => 'Le fichier :attribute doit avoir une taille égale ou supérieure à :value kilobytes.',
        'numeric' => 'Le nombre :attribute doit êre égale ou supérieur à :value.',
        'string' => 'Le texte :attribute doit contenir :value caractères ou plus.',
    ],
    'image' => 'Le champ :attribute doit être une image.',
    'in' => 'L\'attribut :attribute selectionné est invalide.',
    'in_array' => 'Le champ :attribute doit exister dans :other.',
    'integer' => 'Le champ :attribute doit être un entier.',
    'ip' => 'Le champ :attribute must be a valid IP address.',
    'ipv4' => 'Le champ :attribute doit être une adresse IPV4 valide.',
    'ipv6' => 'Le champ :attribute doit être une adresse IPV6 valide.',
    'json' => 'Le champ :attribute doit être un texte JSON valide.',
    'lowercase' => 'Le texte :attribute doit être en miniscule.',
    'lt' => [
        'array' => 'La liste :attribute doit contenir moins de :value objets.',
        'file' => 'Le fichier :attribute doit avoir une taille inférieure à :value kilobytes.',
        'numeric' => 'Le nombre :attribute doit être inférieur à :value.',
        'string' => 'Le texte :attribute doit contenir moins de :value caractères.',
    ],
    'lte' => [
        'array' => 'La liste :attribute ne doit pas contenir plus de :value objets.',
        'file' => 'Le fichier :attribute doit avoir une taille inférieure ou égale à :value kilobytes.',
        'numeric' => 'Le nombre :attribute doit être inférieur ou égale à :value.',
        'string' => 'Le texte :attribute ne doit pas contenir plus de :value caractères.',
    ],
    'mac_address' => 'Le champ :attribute doit être une adresse MAC valide.',
    'max' => [
        'array' => 'La liste :attribute ne doit pas contenir plus :max items.',
        'file' => 'Le fichier :attribute ne doit pas dépasser :max kilobytes.',
        'numeric' => 'Le nombre :attribute ne doit pas dépasser :max.',
        'string' => 'Le texte :attribute ne doit pas dépasser :max caractères.',
    ],
    'max_digits' => 'Le nombre :attribute ne doit pas dépasser :max décimales.',
    'mimes' => 'Le fichier :attribute doit avoir l\'un des types suivants : :values.',
    'mimetypes' => 'Le fichier :attribute doit avoir l\'un des types suivants : :values.',
    'min' => [
        'array' => 'La liste :attribute doit contenir au moins :min objets.',
        'file' => 'Le fichier :attribute doit faire au moins :min kilobytes.',
        'numeric' => 'Le nombre :attribute doit être supérieur à :min.',
        'string' => 'Le texte :attribute doit contenir au moins :min caractères.',
    ],
    'min_digits' => 'Le nombre :attribute doit avoir au moins :min décimales.',
    'missing' => 'Le champ :attribute ne doit pas être rensigné.',
    'missing_if' => 'Le champ :attribute ne doit pas être renseigné quand la valeur de :other est :value.',
    'missing_unless' => 'Le champ :attribute ne doit pas être renseigné tant que la valeur de :other est :value.',
    'missing_with' => 'Le champ :attribute ne doit pas être renseigné tant que l\'une des valeurs suivantes : :values est renseigné.e',
    'missing_with_all' => 'Le champ :attribute ne doit pas être renseigné tant que les valeurs suivantes : :values sont renseignés.',
    'multiple_of' => 'Le champ :attribute doit être un multiple de :value.',
    'not_in' => 'Le champ :attribute est invalide.',
    'not_regex' => 'Le champ :attribute n\'est pas au bon format.',
    'numeric' => 'Le champ :attribute doit être un nombre.',
    'password' => [
        'letters' => 'Le champ :attribute doit contenir au moins une lettre.',
        'mixed' => 'Le champ :attribute doit contenir au moins une majuscule et une miniscule.',
        'numbers' => 'Le champ :attribute doit contenir au moins un chiffre.',
        'symbols' => 'Le champ :attribute doit contenir au moins un caractère spécial.',
        'uncompromised' => 'Le mot de passe du champ :attribute apparaît comme ayant fuité. Merci d\'en choisir un différent.',
    ],
    'present' => 'Le champ :attribute doit être renseigné.',
    'prohibited' => 'Le champ :attribute est interdit.',
    'prohibited_if' => 'Le champ :attribute est interdit tant que la valeur de :other est :value.',
    'prohibited_unless' => 'Le champ :attribute tant que :other à l\'une des valeurs suivantes : :values.',
    'prohibits' => 'Le champ :attribute interdit de renseigner :other.',
    'regex' => 'Le champ :attribute n\'est pas au bon format.',
    'required' => 'Le champ :attribute est obligatoire.',
    'required_array_keys' => 'La liste :attribute doit contenir des entrées pour : :values.',
    'required_if' => 'Le champ :attribute est obligatoire quand la valeur de :other est :value.',
    'required_if_accepted' => 'Le champ :attribute est obligatoire quand :other est accepté.',
    'required_unless' => 'Le champ :attribute est obligatoire tant :other a l\'une des valeurs suivantes : :values.',
    'required_with' => 'Le champ :attribute est obligatoire quand :values est renseigné.',
    'required_with_all' => 'Le champ :attribute est obligatoire quand :values sont renseignés.',
    'required_without' => 'Le champ :attribute est obligatoire quand :values n\'est pas renseigné.',
    'required_without_all' => 'Le champ :attribute est obligatoire quand aucuns des ces champs : :values ne sont renseignés.',
    'same' => 'Le champ :attribute doit correspondre à :other.',
    'size' => [
        'array' => 'La liste :attribute doit contenir :size objets.',
        'file' => 'Le fichier :attribute doit faire :size kilobytes.',
        'numeric' => 'Le nombre :attribute doit avoir une taille de :size.',
        'string' => 'Le texte :attribute doit contenir :size caractères.',
    ],
    'starts_with' => 'Le champ :attribute doit commencer par l\'une des valeurs suivantes : :values.',
    'string' => 'Le champ :attribute doit être une chaîne de caractères.',
    'timezone' => 'Le champ :attribute doit être une une timezone valide.',
    'unique' => 'Le champ :attribute a déjà été prit.',
    'uploaded' => 'Le fichier :attribute n\'a pas pû être téléchargé.',
    'uppercase' => 'Le champ :attribute doit être en majuscule.',
    'url' => 'Le champ :attribute doit être une URL valide.',
    'ulid' => 'Le champ :attribute doit être un ULID valide.',
    'uuid' => 'Le champ :attribute doit être un UUID valide.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [],

];

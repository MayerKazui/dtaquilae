# Préparation de l'environnement
## PostgreSQL
- Une fois l'installation terminée, lancer PgAdmin4 et créer une nouvelle base

## Wamp
- Pour gagner un peu de mémoire vous pouvez désactiver MySQL ainsi que MariaDB. Pour cela il faut se rendre dans les services actifs de windows (la flèches pointant vers le haut à droit dans la barre des tâches), clic-droit sur wamp > Paramètres Wamp > Autoriser MySQL/MariaDB. Chaque manipulation entrainera un redémarrage de tous les services wamp.
- Choisir la bonne version de PHP. On se rend sur la même icone, clic-gauche > PHP > Version > 8.2.0
- Activer les extensions `pgsql` et `pdo_pgsql`. On se rend à nouveau sur la même icone, clic-gauche > PHP > php.ini > php.ini PHP 8.2.0. L'éditeur de texte que vous avez choisit lors de l'installation s'ouvre. Faites une recherche sur 'pgsql' et décommentez les lignes `extension=pdo_pgsql` et `extension=pgsql`
- Redémarrer les services


# Configuration projet
## Backend
- Créer un fichier `.env` à partir du modèle présent dans `.env.example` (si nécessaire modifier le nom de la base par le nom de la base que vous avez créé plus tôt)
- Générer une nouvelle clé d'application avec la commande suivante : `php artisan key:generate`
- Peupler la base avec la commande suivante : `php artisan migrate --seed`
- Lancement du projet avec la commande suivante : `php artisan serve`


# Commandes importantes
## `php artisan make:controller Api/**/ModelNameController --api --resource --requests --model=FolderName/**/ModelName`
C'est la principale commande permettant de créer toutes les classes nécessaires à l'API.
- `--api` : Permet de d'optimiser les méthodes de base (CRUD) utilisées notament dans `api.php` avec `Route::apiResources` en privilégiant le format JSON
- `--resource` : Permet de créer le controller en vue d'être utilisé comme resources (Méthodes CRUD)
- `--requests` : Permet de créer les fichiers de requests associés
- `--model=` : Permet de préciser un model sur lequel sera basé les différents fichiers créé ci-dessus. Si le model (et l'arborescence) n'existe pas, il sera créé. Exemple : `--model=Api/Test/TestModel` créera dans le dossier `Models` l'arborescence suivante : `Models/Api/Test/TestModel.php`

## `php artisan make:resource FolderName/**/ModelNameResource --model=FolderName/**/ModelName`
C'est la seconde commande qui permet de créer la couche servant à transformer les données "brutes" en format JSON en suivant les conventions des APIs RESTful


[French] [Experimental]

*__Disclaimer__ Étant donné que c'est la première fois que j'utilise Docker, il se peut que les fichiers soient mal configurés… Néanmoins, j'ai réussi à monter les images et démarrer les conteneurs sur mon PC. Merci pour votre compréhension.*

<br><br>

# O'clock — Text technique Full Stack

## Création du jeu Memory

> Front-end : HTML + SASS + JS (_Vanilla_)  
> Back-end : Node  
> Base de données : SQLite  
> Serveur : Express  
> Déploiement : Docker

Les consignes du test sont à retrouver dans le fichier [todo.pdf](./docs/todo.pdf).

## Installation

Cloner le repertoire ou le copier sur votre PC et se rendre à la racine du projet. Ensuite, lancer Yarn pour installer les dépendances.

```bash
git clone https://github.com/Monkfish-FR/memory.git
cd memory
```

### Installation des dépendances

Pour le _frontend_ :

```bash
cd client
yarn install
```

Pour le _backend_ :

```bash
cd server
yarn install
```

## Utilisation

### Lancer le jeu

Pour exécuter l'application et jouer au super jeu __Memory__, se rendre dans le dossier `server` puis utiliser la commande :

```bash
cd server
yarn dev
```

Ceci lancera simultanément le serveur et le client (voir la section `scripts` du fichier `server/package.json`).

L'application est servie sur http://localhost:3000 ; le serveur s'exécute sur http://localhost:8080.

### Configuration

Configurer le jeu pour votre propre plaisir :
- _Vous préférez un mode zen ?_ Optez pour une grille plus facile et un temps plus long ;
- _Ou un mode NIGHTMARE DE LA MUERTE_ ? Choisissez la grille la plus difficile et oser la résoudre en moins d'une minute (ou moins si vous êtres vraiment balaise !).

Le tableau ci-dessous décrit les variables disponibles dans le fichier `./src/client/settings.json` :

| Variable     | Type   | Description                                                           |
|--------------|--------|-----------------------------------------------------------------------|
| __game__     |        |                                                                       |
| rows         | number | Le nombre de lignes de la grille (zen: 2, nightmare : 4)              |
| cols         | number | Le nombre de colonnes de la grille (zen: 2, nightmare : 9)            |
| __cards__    |        |                                                                       |
| number       | number | Le nombre de cartes composant votre sprite**                          |
| description  | array  | La description de votre sprite : contient tous les éléments avec, pour chacun, son nom et sa position (_le 1er élément est en position 0_)                             |
| __scores__   |        |                                                                       |
| displayLimit | number | Le nombre de scores à afficher dans le tableau des meilleurs temps    |
| __timer__    |        |                                                                       |
| duration     | string | La durée du jeu ; le format "animation CSS" est utilisé, _exemple `60s` pour 1 minute_ (zen: '600s', nightmare : '30s')                                           |

**Le sprite utilisé peut être modifié mais doit obéir à quelques impératifs :
[exemple](./src/client/assets/images/cards.png)
- il doit être __vertical__ : les images sont placées les unes sur les autres en une seule colonne ;
- les images composant le sprite doivent être __carrées__ ;
- le fichier __doit se nommer__ `cards.png` et __se trouver__ dans le répertoire `./src/client/assets/images/`

> Remarque : si `rows` est supérieur à `cols`, les valeurs sont inversées.

### Définition de la grille

Les variables `rows`, `cols` et `number`, `description` sont dépendantes pour la génération de la grille :
- la variable `number` est uniquement utilisée dans le CSS est __doit__ correspondre à la longueur du tableau `description` ;
- si `rows` * `cols` est impair ou supérieur à `description.length`, la grille est redéfinie et les variables sont écrasées.

Exemples pour un sprite de 18 éléments (`number` = 18, grille max. = 36 cases):

| rows | cols | grille demandée | problème rencontré | grille générée |
|------|------|-----------------|--------------------|----------------|
|    3 |    7 | 21 cases        | grille impaire     | 2 x 11         |
|    5 |    8 | 40 cases        | grille trop grande | 6 x 6 **       |
|    2 |   20 | 40 cases        | grille trop grande | 2 x 18 **      |
|    7 |    4 | 28 cases        | grille inversée    | 4 x 7          |

** Le recalcul de la grille cherche à rester au plus proche de la valeur initiale de `rows`

## Configuration de Docker

Afin de gérer les deux conteneurs et créer la communication entre ceux-ci, un fichier _Docker compose_ est fourni.

Docker doit être installer sur la machine : [Docker Desktop](https://www.docker.com/products/docker-desktop).

Marche à suivre :
- changer l'adresse du proxy dans le fichier `client/package.json` (dernière ligne)
```json
"proxy": "http://backend:8080/"
```
- changer la congiguration du proxy dans le fichier `client/webpack.config.js` (ligne 77)
```js
{
  // ...
  devServer: {
    // ...
    proxy: {
      '/api': {
        // ...
        router: () => 'http://backend:8080',
        // ...
      },
    },
  },
}
```
- construire les images et démarrer les conteneurs
```bash
$ docker-compose up --build
```
- se lever, prendre le bébé (et/ou le chien) et sortir de chez soi : ça peut péter à tout moment !
- ou alors, jouer et se détendre…

# Site vitrine Vorelix

Site statique (HTML, CSS, JavaScript), construit comme le site KOZ SERVICES :
- fond blanc aéré ;
- en-tête qui reste en haut ;
- mode clair et mode sombre ;
- barre de navigation en bas de l'écran sur téléphone ;
- bouton WhatsApp.

Il n'a besoin ni de serveur ni de base de données, et fonctionne tel quel sur Vercel, GitHub Pages ou Netlify.

## Les pages

| Fichier | Page |
|---|---|
| `index.html` | Accueil |
| `fonctionnalites.html` | Fonctionnalités : direction, surveillants, enseignants, parents, sécurité, idées à venir |
| `tarifs.html` | Tarifs : bascule par mois / par an, tableau comparatif |
| `faq.html` | Questions fréquentes : recherche et filtres |
| `a-propos.html` | À propos |
| `contact.html` | Contact : formulaire envoyé par WhatsApp ou par e-mail |
| `404.html` | Page affichée quand une adresse n'existe pas |

Les autres fichiers :

| Fichier | Rôle |
|---|---|
| `assets/js/config.js` | **Vos coordonnées : c'est le seul fichier à remplir** |
| `assets/css/style.css` | Couleurs, polices et mise en page |
| `assets/js/site.js` | Menu, mode sombre, tarifs, FAQ, formulaire |
| `assets/fonts/` | Polices Barlow et Barlow Condensed, hébergées avec le site |

## 1. Remplir vos coordonnées

Ouvrez `assets/js/config.js` avec un éditeur de texte (Bloc-notes ou VS Code) et remplissez ces valeurs.

| Valeur | À mettre | Exemple |
|---|---|---|
| `telephone` | Le numéro affiché | `"+226 70 00 00 00"` |
| `whatsapp` | Le même numéro, en chiffres seulement | `"22670000000"` |
| `email` | L'adresse e-mail de Vorelix | |
| `connexion` | Le lien de l'espace de connexion de l'application, s'il existe | |
| `delaiReponse` | Le délai de réponse | `"sous 48 heures"` |

Dès que le numéro `whatsapp` est rempli :
- le formulaire de contact envoie les messages sur ce numéro ;
- un bouton WhatsApp vert apparaît en bas à droite ;
- sur téléphone, le bouton du milieu de la barre du bas devient WhatsApp.

Une valeur laissée vide est simplement masquée.

## 2. Vérifier sur votre ordinateur

Double-cliquez sur `index.html` : le site s'ouvre dans le navigateur. Les icônes viennent d'Internet (Font Awesome) : il faut donc être connecté.

## 3. Mettre en ligne (GitHub + Vercel)

1. Créez un dépôt GitHub vide, par exemple `vorelix-site`.
2. Dans PowerShell, depuis le dossier du site, lancez :
   ```
   git init
   git add .
   git commit -m "Site vitrine Vorelix"
   git branch -M main
   git remote add origin https://github.com/VOTRE-COMPTE/vorelix-site.git
   git push -u origin main
   ```
3. Sur vercel.com, cliquez sur **Add New → Project** et choisissez le dépôt. Gardez les réglages par défaut, puis cliquez sur **Deploy**.

Ensuite, chaque `git push` met le site à jour.

## Modifier les prix

Dans `tarifs.html`, chaque prix apparaît deux fois sur la même ligne :
- dans `data-mensuel="19900"`, qui sert au calcul du prix annuel ;
- dans le texte affiché, `19 900`.

Changez les deux.

La réduction annuelle se règle avec `data-remise="15"`. Pensez aussi à changer le texte du bouton « Par an, 15 % de moins ».

## Plus tard

- **Bloc équipe** : il est prêt dans `a-propos.html`, en commentaire. Retirez les marques `<!--` et `-->` qui l'entourent, puis remplacez le texte.
- **Formulaire relié à un serveur** : aujourd'hui, le message part par WhatsApp ou par e-mail depuis le téléphone du visiteur. Pour recevoir les demandes dans une base de données, il faudra ajouter une route au serveur de l'application Vorelix.
- **Page Télécharger** : à ajouter quand l'application sera sur Google Play ou l'App Store.

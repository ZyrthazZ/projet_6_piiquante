//Appel le framework express
const express = require('express');

//Permet de créer une application express
const app = express();

//Appel le package mongoose et connecte l'app à la base de données MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://zyrthazz:project6@zyrthazzcluster.kg1mj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


//Middleware gérant les problèmes de CORS (Cross Origin Resource Sharing)
app.use((req, res, next) => {
    //Accepte les requêtes depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    //Accepte les requêtes comprenant certains headers
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //Accepte d'envoyer des requêtes avec des verbes HTTPS spécifiques
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


//Réponse simple pour savoir si le serveur répond bien 
app.use((req, res, next) => {
    res.json({
        message: "Votre requête a bien été reçue !"
    });
});





//Exporte l'application pour qu'elle soit utilisable par les autres fichiers
module.exports = app;
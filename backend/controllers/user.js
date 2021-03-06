//Appel du package bcrypt servant à hacher le mot de passe de l'utilisateur
const bcrypt = require('bcrypt');

//Appel du modèle User (schema mongoose)
const User = require('../models/User');

//Appel du package jsonwebtoken 
const jwt = require('jsonwebtoken');

//Fonction signup appellée lors de l'inscription d'un user (utilisée dans routes/user.js)
exports.signup = (req, res) => {
    //Fonction hash de bcrypt, utilisée 10 fois sur le password
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            //Crée un nouveau user à partir de User
            const user = new User({
                email: req.body.email,
                password: hash
            });
            //Le user est enregistré
            user.save()
                .then(() => res.status(201).json({
                    message: "Utilisateur créé !"
                }))
                .catch(error => res.status(400).json({
                    error
                }));
        })
        .catch(error => res.status(500).json({
            error
        }));
};


//Fonction login appelée lors de la connection d'un user (utilisée dans routes/user.js)
exports.login = (req, res, next) => {
    //Fonction findOne utilisée pour vérifier que le user existe dans User
    User.findOne({
            email: req.body.email
        })
        .then(user => {
            //Si le user n'existe pas, envoie une erreur
            if (!user) {
                return res.status(401).json({
                    error: 'Utilisateur non trouvé !'
                });
            }
            //Si le user existe, utilise la fonction compare de bcrypt sur le mot de passe entré 
            //avec le mot de passe haché sauvegardé
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    //Si le mot de passe ne correspond pas, envoie une erreur
                    if (!valid) {
                        return res.status(402).json({
                            error: 'Mot de passe incorrect !'
                        });
                    }
                    //Si le mot de passe correspond, envoie une réponse contenant l'ID utilisateur
                    //et un TOKEN de sécurité qui va permettre de vérfier que la requête est authentifiée
                    res.status(200).json({
                        userId: user._id,
                        //La fonction sign de jsonwebtoken va encoder un nouveau token
                        token: jwt.sign({
                                userId: user._id
                            },
                            process.env.SECRET_TOKEN_KEY, {
                                expiresIn: '24h'
                            }
                        )
                    });
                })
                .catch(error => res.status(500).json({
                    error
                }));
        })
        .catch(error => res.status(500).json({
            error
        }));
};


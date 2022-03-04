import jwt from 'jsonwebtoken'
import { JWT_EXPIRATION_TIME, JWT_SECRET_KEY } from "../config/auth.config";
import User from '../models/user.model'
import Role from '../models/role.model'
import RefreshToken from '../models/refresh_token.model'

exports.signup = (req, res) => {
    const obj = new Object()
    if (!req.body.username) {
        obj['username'] = 'Non fourni'
    }
    if (!req.body.email) {
        obj['email'] = 'Non fourni'
    }
    if (!req.body.category) {
        obj['category'] = 'Non fourni'
    }
    if (Object.keys(obj).length > 0) return res.status(400).send({message: obj})
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    Role.findOne({name: 'user'}, (err, role) => {
        if (err) {
            return res.status(500).send({message: 'Erreur de serveur interne'})
        }

        if (!role) return res.status(404).send({message: 'Rôle introuvable'})

        user.roles = [role._id]
        user.save(err => {
            if (err) {
                if (err.name === "ValidationError") {
                    let errors = {}
              
                    Object.keys(err.errors).forEach((key) => {
                      errors[key] = err.errors[key].message
                    })
              
                    return res.status(400).send({message: errors})
                }
                if (err.name === 'MongoServerError' && err.code === 11000) {
                    const key = Object.keys(err.keyValue)[0]
                    const obj = new Object()
                    obj[key] = 'Déjà pris'
                    return res.status(400).send({message: obj})
                }
                return res.status(500).send({message: 'Erreur de serveur interne'})
            }

            res.send({message: "Félicitations ! Votre profil a été créé"})
        })
    })
}

exports.signin = (req, res) => {
    const obj = new Object()
    if (!req.body.username) {
        obj['username'] = 'Non fourni'
    }
    if (!req.body.password) {
        obj['password'] = 'Non fourni'
    }
    if (Object.keys(obj).length > 0) return res.status(400).send({message: obj})
    User.findOne({username: req.body.username})
    .populate('roles')
    .exec((err, user) => {
        if (err) {
            return res.status(500).send({message: 'Erreur de serveur interne'})
        }

        if (!user) return res.status(404).send({message: 'Utilisateur non trouvé'})

        user.comparePasswords(req.body.password, async function(err, isMatch) {
            if (err) {
                return res.status(500).send({message: 'Erreur de serveur interne'})
            }

            if (!isMatch) {
                return res.status(401).send({message: 'Le mot de passe est erroné'})
            }

            const accessToken = jwt.sign({userId: user.id}, JWT_SECRET_KEY, {
                expiresIn: JWT_EXPIRATION_TIME
            })
            const refreshToken = await RefreshToken.createToken(user)
            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                roles: user.roles,
                accessToken,
                refreshToken: refreshToken.token
            })
        })
    })
}

exports.refreshToken = async (req, res) => {
    const {refreshToken: requestToken} = req.body
    if (!requestToken) return res.status(403).json({message: 'Le jeton de rafraîchissement est requis'})
    try {
        const refreshToken = await RefreshToken.findOne({token: requestToken})
        if (!refreshToken) return res.status(403).json({message: 'Le jeton de rafraîchissement est inconnu'})

        if (RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.findByIdAndRemove(refreshToken._id, {useFindAndModify: false}).exec()
            return res.status(403).json({message: 'Le jeton de rafraîchissement a expiré. Veuillez faire une nouvelle demande de connexion'})
        }
        const newAccessToken = jwt.sign({userId: refreshToken.user._id}, JWT_SECRET_KEY, {
            expiresIn: JWT_EXPIRATION_TIME
        })
        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token
        })
    } catch (e) {
        return res.status(500).send({message: 'Erreur de serveur interne'})
    }
}
import jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY } from '../config/auth.config'
import User from '../models/user.model'
import Role from '../models/role.model'

const {TokenExpiredError} = jwt

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token']
    if (!token) {
        return res.status(403).send({message: 'Aucun jeton fourni'})
    }
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            if (err instanceof TokenExpiredError) {
                return res.status(401).send({message: "Le jeton d'accès a expiré"})
            }
            return res.status(401).send({message: 'Non autorisé'})
        }
        req.userId = decoded.userId
        return next()
    })
}

const checkAdminRights = (req, res, next) => {
    User.findById(req.userId, function(err, user) {
        if (err) {
            return res.status(500).send({message: 'Erreur de serveur interne'})
        }

        if (!user) {
            return res.status(401).send({message: 'Non autorisé'})
        }

        Role.find({_id: {$in: user.roles}}, function(err, roles) {
            if (err) {
                return res.status(500).send({message: 'Erreur de serveur interne'})
            }

            if (roles.find(r => r.name === 'admin')) {
                return next()
            }

            return res.status(403).send({message: 'Accès interdit'})
        })
    })
}

module.exports = {
    verifyToken,
    checkAdminRights
}
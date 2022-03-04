import {Router} from 'express'
import authController from '../controllers/auth.controller'

const router = Router()

router.post('/signup', authController.signup)
router.post('/signin', authController.signin)
router.post('/refreshToken', authController.refreshToken)

module.exports = router
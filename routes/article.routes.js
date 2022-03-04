import {Router} from 'express'
import articleController from '../controllers/article.controller'
import {verifyToken, checkAdminRights} from '../middleware/auth.middleware'

const router = Router()

router.get('/published', [verifyToken], articleController.getAllPublished)
router.post('/', [verifyToken, checkAdminRights], articleController.create)
router.get('/all', [verifyToken, checkAdminRights], articleController.getAll)
router.get('/:id', [verifyToken], articleController.get)
router.post('/:id/publish', [verifyToken, checkAdminRights], articleController.publish)

module.exports = router
import {Router} from 'express'
import categoryController from '../controllers/category.controller'
import {verifyToken} from '../middleware/auth.middleware'

const router = Router()

router.get('/', [verifyToken], categoryController.getAll)

module.exports = router
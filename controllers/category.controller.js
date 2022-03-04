import Category from '../models/category.model'

exports.getAll = async (req, res) => {
    try {
        const categories = await Category.find({})
        return res.send(categories)
    } catch (e) {
        return res.status(500).send({message: 'Erreur de serveur interne'})
    }
}
import Article from '../models/article.model'

exports.create = async (req, res) => {
    try {
        const obj = new Object()
        if (!req.body.title) {
            obj['title'] = 'Non fourni'
        }
        if (!req.body.description) {
            obj['description'] = 'Non fourni'
        }
        if (!req.body.category) {
            obj['category'] = 'Non fourni'
        }
        if (Object.keys(obj).length > 0) return res.status(400).send({message: obj})
        const article = {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category
        }
        if (req.body.tags) article.tags = req.body.tags
        else article.tags = []
        const now = Date.now()
        if (req.body.publish && req.body.publish === true) {
            article.publicationDate = now
        }
        article.revisionDate = now
        const newArticle = new Article(article)
        await newArticle.save()
        return res.status(200).send(newArticle)
    } catch (e) {
        return res.status(500).send({message: 'Erreur de serveur interne'})
    }
}

exports.getAllPublished = async (req, res) => {
    try {
        const articles = await Article.find({publicationDate: { $ne: null }}).skip(0).limit(10).sort({publicationDate: 'desc'})
        return res.send(articles)
    } catch (e) {
        return res.status(500).send({message: 'Erreur de serveur interne'})
    }
}

exports.getAll = async (req, res) => {
    try {
        const articles = await Article.find({})
        return res.send(articles)
    } catch (e) {
        return res.status(500).send({message: 'Erreur de serveur interne'})
    }
}

exports.get = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
        return res.send(article)
    } catch (e) {
        return res.status(500).send({message: 'Erreur de serveur interne'})
    }
}

exports.publish = async (req, res) => {
    try {
        const obj = new Object()
        if (!req.params.id) {
            obj['id'] = 'Non fourni'
        }
        if (Object.keys(obj).length > 0) return res.status(400).send({message: obj})
        const article = await Article.findOne({_id: req.params.id, publicationDate: {$eq: null}})
        const now = Date.now()
        article.publicationDate = now
        article.revisionDate = now
        await article.save()
        return res.send(article)
    } catch (e) {
        return res.status(500).send({message: 'Erreur de serveur interne'})
    }
}
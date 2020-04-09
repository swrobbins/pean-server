require('rootpath')();
const express = require('express');
const router = express.Router();
const accountService = require('routes/accounts/account.service');

router.post('/register', register);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', remove);

function register(req, res, next) {
    accountService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    accountService.getAll()
        .then(accounts => res.json(accounts))
        .catch(err => next(err));
}

function getById(req, res, next) {
    accountService.getById(req.params.id)
        .then(account => account ? res.json(account) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    accountService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function remove(req, res, next) {
    accountService.remove(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

module.exports = router;


require('rootpath')();
const bcrypt = require('bcryptjs');
const Account = require('helpers/db');

// Get/set defaults.
require('dotenv').config();
const TOKEN_SALT_ROUNDS = process.env.TOKEN_SALT_ROUNDS || 10;

module.exports = {
    getAll,
    getById,
    getByName,
    create,
    update,
    remove
};

async function getAll() {
    return Account.findAll();
}

async function getById(id) {
    return Account.findByPk(id);
}

async function getByName(name) {
    return Account.findOne({where: {name}});
}

async function create(accountParam) {
    if (await Account.findOne({where: {name: accountParam.name}})) {
        throw 'Account name "' + accountParam.name + '" is already taken';
    }

    const account = new Account(accountParam);
    if (accountParam.password) {
        account.hash = await bcrypt.hash(accountParam.password, saltRounds);
    }

    await account.save();
}

async function update(id, accountParam) {
    const account = await Account.findByPk(id);

    if (!account) throw 'Account not found';
    if (account.name !== accountParam.name && await Account.findOne({where: {name: accountParam.name}})) {
        throw 'Account name "' + accountParam.name + '" is already taken';
    }

    if (accountParam.password) {
        accountParam.hash = await bcrypt.hash(accountParam.password, TOKEN_SALT_ROUNDS);
    }

    Object.assign(account, accountParam);

    await account.save();
}

async function remove(id) {
    await Account.destroy({where: {id: id}});
}

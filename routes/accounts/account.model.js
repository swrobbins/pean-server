const DataTypes = require('sequelize');

const Account = {
    name: {type: DataTypes.STRING},
    hash: {type: DataTypes.STRING}
};

module.exports = Account;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Configuration = sequelize.define("Configuration", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  // Colonne "name" : le nom donné à la configuration 
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Sans titre",
  },

  // Colonne "data" : les données de configuration en JSON
  // C'est le contenu complet (room, cam, finish, furniture, pmr) que Unity envoie via le NetworkManager
  unityData: {
    type: DataTypes.JSON,
    allowNull: false,
  },
}, {
  tableName: "configurations",
  timestamps: true,
  underscored: true,
});

// ─── Relations ────────────────────────────────────────────────
// Une configuration appartient à un utilisateur 
Configuration.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

// Un utilisateur peut avoir plusieurs configurations
User.hasMany(Configuration, { foreignKey: "user_id" });

module.exports = Configuration;
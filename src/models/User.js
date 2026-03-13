const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  // Colonne "google_id" : l'identifiant unique Google de l'utilisateur
  // C'est ce qui permet de retrouver un utilisateur quand il se reconnecte
  google_id: {
    type: DataTypes.STRING,
    unique: true,        // Pas de doublons
    allowNull: false,    // Obligatoire
  },

  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },

  // Colonne "display_name" : le nom affiché 
  display_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "editor", "viewer"),
    allowNull: false,
    defaultValue: "editor",
  },

  // Colonne "avatar_url" : URL de la photo Google 
  avatar_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
}, {
  tableName: "users",      // nom exact de la table en BDD
  timestamps: true,        // ajoute automatiquement "created_at" et "updated_at"
  underscored: true,       // utilise snake_case (created_at) au lieu de camelCase (createdAt)
});

module.exports = User;
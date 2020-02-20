import Sequelize, { Model } from 'sequelize';

class File extends Model{
  static init(sequelize){
    super.init({
      file_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: Sequelize.STRING,
      path: Sequelize.STRING,
    },{
       sequelize
    });

    return this;
  }
}

export default File;
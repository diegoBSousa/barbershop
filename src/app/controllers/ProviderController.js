import User from '../models/User';

class ProviderController{
  async index(req, res){
    return res.json({ message: 'ProviderController'});
  }
}

export default new ProviderController();
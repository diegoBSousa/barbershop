import Appointment from '../models/Appointment';

class ScheduleController{
  async index(req, res){
    return res.json({message: 'index'});
  }
}

export default new ScheduleController();
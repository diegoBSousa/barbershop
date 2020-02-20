import Appointment from '../models/Appointment';

class AppointmentController{
  async store(req, res){
    return res.json(req);
  }
}

export default new AppointmentController();
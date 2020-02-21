import Appointment from '../models/Appointment';
import * as Yup from 'yup';
import User from '../models/User'; 

class AppointmentController{
  async store(req, res){
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required()
    });

    if(!(schema.isValid(req.body))){
      return res.status(400).json({ error: "Validation has failed"});
    }

    const { provider_id, date } = req.body;

    const isProvider = await User.findOne({
      where: {
        user_id: provider_id,
        provider: true
      }
    });

    if(!isProvider){
      return res.status(401).json({ error: "That provider was not found"});
    }
console.log(`userId: ${req.userId}`);
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date
    });
    return res.json(appointment);
  }
}

export default new AppointmentController();
import Appointment from '../models/Appointment';
import * as Yup from 'yup';
import User from '../models/User'; 
import { startOfHour, parseISO, isBefore } from 'date-fns';

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

    const startHour = startOfHour(parseISO(date));

    if(isBefore(startHour, new Date())){
      return res.status(400).json({ error: "Dates in past are not allowed"});
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date
    });
    return res.json(appointment);
  }
}

export default new AppointmentController();
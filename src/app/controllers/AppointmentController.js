import Appointment from '../models/Appointment';
import * as Yup from 'yup';
import User from '../models/User'; 
import File from '../models/File'; 
import { startOfHour, parseISO, isBefore } from 'date-fns';

class AppointmentController{
  async index(req, res){
    const { page = 1} = req.query;
    const limit = 20;
    const offset = (page - 1) * limit;

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null
      },
      order: [ 'date' ],
      attributes: [ 'appointment_id', 'date'],
      page,
      offset,
      limit,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: [ 'user_id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: [ 'file_id', 'url', 'path']
            }
          ]
        }
      ]
    });
  
    return res.json(appointments);
  }

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

    const checkAvailability = Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: startHour
      }
    });

    if(checkAvailability){
      return res.status(400).json({ error: "That date is not available."});
    }
  
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      startHour
    });
    return res.json(appointment);
  }
}

export default new AppointmentController();
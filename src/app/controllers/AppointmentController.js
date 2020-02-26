import Appointment from '../models/Appointment';
import * as Yup from 'yup';
import User from '../models/User'; 
import File from '../models/File'; 
import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Notification from '../schemas/Notification';

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

    const checkAvailability = await Appointment.findOne({
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
      date: startHour
    });

    /**
     * Notify service provider
     */
    const user = await User.findByPk(req.userId);

    const formattedDate = format(
      startHour,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: ptBR}
      );
  
    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formattedDate}.`,
      user: provider_id
    });

    return res.json(appointment);
  }

  async delete(req, res){
    const appointment = new Appointment.findByPk(req.params.id);

    if(appointment.user_id != req.userId){
      return res.status(400).json({
         error: "You don't have permission to delete this appointment."
        });
    }

    

    return res.json({ok:true});
  }
}

export default new AppointmentController();
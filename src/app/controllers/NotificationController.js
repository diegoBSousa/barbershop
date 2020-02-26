import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController{
  async index(req, res){
    const isProvider = await User.findOne({
      where: {
        user_id: req.userId,
        provider: true
      }
    });

    if(!isProvider){
      return res.status(401).json({ error: "Only providers can read notifications."});
    }

    const notifications = await Notification.find({
      user: req.userId
    }).sort({
      createdAt: 'desc'
    })
    .limit(20);

    return res.json(notifications);
  }

  async update(req, res){
    const notification = await Notification.findById(req.params.id);
    return res.json({ ok: true});
  }
}

export default new NotificationController();
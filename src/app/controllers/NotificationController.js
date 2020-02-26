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
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
      );
    
    if(!notification){
      return res.status(404).json({ error: "This notification ID does not exist."});
    }
    return res.json(notification);
  }
}

export default new NotificationController();
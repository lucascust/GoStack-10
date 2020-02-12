import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    const notification = await Notification.find({
      user: req.userId,
    })
      .sort('createdAt')
      .limit(20);

    return res.json(notification);
  }
}

export default new NotificationController();

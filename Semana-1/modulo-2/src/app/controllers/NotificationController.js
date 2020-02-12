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
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notification);
  }

  async update(req, res) {
    // const notification = await Notification.findById(req.param.id);

    /**
     * Set notification as read.
     * param 1: id
     * param 2: What will be updated => set read true
     * param 3: options => new == return new notification
     */
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    res.json(notification);
  }
}

export default new NotificationController();

import * as Yup from 'yup';

import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';

import Notification from '../schemas/Notification';
import Mail from '../../lib/Mail';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointment = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointment);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Failed' });
    }

    const { provider_id, date } = req.body;

    /**
     * Check if provider_id is a provider
     */

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You only can create appointments with providers' });
    }
    /**
     * Check if user != provider
     */
    if (req.userId === provider_id) {
      return res
        .status(401)
        .json({ error: 'User can not be the same as provider' });
    }

    /**
     * parseISO transform date in object
     * startOfHour === abs() of dates
     */
    const hourStart = startOfHour(parseISO(date));

    /**
     * Verify if date is in Past
     */
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past date is not permitted' });
    }

    /**
     * Verify if date is already in use
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    /**
     * notify appointment provier
     */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(hourStart, "dd 'de' MMMM', às ' H:mm'h'", {
      locale: pt,
    });

    await Notification.create({
      content: `Novo agendamento de ${user.name} para o dia ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    /**
     * Find appointment and include provider data "name" and "email"
     */
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (req.userId !== appointment.user_id) {
      return res.status(401).json({
        error: 'You do not have permission to cancel this appointment',
      });
    }

    const subtractedDate = subHours(appointment.date, 2);

    if (isBefore(subtractedDate, new Date())) {
      return res.status(401).json({
        error: 'You can not cancel appointment in less than 2 hours before',
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    /**
     * send confirmation email
     */
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(appointment.date, "dd 'de' MMMM', às ' H:mm'h'", {
          locale: pt,
        }),
      },
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();

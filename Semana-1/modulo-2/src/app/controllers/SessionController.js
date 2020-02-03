import jwt from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    // verificando se existe email no DB
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Wrong Password' });
    }

    // A partir daqui, usuário encontrado e senha bateu
    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      // sign(payload(obj), string único no mundo, configs token)
      // Payload são infos adicionais anexadas ao token
      // Site para token único: MD5Online
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();

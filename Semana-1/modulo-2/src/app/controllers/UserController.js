import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    // Schema de verificação de input usando Yup
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });
    // Teste que verifica se o req.body está dentro das regras criadas no schema
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation error' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    // Schema de verificação de input usando Yup
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      // "when" como condicional que exige password caso oldpassword tenha sido passado
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) => {
          return oldPassword ? field.required() : field;
        }),
      confirmPassword: Yup.string().when('password', (password, field) => {
        // Confirma que senha == confirmarSenha
        return password ? field.required().oneOf([Yup.ref('password')]) : field;
      }),
    });

    // Teste que verifica se o req.body está dentro das regras criadas no schema
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation error' });
    }

    const { email, oldPassword } = req.body;


    // ID passado para dentro do request pelo middleware de auth
    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {

      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Wrong Password' });
    }

    const { id, name, provider, avatar_id } = await user.update(req.body);

    return res.json({ id, name, email, provider, avatar_id });
  }
}

export default new UserController();

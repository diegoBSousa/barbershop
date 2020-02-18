import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';
import * as Yup from 'yup';

class SessionController{
  async store(req, res){
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required()
    });

    if(!( await schema.isValid(req.body))){
      return res.status(400).json({ error: "Validation Error!"});
    }
  
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email }});

    if(!user){
      return res.status(401).json({ error: "User was not found."});
    }

    if(!(await user.checkPassword(password))){
      return res.status(401).json({ error: "Password does not match."})
    }

    const { user_id, name } = user;

    return res.json({
      user: {
        user_id,
        name,
        email
      },
      token: jwt.sign({ user_id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      }),
    });
  }
}

export default new SessionController();
import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Prevenir duplicados
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      const error = new Error("Un usuario con ese email ya esta registrado");
      res.status(409).json({ error: error.message });
      return;
    }

    try {
      // save user in database
      const user = await User.create(req.body);
      user.password = await hashPassword(password);
      const token = generateToken();
      user.token = token;

      if (process.env.NODE_ENV !== "production") {
        globalThis.cashTrackrConfirmationToken = token;
      }

      await user.save();

      // send confirmation email
      await AuthEmail.sendConfirmationEmail({
        name: user.name,
        email: user.email,
        token: user.token,
      });

      res.status(201).json("Usuario creado correctamente, Confirma tu cuenta.");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    const { token } = req.body;
    console.log(req.body);

    const user = await User.findOne({ where: { token } });
    if (!user) {
      const error = new Error("Token no válido");
      res.status(401).json({ error: error.message });
      return;
    }
    user.confirmed = true;
    user.token = null;
    await user.save();

    res.json("Cuenta confirmada correctamente");
  };

  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Revisar que el usuario exista
    const userExists = await User.findOne({ where: { email } });
    if (!userExists) {
      const error = new Error("Usuario no encontrado");
      res.status(404).json({ error: error.message });
      return;
    }
    // Revisar que la cuenta esté confirmada
    if (!userExists.confirmed) {
      const error = new Error("La Cuenta no ha sido confirmada");
      res.status(403).json({ error: error.message });
      return;
    }
    // Revisar que el password sea correcto
    // console.log("user exists: ", userExists);

    const isPasswordCorrect = await checkPassword(
      password,
      userExists.password
    );
    if (!isPasswordCorrect) {
      const error = new Error("Password Incorrecto");
      res.status(401).json({ error: error.message });
      return;
    }
    // console.log("isPasswordCorrect: ", isPasswordCorrect);

    const token = generateJWT({
      id: userExists?.id,
      email: userExists?.email,
    });
    // console.log(token);
    res.json(token);
  };

  static forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    // Revisar que el usuario exista
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error("Usuario no encontrado");
      res.status(404).json({ error: error.message });
      return;
    }
    user.token = generateToken();
    await user.save();

    await AuthEmail.sendPasswordResetToken({
      name: user.name,
      email: user.email,
      token: user.token,
    });

    res.json("Revisa tu email para instrucciones");
  };

  static validateToken = async (req: Request, res: Response) => {
    const { token } = req.body;

    const tokenExists = await User.findOne({ where: { token } });
    if (!tokenExists) {
      const error = new Error("Token no válido");
      res.status(404).json({ error: error.message });
      return;
    }

    res.json("Token válido, asigna un nuevo password");
  };

  static resetPasswordWithToken = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    // Revisar que el password y confirmPassword sean iguales
    if (password !== confirmPassword) {
      const error = new Error("Las contraseñas no coinciden");
      res.status(400).json({ error: error.message });
      return;
    }

    // Revisar que el token sea válido
    const user = await User.findOne({ where: { token } });
    if (!user) {
      const error = new Error("Token no válido");
      res.status(404).json({ error: error.message });
      return;
    }

    // Asignar el nuevo password
    user.password = await hashPassword(password);
    user.token = null;
    await user.save();

    res.json("El password se modificó correctamente");
  };

  static getUser = async (req: Request, res: Response) => {
    res.json(req.user);
  };

  static updateCurrentUserPassword = async (req: Request, res: Response) => {
    const { currentPassword: current_password, password } = req.body;
    const { id } = req.user;

    const user = await User.findByPk(id);

    const isPasswordCorrect = await checkPassword(
      current_password,
      user.password
    );
    if (!isPasswordCorrect) {
      const error = new Error("El password actual es incorrecto");
      res.status(401).json({ error: error.message });
      return;
    }
    user.password = await hashPassword(password);
    await user.save();

    res.json("El password se modificó correctamente");
  };

  static checkPassword = async (req: Request, res: Response) => {
    const { password } = req.body;
    const { id } = req.user;

    const user = await User.findByPk(id);

    const isPasswordCorrect = await checkPassword(password, user.password);
    if (!isPasswordCorrect) {
      const error = new Error("El password actual es incorrecto");
      res.status(401).json({ error: error.message });
      return;
    }

    res.json("Password Correcto");
  };

  // static updateUser = async (req: Request, res: Response) => {

  //     const { name, email} = req.body

  //     try {
  //         const existingUser = await User.findOne({where: {email}})

  //         if(existingUser && existingUser.id !== req.user.id) {
  //             const error = new Error('Ese email ya está registrado por otro usuario')
  //             return res.status(409).json({error : error.message})
  //         }

  //         await User.update({email, name}, {
  //             where: { id : req.user.id }
  //         })
  //         res.json('Perfil actualizado correctamente')
  //     } catch (error) {
  //         res.status(500).json('Hubo un error')
  //     }
  // }
}

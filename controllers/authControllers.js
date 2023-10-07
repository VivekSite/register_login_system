import userModels from "./../models/userModels.js";
import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import jwt from "jsonwebtoken";

//––––––––––––––––––––––– register Controller –––––––––––––––––––––––
export const registerController = async (req, res) => {
  try {
    const {name, email, phone, password, question, answer} = req.body;

    if (!name) return res.send({ message: "name is required" });
    if (!email) return res.send({ message: "email is required" });
    if (!phone) return res.send({ message: "phone is required" });
    if (!password) return res.send({ message: "password is required" });
    if (!question) return res.send({ message: "question is required" });
    if (!answer) return res.send({ message: "answer is required" });

    //––––––––– check for existing user ––––––––
    const existingUser = await userModels.findOne({ email });
    if (existingUser)
      return res.send({
        success: false,
        message: "Already registered please login",
      });

    //–––––––––––– Register new user –––––––––––
    const hashedPassword = await hashPassword(password);
    const hashedAnswer = await hashPassword(answer);

    //––––––––––––– save user info –––––––––––––
    const user = await new userModels({
      name,
      email,
      phone,
      password: hashedPassword,
      question,
      answer: hashedAnswer,
    }).save();

    //–––––––––––– Send Response 201 ––––––––––––
    res.status(201).send({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.log(`Error in registering: ${error}`);
    res.status(500).send({
      success: false,
      message: "Error registering",
      error,
    });
  }
};


//––––––––––––––––––––––– Login Controller –––––––––––––––––––––––––
export const loginController = async (req, res) => {
  try {
    const {email, password} = req.body;

    //––––– check if fields are empty –––––
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or Password",
      });
    }

    //––––––––––––– Find user –––––––––––––
    const user = await userModels.findOne({ email });
    if (!user)
      return res.status(404).send({
        success: false,
        message: "Email is not Registered",
      });

    //–––– check if password is currect ––––
    const match = await comparePassword(password, user.password);
    if (!match)
      return res.send({
        success: false,
        message: "Wrong Password",
      });

    //–––––––––––– Assign Token ––––––––––––
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
      },
    });

  } catch (error) {
    console.log(`Error in Login: k${error}`);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};


export const resetPasswordController = async (req, res) => {
  try{
    const {email, question, answer, newPassword} = req.body;
    //––––––––––––––––––––––– check of input –––––––––––––––––––––––
    if(!email)return res.send({
      success: false,
      message: 'Email is required'
    });

    if(!answer)return res.send({
      success: false,
      message: "Answer is required"
    });

    if(!newPassword)return res.send({
      success: false,
      message: 'password is required'
    })

    //––––––––––––––––––––––– find user  –––––––––––––––––––––––
    const user = await userModels.findOne({email});

    if(!user){
      return res.status(404).send({
      success: false,
      message: "Email not found!"
    })};

    //––––––– check if answer is right –––––––
    const match = await comparePassword(answer, user.answer)
    if(match){
      const hashed = await hashPassword(newPassword);
      await userModels.findByIdAndUpdate(user._id, {password: hashed});
      res.status(200).send({
        success: true,
        message: "Password Updated Successfully"
      });
    }else{
      return res.status(404).send({
        success: false,
        message: "Answer is wrong!"
      })
    }

  }catch(error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Something went wrong!',
      error
    })
  }
}



const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const User = require("./models/user");
const Write = require("./models/write");
const path = require("path");
const Ask = require("./models/ask");
const Reply = require("./models/reply");
const R_Reply = require("./models/r_reply");
const Reply = require("./models/reply");
const R_Reply = require("./models/r_reply");
const Counter = require("./models/counter");
const Counter2 = require("./models/counter2");
const ReplyCounter = require("./models/replycounter");
const R_ReplyCounter = require("./models/r_replycounter");
const AReply = require("./models/Areply");
const AR_Reply = require("./models/Ar_reply");
const AReplyCounter = require("./models/Areplycounter");
const AR_ReplyCounter = require("./models/Ar_replycounter");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");
const app = express();
const nodemailer = require("nodemailer");
const Verify = require("./models/verify");
const AskGood = require("./models/askGood");
const PostGood = require("./models/postGood");
const auth = require("./auth");
//const { dblClick } = require("@testing-library/user-event/dist/cjs/event/behavior/click");

const OpenStudy = require("./models/openStudy");
//const { default: StudyRoomCard } = require("../component/StudyRoomCard");
const StudyTime = require("./models/studyTime");
const GoalTime = require("./models/goalTime");
const Schedule = require("./models/schedule");

const ObjectId = mongoose.Types.ObjectId;

//const storage = multer.diskStorage({
  // (2)
//  destination: (req, file, cb) => {
    // (3)
//    cb(null, "./server/images");
//  },
//  filename: (req, file, cb) => {
    // (4)
//    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`); // (5)
//  },
//});

//const upload = multer({
  // (6)
//  storage,
//  fileFilter: (req, file, cb) => {
//    if (["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype))
//      cb(null, true);
//    else cb(new Error("해당 파일의 형식을 지원하지 않습니다."), false);
//  },
//  limits: {
//    fileSize: 1024 * 1024 * 5,
// },
//});

const storage = multer.diskStorage({
  // (2)
  destination: (req, file, cb) => {
    // (3)
    cb(null, "./server/images");
  },
  filename: (req, file, cb) => {
    // (4)
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`); // (5)
  },
});

const upload = multer({
  // (6)
  storage,
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype))
      cb(null, true);
    else cb(new Error("해당 파일의 형식을 지원하지 않습니다."), false);
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

app.use(cors());
app.use(bodyParser.json({ limit : '10mb'}));
app.use(bodyParser.urlencoded({ limit : '10mb', extended: true }));
app.use("/images", express.static("./server/images"));
const mysecretkey = "capstone";

var db;
mongoose
  .connect(
    "mongodb+srv://admin:password1234@capstone.zymalsv.mongodb.net/capstone?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB 접속완료"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//사용자 정보 확인
app.get("/user", async (req, res) => {
  const token = req.headers.authorization;
  try {
    const { email } = jwt.verify(token, mysecretkey);
    const user = await User.findOne({ email });
    res.json(user);
    //console.log(res.data);
  } catch (err) {
    res.status(401).send({ message: "Invalid token" });
  }
});

//로그인한 사용자 정보를 검색
app.get('/users', auth, async(req, res) => {
    try{
        const user = await User.findOne({_id : req.user.id});

        if(!user){
            return res.status(404).send({message : 'User not found'});
        }
        res.send({name : user.name, email : user.email, _id : user._id});
    } catch(err){
        console.log(err);
        res.status(500).send({message : 'Server Error'});
    }
});

app.post('/nick-change', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  const { nick } = req.body;

  try {
    const userWithSameNick = await User.findOne({ name: nick });
    if (userWithSameNick) {
      return res.status(400).json({ message: '이미 존재하는 닉네임 입니다.' });
    }
    
    // Update user's nick in database
    await User.findByIdAndUpdate(userId, { name: nick });

    res.status(200).json({ message: '닉네임이 변경되었습니다' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 에러 발생' });
  }
});

app.put('/img-change/:id', auth, async(req, res) => {
  try{
    const id = req.params.id;
    const image = req.body.image;
    const user = await User.findByIdAndUpdate(id, {image}, {new: true});
    res.json(user);
  }catch(err){
    console.error(err);
    res.status(500).send(err);
  }
})

app.get('/img-change', auth, async(req, res) => {
  try{
    const id = req.user.id;
    console.log(id);
    
    const user = await User.findById(id);

    if(!user){
      return res.status(404).json({error: 'User not found'});
    }

    const image = user.image;
    return res.status(200).json({image});
  }catch(err){
    console.error(err);
    return res.status(500).send(err);
  }
})



//로그인한 사용자의 비밀번호를 변경
app.put('/users/change-password/:id', auth, async(req, res) => {
    const id = req.params.id;
    const {password, newPassword, confirmNewPassword} = req.body;

    try {
        const user = await User.findOne({_id : id});
        if(!user) return res.status(404).send('User not found');

        const isMatch = user.password == password;
        if(!isMatch) return res.status(400).send('Invalid password');

        if(newPassword !== confirmNewPassword){
            return res.status(400).send('Password do not match');
        }

        if(newPassword.length < 6){
            return res.status(400).send({error : 'New password must be at least 6 characters long'});
        }

        user.password = newPassword;
        await user.save();

        res.send('Password Update Successfully');
    }catch(err){
        console.error(err);
        res.status(500).send(err);
    }
});

//회원 탈퇴 시 사용자의 정보 삭제
app.delete("/users/withdraw/:id", auth, async(req,res) => {
    try{
        const id = req.params.id;
        console.log(id);

        await User.findOneAndDelete({_id : id});

        res.send({message : "Withdraw Successfully"});
    }catch(err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//일정 정보 저장
app.post("/schedules", auth, async(req, res) => {
    const {date, title, contents} = req.body;
    try{
        const newSchedule = new Schedule({
            title: title,
            date: date,
            contents: contents,
            userId: req.user.id
        });
        await newSchedule.save();
        return res.status(201).json(newSchedule);
    } catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    } 
});

app.post("/userInfo", async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
});

//저장된 일정 정보 가져오기(로그인된 유저가 자신의 일정만 보이도록)
app.get('/schedules', auth, async(req, res) => {
    try{
        const schedules = await Schedule.find({userId: req.user.id});
        return res.status(200).json(schedules);
    }catch(err){
        console.error(err);
        res.status(500).json({message : 'Server Error'})
    }
});

//일정 수정하기
app.put('/schedules/:id', (req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    const contents = req.body.contents;

    console.log(req.body);
    console.log(id);

    Schedule.findOneAndUpdate({_id : id}, {title, contents}, {new : true})
        .then(updatedSchedule => {
            res.send(updatedSchedule);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send(err);
        });
});

//일정 삭제하기
app.delete('/schedules/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);

    Schedule.findOneAndDelete({_id : id})
        .then(deletedSchedule => {
            res.send(deletedSchedule);
            console.log(deletedSchedule);

            if(!deletedSchedule){
                return res.status(404).send();
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send(err);
        })
})

app.post("/login", async (req, res) => {
  // 요청 바디에서 email과 password를 추출합니다.
  const { email, password } = req.body;

  // email이 존재하는지 확인합니다.
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send({ message: "유저를 찾을 수 없습니다." });
  }

  // password가 맞는지 확인합니다.
  const isMatch = user.password === password;
  if (!isMatch) {
    return res.status(401).send({ message: "패스워드가 틀렸습니다." });
  }

  // JWT 토큰을 발행합니다.
  const token = jwt.sign({ id: user._id }, mysecretkey, { expiresIn: "365d" });
  console.log(user._id);

  // 토큰을 클라이언트에게 전달합니다.
  res.send({ token: token, name: user.name });
});

app.post("/email-check", async (req, res) => {
  const { email, verify } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }
    return res.status(200).json({ message: "Email is available" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/nick-check", async (req, res) => {
  const { nick } = req.body;
  try {
    const user = await User.findOne({ name: nick });
    if (user) {
      return res.status(400).json({ message: "nick already exists" });
    }
    return res.status(200).json({ message: "nick is available" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = new User({
      name: name,
      email: email,
      password: password,
    });
    await newUser.save();
    return res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/email-send", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Email is not exists" });
    }

    const verify = Math.round(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "joi47920@gmail.com",
        pass: "ilgichwnxbjgyamd",
      },
    });

    const mailOptions = {
      from: "joi47920@gamil.com",
      to: email,
      subject: "Link 인증번호 메일입니다.",
      text: `인증번호는 ${verify}입니다.`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    /* 유효기간 5분 */
    const now = new Date();
    const verified = new Verify({
      email: email,
      verify: verify,
      expireDate: new Date(now.getTime() + 5 * 60 * 1000),
    });
    verified.save();
    return res.status(200).json({ message: "Email is sended" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/email-verify", async (req, res) => {
  const { email, verify } = req.body;
  try {
    const verified = await Verify.find({
      email: email,
      expireDate: { $gte: new Date() },
    })
      .sort({ expireDate: -1 })
      .limit(1);

    if (!verified) {
      return res
        .status(400)
        .json({ message: "유효시간이 지났거나 존재하지 않습니다." });
    }
    const obj = verified[0];
    if (obj.verify === verify) {
      return res.status(200).json({ message: "인증번호 확인 성공" });
    } else {
      res.status(400).json({ message: "인증번호가 틀렸습니다." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/email-newpass", async (req, res) => {
  const { email, verify, newPassword } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Email doesn't exist." });
    }
    const verified = await Verify.find({
      email: email,
      expireDate: { $gte: new Date() },
      done: false,
    })
      .sort({ expireDate: -1 })
      .limit(1);

    if (!verified) {
      return res
        .status(400)
        .json({ message: "유효시간이 지났거나 이미 변경되었습니다." });
    }

    const obj = verified[0];
    if (obj.verify === verify) {
      obj.done = true;
      obj.save();
      user.password = newPassword;
      user.save();
      return res
        .status(200)
        .json({ password: user.password, message: "비밀번호 변경 성공" });
    } else {
      res.status(400).json({ message: "비밀번호 변경 실패" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/study-time", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const today = new Date().toLocaleDateString();
    const userStudyTime = await StudyTime.findOne({
      _user: userId,
      date: today,
    });
    if (!userStudyTime)
      return res.status(204).json({ message: "시간 찾지 못했습니다." });

    const time = userStudyTime.studyTime;
    const timeH = Math.floor(time / 3600);
    const timeM = Math.floor((time % 3600) / 60);
    return res.status(200).json({
      timeH: timeH,
      timeM: timeM,
      message: "공부 시간 가져오기 성공",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/goal-time", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  const { hour, min } = req.body;
  try {
    const time = hour * 3600 + min * 60;
    const existingGoalTime = await GoalTime.findOne({ _user: userId });
    if (existingGoalTime) {
      existingGoalTime.goalTime = time;
      await existingGoalTime.save();
      return res.status(200).json({ message: "GoalTime updated successfully" });
    } else {
      const newGoalTime = new GoalTime({
        _user: userId,
        goalTime: time,
      });
      await newGoalTime.save();
      return res.status(200).json({ message: "GoalTime created successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/ggoal-time", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const userGoalTime = await GoalTime.findOne({
      _user: userId,
    });
    if (userGoalTime) {
      const time = userGoalTime.goalTime;
      const timeH = Math.floor(time / 3600);
      const timeM = Math.floor((time % 3600) / 60);
      return res.status(200).json({
        goalTimeH: timeH,
        goalTimeM: timeM,
        message: "목표 공부 시간 가져오기 성공",
      });
    } else {
      return res.status(204).json({
        message: `목표 공부 시간을 설정해주세요.`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

/* app.get("/ranking", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const yesterday = today.toLocaleDateString();

    const rankTime = await StudyTime.find({ date: yesterday })
      .sort({ studyTime: -1 })
      .limit(10);

    if (rankTime) {
      const result = [];
      for (let i = 0; i < rankTime.length; i++) {
        const time = rankTime[i].studyTime;
        const timeH = Math.floor(time / 3600);
        const timeM = Math.floor((time % 3600) / 60);
        const timeS = time % 60;
        let userName = null;
        try {
          const user = await User.findById(rankTime[i]._user);
          userName = user.name;
        } catch (error) {
          console.log(error);
        }
        result.push({ timeH, timeM, timeS, userName });
      }

      return res.status(200).json({
        rankTime: result,
        message: "공부 시간 랭킹 가져오기 성공",
      });
    } else {
      res.status(400).json({
        message: "목표 공부시간을 설정해주세요.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});
 */

app.get("/ranking", async (req, res) => {
  try {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const yesterday = today.toLocaleDateString();

    const rankTime = await StudyTime.find({ date: yesterday })
      .sort({ studyTime: -1 })
      .limit(10);

    if (rankTime) {
      const result = [];
      for (let i = 0; i < rankTime.length; i++) {
        const time = rankTime[i].studyTime;
        const timeH = Math.floor(time / 3600);
        const timeM = Math.floor((time % 3600) / 60);
        const timeS = time % 60;
        let userName = null;
        try {
          const user = await User.findById(rankTime[i]._user);
          userName = user.name;
        } catch (error) {
          console.log(error);
        }
        result.push({ timeH, timeM, timeS, userName });
      }

      return res.status(200).json({
        rankTime: result,
        message: "공부 시간 랭킹 가져오기 성공",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/myRanking", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const yesterday = today.toLocaleDateString();
    let myRank = 0;

    const rankTime = await StudyTime.find({ date: yesterday })
      .sort({ studyTime: -1 })
      .limit(10);

    for (let i = 0; i < rankTime.length; i++) {
      if (rankTime[i]._user === userId) {
        myRank = i + 1;
      }
    }

    const myStudyTime = await StudyTime.findOne({
      _user: userId,
      date: yesterday,
    });
    if (myStudyTime) {
      const time = myStudyTime.studyTime;
      const timeH = Math.floor(time / 3600);
      const timeM = Math.floor((time % 3600) / 60);
      const timeS = time % 60;
      return res.status(200).json({
        studyTimeH: timeH,
        studyTimeM: timeM,
        studyTimeS: timeS,
        myRank: myRank,
        message: `나의 공부 시간 가져오기 성공`,
      });
    } else {
      return res.status(204).json({
        message: "목표 공부 시간을 설정해주세요.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//+++++++++++++++++++++++++++++++++++++++++
// 대댓글 삭제
app.delete("/postr_reply/:id/:rid/:rrid", async (req, res) => {
  const { id, rid, rrid } = req.params;
  
  const post = await Write.findOne({ _id: id });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  
  const reply = await Reply.findOne({ _id: rid });
    if (!reply) {
  return res.status(404).json({ message: "Reply not found" });
  }
  
  const r_reply = await R_Reply.findOne({ _id: rrid });
    if (!r_reply) {
    return res.status(404).json({ message: "R_Reply not found" });
  }
  
  try {
    await R_Reply.deleteOne({ _id: rrid });
  
    return res.status(200).json({ message: `R_Reply ${rrid} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

///대댓글 수정
app.get("/view/:id/modify/:selectedRId/:rrid", async(req, res) => {
  const postRId = req.params.id;
  const selectedRId = req.params.selectedRId;
  const rrid = req.params.rrid;

  try {
    const result = await R_Reply.find({ postRId: Number(postRId), selectedRId: Number(selectedRId), _id: Number(rrid)  });
    console.log(result);
    if(result) {
      return res.status(200).json({
        result: result,
        message: `댓글 id 가져오기 성공`,
      });
    }
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
})

app.post("/viewReplyRModify", async(req, res) => {
  const { postRId, selectedRId, _id, r_rWriteDate, r_reply, isRSecret } = req.body;

  try {
    const updatedViewReplyRModify = await R_Reply.findOneAndUpdate(
      { postRId, selectedRId, _id },
      {
        $set: { r_rWriteDate, r_reply, isRSecret },
      }
    );

    return res
      .status(200)
      .json({ message: `r_reply ${_id} updated successfully`, updatedViewReplyRModify });
  } catch(error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

//질문글 대댓글 삭제
app.delete("/postAr_reply/:id/:rid/:rrid", async (req, res) => {
  const { id, rid, rrid } = req.params;
  
  const post = await Write.findOne({ _id: id });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  
  const reply = await AReply.findOne({ _id: rid });
    if (!reply) {
  return res.status(404).json({ message: "Reply not found" });
  }
  
  const r_reply = await AR_Reply.findOne({ _id: rrid });
    if (!r_reply) {
    return res.status(404).json({ message: "R_Reply not found" });
  }
  
  try {
    await AR_Reply.deleteOne({ _id: rrid });
  
    return res.status(200).json({ message: `AR_Reply ${rrid} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

/// 질문글 대댓글 수정
app.get("/view/:id/modify/:selectedARId/:rrid", async(req, res) => {
  const postRId = req.params.id;
  const selectedARId = req.params.selectedARId;
  const rrid = req.params.rrid;

  try {
    const result = await AR_Reply.find({ postRId: Number(postRId), selectedARId: Number(selectedARId), _id: Number(rrid)  });
    console.log(result);
    if(result) {
      return res.status(200).json({
        result: result,
        message: `댓글 id 가져오기 성공`,
      });
    }
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
})

app.post("/viewReplyARModify", async(req, res) => {
  const { postRId, selectedARId, _id, Ar_rWriteDate, Ar_reply, isARSecret } = req.body;

  try {
    const updatedViewReplyARModify = await AR_Reply.findOneAndUpdate(
      { postRId, selectedARId, _id },
      {
        $set: { Ar_rWriteDate, Ar_reply, isARSecret },
      }
    );

    return res
      .status(200)
      .json({ message: `r_reply ${_id} updated successfully`, updatedViewReplyARModify });
  } catch(error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


//댓글 수정
app.get("/view/:id/modify/:replyId", async(req, res) => {
  const postId = req.params.id;
  const replyId = req.params.replyId;

  try {
    const result = await Reply.find({ postId: Number(postId), _id: Number(replyId)  });
    console.log(result);
    if(result) {
      return res.status(200).json({
        result: result,
        message: `댓글 id 가져오기 성공`,
      });
    }
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
})

app.post("/viewReplyModify", async(req, res) => {
  const { postId, _id, rWriteDate, reply, isSecret } = req.body;

  try {
    const updatedViewReplyModify = await Reply.findOneAndUpdate(
      { postId, _id },
      {
        $set: { rWriteDate, reply, isSecret },
      }
    );

    return res
      .status(200)
      .json({ message: `reply ${_id} updated successfully`, updatedViewReplyModify });
  } catch(error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 댓글삭제
app.delete("/view/:id/reply/:replyId", async(req, res) => {
  const postId = req.params.id;
  const replyId = req.params.replyId;

  try {
    const reply = await Reply.findOne({ postId: postId, _id: replyId });

    if(!reply) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    console.log(reply);

    await Reply.deleteOne({ postId: postId, _id: replyId });

    res.status(200).json({ message: "댓글을 삭제하였습니다." });
  } catch(error) {
    console.log(error);
    res.status(500).json({ message: "댓글삭제 실패" });
  }
});


/// 댓글 작성
app.post("/postreply/:id", async (req, res) => {
  const { reply, isSecret, rwriter, rwriteDate } = req.body;
  const { id } = req.params;

  const post = await Write.findOne({ _id: id });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const replycounter = await ReplyCounter.findOneAndUpdate({ name: '댓글 수' }, { $inc: { totalReply: 1 } }, { new: true, upsert: true });
  const 총댓글수 = (replycounter.totalReply +1);

  if (!replycounter) {
    return res.status(500).json({ message: "Counter not found" });
  }
  try {
    const newReply = new Reply({
      postId : id,
      _id: 총댓글수 + 1, 
      rwriter: rwriter,
      rwriteDate : rwriteDate,
      reply : reply,
      isSecret : isSecret
    });
    await newReply.save();
    console.log(isSecret)
    return res.status(200).json({ message: `Reply created successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});


/// 질문글 댓글 작성
app.post("/postAreply/:id", async (req, res) => {
  const { Areply, isASecret, Arwriter, ArwriteDate } = req.body;
  const { id } = req.params;

  const post = await Ask.findOne({ _id: id });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const Areplycounter = await AReplyCounter.findOneAndUpdate({ name: '댓글 수' }, { $inc: { totalReply: 1 } }, { new: true, upsert: true });
  const 총댓글수 = (Areplycounter.totalReply +1);

  if (!Areplycounter) {
    return res.status(500).json({ message: "Counter not found" });
  }
  try {
    const newAReply = new AReply({
      postId : id,
      _id: 총댓글수 + 1, 
      Arwriter: Arwriter,
      ArwriteDate : ArwriteDate,
      Areply : Areply,
      isASecret : isASecret
    });
    await newAReply.save();
    console.log(isASecret)
    return res.status(200).json({ message: `Reply created successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});


/// 대댓글 작성
app.post("/postr_reply/:id/:rid", async (req, res) => {
  const { r_reply, isRSecret, r_rwriteDate, r_rwriter } = req.body;
  const { id, rid } = req.params;

  console.log(rid);


  const post = await Write.findOne({ _id: id });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const reply = await Reply.findOne({ _id: rid });
  if (!reply) {
    return res.status(404).json({ message: "Reply not found" });
  }

  const r_replycounter = await R_ReplyCounter.findOneAndUpdate({ name: '대댓글 수' }, { $inc: { totalR_Reply: 1 } }, { new: true, upsert: true });
  const 총대댓글수 = r_replycounter.totalR_Reply + 1;

  if (!r_replycounter) {
    return res.status(500).json({ message: "Counter not found" });
  }
  try {
    const newR_Reply = new R_Reply({
      postRId : id,
      selectedRId : rid,
      _id: 총대댓글수 + 1, //댓글번호
      r_rwriter : r_rwriter,
      r_rwriteDate : r_rwriteDate,
      r_reply : r_reply,
      isRSecret : isRSecret
    });
    await newR_Reply.save();
    console.log(isRSecret)
    return res.status(200).json({ message: `Reply created successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

/// 질문글 대댓글 작성
app.post("/postAr_reply/:id/:rid", async (req, res) => {
  const { Ar_reply, isARSecret, Ar_rwriteDate, Ar_rwriter } = req.body;
  const { id, rid } = req.params;

  console.log(rid);


  const post = await Ask.findOne({ _id: id });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const reply = await AReply.findOne({ _id: rid });
  if (!reply) {
    return res.status(404).json({ message: "Reply not found" });
  }

  const Ar_replycounter = await AR_ReplyCounter.findOneAndUpdate({ name: '대댓글 수' }, { $inc: { totalR_Reply: 1 } }, { new: true, upsert: true });
  const 총대댓글수 = Ar_replycounter.totalR_Reply + 1;

  if (!Ar_replycounter) {
    return res.status(500).json({ message: "Counter not found" });
  }
  try {
    const newAR_Reply = new AR_Reply({
      postRId : id,
      selectedARId : rid,
      _id: 총대댓글수 + 1, //댓글번호
      Ar_rwriter : Ar_rwriter,
      Ar_rwriteDate : Ar_rwriteDate,
      Ar_reply : Ar_reply,
      isARSecret : isARSecret
    });
    await newAR_Reply.save();
    console.log(isARSecret)
    return res.status(200).json({ message: `Reply created successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

app.post("/postreply", async (req, res) => {
  const { reply } = req.body;

  const replycounter = await ReplyCounter.findOneAndUpdate(
    { name: "댓글 수" },
    { $inc: { totalReply: 1 } },
    { new: true, upsert: true }
  );
  const 총댓글수 = replycounter.totalReply + 1;

  if (!replycounter) {
    return res.status(500).json({ message: "Counter not found" });
  }
  try {
    const newReply = new Reply({
      _id: 총댓글수 + 1,
      reply: reply,
    });
    await newReply.save();

    return res.status(200).json({ message: `Reply created successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

app.post("/postAsk", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  const { title, content, tag, writer, writeDate } = req.body;

  const counter = await Counter.findOneAndUpdate(
    { name: "질문 게시물 수" },
    { $inc: { totalWrite: 1 } },
    { new: true, upsert: true }
  );
  const totalWrite = counter.totalWrite + 1;

  if (!counter) {
    return res.status(500).json({ message: "Counter not found" });
  }
  try {
    const newAsk = new Ask({
      _id: totalWrite + 1,
      _user: userId,
      title: title,
      content: content,
      tag: tag,
      writer: writer,
      writeDate: writeDate,
      views: 0,
    });
    await newAsk.save();

    return res.status(200).json({ message: `Ask created successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

app.post("/postWrite", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  const { number, period, date, tag, title, content, writer, writeDate } =
    req.body;

  const counter = await Counter.findOneAndUpdate(
    { name: "스터디 모집 게시물 수" },
    { $inc: { totalWrite: 1 } },
    { new: true, upsert: true }
  );
  const totalWrite = counter.totalWrite + 1;

  /*_id: Number(총게시물갯수 + 1), */

  if (!counter) {
    return res.status(500).json({ message: "Counter not found" });
  }
  try {
    const newWrite = new Write({
      _id: totalWrite + 1,
      _user: userId,
      number: number,
      period: period,
      date: date,
      tag: tag,
      title: title,
      content: content,
      writer: writer,
      writeDate: writeDate,
      recruit: true, //모집여부
      views: 0,
    });
    await newWrite.save();

    return res.status(200).json({ message: `Write created successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

app.post("/postModify", async (req, res) => {
  const { _id, number, period, date, tag, title, content, recruit } = req.body;

  try {
    const updatedWrite = await Write.findOneAndUpdate(
      { _id },
      {
        $set: { number, period, date, tag, title, content, recruit },
      }
    );

    return res
      .status(200)
      .json({ message: `Write ${_id} updated successfully`, updatedWrite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

app.get("/getWrite/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const result = await Write.find({ _id: Number(req.params.id) });
    if (result) {
      let sameUser = false;
      if (userId === result[0]._user) sameUser = true;
      return res.status(200).json({
        result: result,
        sameUser: sameUser,
        message: `id 가져오기 성공`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getWrite2/:id", async (req, res) => {
  try {
    const result = await Write.find({ _id: Number(req.params.id) });
    if (result) {
      return res.status(200).json({
        result: result,
        sameUser: false,
        message: `id 가져오기 성공`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.delete("/writeDelete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Write collection에서 해당 id 값의 document를 삭제
    const result = await Write.deleteOne({ _id: id });

    // Counter collection에서 "게시물 수" name 값을 가진 document의 totalWrite 필드값을 -1 해줌
    const counter = await Counter.findOneAndUpdate(
      { name: "스터디 모집 게시물 수" },
      { $inc: { totalWrite: -1 } }
    );
    res.status(200).json({ message: "글이 삭제되었습니다.", counter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "글 삭제에 실패하였습니다." });
  }
});

app.get("/getAsk/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const result = await Ask.find({ _id: Number(req.params.id) });
    if (result) {
      let sameUser = false;
      if (userId === result[0]._user) sameUser = true;
      return res.status(200).json({
        result: result,
        sameUser: sameUser,
        message: `id 가져오기 성공`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getAsk2/:id", async (req, res) => {
  try {
    const result = await Ask.find({ _id: Number(req.params.id) });
    if (result) {
      return res.status(200).json({
        result: result,
        sameUser: false,
        message: `id 가져오기 성공`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/askModify", async (req, res) => {
  const { _id, tag, title, content } = req.body;
  console.log(req.body);
  try {
    const updatedWrite = await Ask.findOneAndUpdate(
      { _id },
      {
        $set: { tag, title, content },
      }
    );
    return res
      .status(200)
      .json({ message: `Write ${_id} updated successfully`, updatedWrite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

app.delete("/askDelete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Write collection에서 해당 id 값의 document를 삭제
    const result = await Ask.deleteOne({ _id: id });

    // Counter collection에서 "게시물 수" name 값을 가진 document의 totalWrite 필드값을 -1 해줌
    const counter = await Counter.findOneAndUpdate(
      { name: "질문 게시물 수" },
      { $inc: { totalWrite: -1 } }
    );
    res.status(200).json({ message: "글이 삭제되었습니다.", counter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "글 삭제에 실패하였습니다." });
  }
});

// 댓글 
app.get("/getReply/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    
    const result = await Reply.find({ postId: req.params.id})

    if (result) {

      let sameUsers = false;
      console.log(req.params.postId);
      return res.status(200).json({
        data: result,
        sameUsers: sameUsers,
        message: ` ${typeof req.params.postId}댓글 가져오기 성공`,
      });
    } 
    else {
      return res.status(404).json({ message: "댓글이 존재하지 않습니다." });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// 질문 댓글 
app.get("/getAReply/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    
    const result = await AReply.find({ postId: req.params.id})

    if (result) {

      let sameAUsers = false;
      if (userId === result[0]._user) sameAUsers = true;
      console.log(req.params.postId);
      return res.status(200).json({
        data: result,
        sameAUsers: sameAUsers,
        message: ` ${typeof req.params.postId}댓글 가져오기 성공`,
      });
    } 
    else {
      return res.status(404).json({ message: "댓글이 존재하지 않습니다." });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// 댓글 내용 가져오기 Ask
app.get("/askView/:id/modify/:replyId", async(req, res) => {
  const postId = req.params.id;
  const replyId = req.params.replyId;

  try {
    const result = await AReply.find({ postId: Number(postId), _id: Number(replyId)  });
    console.log(result);
    if(result) {
      return res.status(200).json({
        result: result,
        message: `댓글 id 가져오기 성공`,
      });
    }
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
})

// 댓글 수정 Ask
app.post("/viewAReplyModify", async(req, res) => {
  const { postId, _id, ArWriteDate, Areply, isASecret } = req.body;

  try {
    const updatedViewReplyModify = await AReply.findOneAndUpdate(
      { postId, _id },
      {
        $set: { ArWriteDate, Areply, isASecret },
      }
    );

    return res
      .status(200)
      .json({ message: `reply ${_id} updated successfully`, updatedViewReplyModify });
  } catch(error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 댓글삭제 Ask
app.delete("/askView/:id/reply/:replyId", async(req, res) => {
  const postId = req.params.id;
  const replyId = req.params.replyId;

  try {
    const reply = await AReply.findOne({ postId: postId, _id: replyId });

    if(!reply) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    console.log(reply);

    await AReply.deleteOne({ postId: postId, _id: replyId });

    res.status(200).json({ message: "댓글을 삭제하였습니다." });
  } catch(error) {
    console.log(error);
    res.status(500).json({ message: "댓글삭제 실패" });
  }
});

app.get("/", (req, res) => {
  res.send("hello world!");
});

// 대댓글 
app.get("/getR_Reply/:id/:rid", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;
  const selectedRId = req.params.rid;

  try {
    const result = await R_Reply.find({ postRId : req.params.id, selectedRId : Number(selectedRId)})
    if (result) {
      console.log(result);
      let RsameUsers = false;
      console.log(req.params.postRId);
      console.log(req.params.rid);
      return res.status(200).json({
        data: result, selectedRId,
        RsameUsers: RsameUsers,
        message: ` ${typeof req.params.rid}대댓글 가져오기 성공`,
      });
    } 
    else {
      return res.status(404).json({ message: "대댓글이 존재하지 않습니다." });
    }

    
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


// 질문 대댓글 
app.get("/getAR_Reply/:id/:rid", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;
  const selectedARId = req.params.rid;

  try {
    const result = await AR_Reply.find({ postRId : req.params.id, selectedARId : Number(selectedARId)})
    if (result) {
      console.log(result);
      let ARsameUsers = false;
      //if (userId === result[0]._user) ARsameUsers = true;

      return res.status(200).json({
        data: result, selectedARId,
        ARsameUsers: ARsameUsers,
        message: ` ${typeof req.params.rid}대댓글 가져오기 성공`,
      });
    } 
    else {
      return res.status(404).json({ message: "대댓글이 존재하지 않습니다." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});



app.listen(8080, () => {
  console.log("서버가 시작되었습니다.");
});

// -------------------------------------------------------------------------

app.use(express.json());
app.post('/openStudy', async (req, res) => {
  try {
    const { img, title, hashtag, personNum } = req.body;

    const newOpenStudy = new OpenStudy({
      img: img,
      title: title,
      tags: hashtag,
      personNum: personNum
    });

    await newOpenStudy.save();
    res.status(200).json({ message: `OpenStudy created successfully` });
  } catch(err) {
    console.log(err);
    res.status(500).json({ message: `err.message` });
  }
});

  app.get("/openStudies", async (req, res) => {
    //const { page, limit } = req.query;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
  
    const offset = (page - 1) * limit;
  
    try {
      const openStudies = await OpenStudy.find().skip(offset).limit(limit);
      //const totalOpenStudies = openStudies.length;
      //console.log(totalOpenStudies);

      //const currentOpenStudies = await OpenStudy.find().skip(offset).limit(limit);
    
        /* if(openStudies){
          return res.status(200).json({
            openStudies: openStudies,
            message: '오픈스터디 목록 가져오기 성공',
          });
        } */
        if(openStudies.length > 0) {
          return res.status(200).json({ 
            openStudies: openStudies,
            //totalOpenStudies,
            message: '오픈스터디 목록 가져오기 성공',
            success: true, 
            openStudies 
          });
        } else {
          return res.status(404).json({
            message: "데이터가 존재하지 않습니다",
            success: false,
          });
        }
      }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
      }
    });







    app.get("/search", async (req, res) => {
      const option = decodeURIComponent(req.query.selected);
      const value = decodeURIComponent(req.query.value);
    
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
    
      const offset = (page - 1) * limit;
      var openStudiesSearch = [];

      try {
        if(option === 'title') {
          openStudiesSearch = await OpenStudy.find({ title: value }, null, { skip: offset, limit: limit });
        }
        else if(option === 'tags') {
          openStudiesSearch = await OpenStudy.find({ tags: { $in: [value] } }, null, { skip: offset, limit: limit });
        }
    
        if(openStudiesSearch.length > 0) {
          return res.status(200).json({ 
            openStudies: openStudiesSearch,
            //totalOpenStudies,
            message: '검색목록 가져오기 성공',
            success: true
          });
        } else {
          return res.status(404).json({
            message: "데이터가 존재하지 않습니다",
            success: false,
          });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
      }
    })


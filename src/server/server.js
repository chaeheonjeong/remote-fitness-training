const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const Write = require("./models/write");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const nodemailer = require("nodemailer");
const Verify = require("./models/verify");
const { dblClick } = require("@testing-library/user-event/dist/click");

const OpenStudy = require("./models/openStudy");
//const { default: StudyRoomCard } = require("../component/StudyRoomCard");
const StudyTime = require("./models/studyTime");
const GoalTime = require("./models/goalTime");
const Schedule = require("./models/schedule");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const mysecretkey = "capstone";

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
app.get("/user", async(req, res) =>{
    const token = req.headers.authorization;
    try{
        const {email} = jwt.verify(token, mysecretkey);
        const user = await User.findOne({email});
        res.json(user);
        //console.log(res.data);
    }catch(err){
        res.status(401).send({message : 'Invalid token'});
    }
});

//일정 정보 저장
app.post("/schedules", async(req, res) => {
    const {date, title, contents} = req.body;
    try{
        const newSchedule = new Schedule({
            title: title,
            date: date,
            contents: contents
        });
        await newSchedule.save();
        return res.status(201).json(newSchedule);
    } catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    } 
});

//저장된 일정 정보 가져오기
app.get('/schedules', async(req, res) => {
    try{
        const schedules = await Schedule.find();
        return res.status(200).json(schedules);
    }catch(err){
        console.error(err);
        res.status(500).json({message : 'Server Error'})
    }
});

app.post("/userInfo", async(req,res) => {
    console.log(req.body);
    const {name, email, password} = req.body;

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
    if (userStudyTime) {
      const time = userStudyTime.studyTime;
      const timeH = Math.floor(time / 3600);
      const timeM = Math.floor((time % 3600) / 60);
      return res.status(200).json({
        timeH: timeH,
        timeM: timeM,
        message: `${time}공부 시간 가져오기 성공`,
      });
    }
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
      res.status(400).json({
        message: "목표 공부시간을 설정해주세요.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});




app.post("/postWrite", async (req, res) => {
  const { number, period, date, tag, title, content } = req.body;
  try {
    const newWrite = new Write({
      number: number,
      period: period,
      date: date,
      tag : tag,
      title : title,
      content : JSON.parse(content),
    });
    await newWrite.save();
    
    return res.status(200).json({ message: `Write created successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `${date}서버오류` });
  }
});


app.get('/getwrite', function(req, res) {
  Write.find({}, function(err, write) {
    if (err) {
      // 에러가 발생했다면 에러 메시지를 반환합니다.
      res.status(500).send(err);
    } else {
      // 검색된 데이터를 반환합니다.
      res.json(write);
      console.log(res.body);
    }
  });
});





app.post("/postWrite", async (req, res) => {
  const { number, period, date, tag, title, content } = req.body;
  try {
    const newWrite = new Write({
      number: number,
      period: period,
      date: date,
      tag : tag,
      title : title,
      content : JSON.parse(content),
    });
    await newWrite.save();
    
    return res.status(200).json({ message: `Write created successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `${date}서버오류` });
  }
});


app.get('/getwrite', function(req, res) {
  Write.find({}, function(err, write) {
    if (err) {
      // 에러가 발생했다면 에러 메시지를 반환합니다.
      res.status(500).send(err);
    } else {
      // 검색된 데이터를 반환합니다.
      res.json(write);
      console.log(res.body);
    }
  });
});


app.get("/ranking", async (req, res) => {
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
        message: "공부한 사용자가 존재하지 않습니다.",
      });
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

/*app.get('/mainStudy', function(req, res) {
  res.render('MainStudy')
})*/

/*app.post('/openStudyModal', function(req, res) {
    db.collection('openStudy').insertOne({ title : req.body.title, hashtag : req.body.hashtag, personNum : req.body.personNum }, 
        function(err, result) {
            console.log("새로운 open study의 정보를 저장하였습니다.");
    })
});

app.get('/mainOpenStudy', function(req, res) {
  db.collection('openStudy').find().toArray(function (err, result) {
    res.render('MainOpenStudy.js', { rooms : result });
    //console.log(result);
  });
});*/

/*app.post("/", async (req, res) => {
  const { title, hashtag, personNum } = req.body;
  try {
    const newOpenStudy = new OpenStudy({
      title: title,
      hashtag: hashtag,
      personNum: personNum
    });
    await newOpenStudy.save();
    return res.status(200).json({message : "OpenStudyRoom created successfully" });
  } catch (error) {
    console.err(err);
    res.status(500).json({ message: "Server Error" });
  }

  newOpenStudy.save(function(err) {
    if(err) return handleError(err);
  })
});

app.get('/', async (req, res) => {
  try {
    db.collection('openStudy').find().toArray((err, result) => {
      console.log(result);
      //res.render('MainOpenStudy.js', { rooms : result })
      res.send(result);
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
  
  try {
    const rooms = await OpenStudy.find();
    res.json(rooms);
    console.log(rooms);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }


});*/


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

  try {
    const openStudies = await OpenStudy.find()
      if(openStudies){
        return res.status(200).json({
          openStudies: openStudies,
          message: '오픈스터디 목록 가져오기 성공',
        });
      }
    }
  catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  });
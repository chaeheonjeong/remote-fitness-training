const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const User = require("./models/user");
const Write = require("./models/write");
const TWrite = require("./models/tWrite");
const ReviewContent = require("./models/reviewContent");

const Ask = require("./models/ask");
const Reply = require("./models/reply");
const R_Reply = require("./models/r_reply");
const Counter = require("./models/counter");
const ReplyCounter = require("./models/replycounter");
const R_ReplyCounter = require("./models/r_replycounter");
const SelectionInfo = require("./models/selectionInfo");
const SelectionTInfo = require("./models/selectionTInfo");

const TReply = require("./models/Treply");
const TR_Reply = require("./models/Tr_reply");
const TReplyCounter = require("./models/Treplycounter");
const TR_ReplyCounter = require("./models/Tr_replycounter");

const AReply = require("./models/Areply");
const AR_Reply = require("./models/Ar_reply");
const AReplyCounter = require("./models/Areplycounter");
const AR_ReplyCounter = require("./models/Ar_replycounter");
const AskARGood = require("./models/askARGood");
const Portfolio = require("./models/portfolio");
const Alarm = require("./models/alarm");

const HappinessIndex = require("./models/happinessIndex");
const Score = require("./models/score");
const TScore = require("./models/Tscore");

const path = require("path");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");
const app = express();
const nodemailer = require("nodemailer");
const Verify = require("./models/verify");
const StudyTime = require("./models/studyTime");
const GoalTime = require("./models/goalTime");
//const { dblClick } = require("@testing-library/user-event/dist/click");

const AskGood = require("./models/askGood");
const PostGood = require("./models/postGood");
const TPostGood = require("./models/tPostGood");
//const { dblClick } = require("@testing-library/user-event/dist/click");

//const { dblClick } = require("@testing-library/user-event/dist/cjs/event/behavior/click");

const TApplicant = require("./models/tApplicant");
const SApplicant = require("./models/sApplicant");

const OpenStudy = require("./models/openStudy");
//const { default: StudyRoomCard } = require("../component/StudyRoomCard");
const Schedule = require("./models/schedule");
const boot = require("./lib/RTC/boot");

const ObjectId = mongoose.Types.ObjectId;
const auth = require("./auth");
const { profile } = require("console");
const RoomSchedule = require("./models/roomSchedule");
/* const ReviewContent = require("./models/reviewContent"); */

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./server/uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1024 * 1024 * 5 },
// });
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
/* app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/images", express.static("./src/server/images")); */
// app.use("/images", express.static("./server/uploads"));

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use("/images", express.static("./server/images"));
const mysecretkey = "capstone";

var db;
mongoose
  .connect(
    "mongodb+srv://admin:password1234@capstone.zymalsv.mongodb.net/capstone?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB 접속완료"))
  .catch((err) => console.log(err));

boot();
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send({ name: user.name, email: user.email, _id: user._id });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server Error" });
  }
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

app.post("/nick-change", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  const { nick } = req.body;

  try {
    const userWithSameNick = await User.findOne({ name: nick });
    if (userWithSameNick) {
      return res.status(400).json({ message: "이미 존재하는 닉네임 입니다." });
    }

    // Update user's nick in database
    await User.findByIdAndUpdate(userId, { name: nick });

    res.status(200).json({ message: "닉네임이 변경되었습니다" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 에러 발생" });
  }
});

app.put("/img-change/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const image = req.body.image;
    const user = await User.findByIdAndUpdate(id, { image }, { new: true });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

app.get("/img-change", auth, async (req, res) => {
  try {
    const id = req.user.id;
    console.log(id);

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const image = user.image;
    return res.status(200).json({ image });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});

//로그인한 사용자의 비밀번호를 변경
app.put("/users/change-password/:id", auth, async (req, res) => {
  const id = req.params.id;
  const { password, newPassword, confirmNewPassword } = req.body;

  try {
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(404).send("User not found");

    const isMatch = user.password == password;
    if (!isMatch) return res.status(400).send("Invalid password");

    if (newPassword !== confirmNewPassword) {
      return res.status(400).send("Password do not match");
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .send({ error: "New password must be at least 6 characters long" });
    }

    user.password = newPassword;
    await user.save();

    res.send("Password Update Successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

//회원 탈퇴 시 사용자의 정보 삭제
app.delete("/users/withdraw/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    await User.findOneAndDelete({ _id: id });

    res.send({ message: "Withdraw Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

//일정 정보 저장
app.post("/schedules", auth, async (req, res) => {
  const { date, title, contents } = req.body;
  try {
    const newSchedule = new Schedule({
      title: title,
      date: date,
      contents: contents,
      userId: req.user.id,
    });
    await newSchedule.save();
    return res.status(201).json(newSchedule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

//저장된 일정 정보 가져오기(로그인된 유저가 자신의 일정만 보이도록)
app.get("/schedules", auth, async (req, res) => {
  try {
    const schedules = await Schedule.find({ userId: req.user.id });
    return res.status(200).json(schedules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

//일정 수정하기
app.put("/schedules/:id", (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const contents = req.body.contents;

  console.log(req.body);
  console.log(id);

  Schedule.findOneAndUpdate({ _id: id }, { title, contents }, { new: true })
    .then((updatedSchedule) => {
      res.send(updatedSchedule);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

//일정 삭제하기
app.delete("/schedules/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);

  Schedule.findOneAndDelete({ _id: id })
    .then((deletedSchedule) => {
      res.send(deletedSchedule);
      console.log(deletedSchedule);

      if (!deletedSchedule) {
        return res.status(404).send();
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});
//포트폴리오 작성 저장
app.post("/portfolio", auth, async (req, res) => {
  const {
    gender,
    career,
    price,
    sports,
    paymentMethods,
    tags,
    title,
    content,
    writer,
    writeDate,
  } = req.body;

  try {
    const newPortfolio = new Portfolio({
      gender: gender,
      career: career,
      price: price,
      sports: sports,
      paymentMethods: paymentMethods,
      tags: tags,
      title: title,
      content: content,
      writer: writer,
      writeDate: writeDate,
      userId: req.user.id,
    });
    await newPortfolio.save();
    return res.status(201).json(newPortfolio);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server Error" });
  }
});

//포트폴리오 자신이 작성한 것 불러오기
app.get("/portfolio", auth, async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.user.id });
    console.log(portfolios);
    return res.status(200).json(portfolios);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//클릭한 프로필에 해당하는 사용자의 포트폴리오를 불러오기
app.get("/portfolio/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const userPortfolios = await Portfolio.find({ userId: userId });
    console.log(userPortfolios);
    return res.status(200).json(userPortfolios);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.post("/recruitTSave", async (req, res) => {
  const { _id, recruit } = req.body;

  console.log("myId: ", _id);
  console.log("@@@@@: ", recruit);

  try {
    const updatedWrite = await TWrite.findOneAndUpdate(
      { _id },
      {
        $set: { recruit },
      }
    );

    return res
      .status(200)
      .json({ message: `TWrite ${_id} updated successfully`, updatedWrite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

app.post("/recruitSave", async (req, res) => {
  const { _id, recruit } = req.body;

  try {
    console.log("myId: ", _id);
    console.log("@@@@@: ", recruit);
    const updatedWrite = await Write.findOneAndUpdate(
      { _id },
      {
        $set: { recruit },
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

//포트폴리오 작성자 정보 가져오기
app.get("/portfolioInfo/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const writerInfo = await User.find({ _id: userId });
    console.log(writerInfo);
    return res.status(200).json(writerInfo);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//포트폴리오 수정
app.post("/portfolioModify", auth, async (req, res) => {
  const {
    gender,
    career,
    price,
    sports,
    paymentMethods,
    tags,
    title,
    content,
  } = req.body;
  const userId = req.user.id;
  console.log(req.body);
  try {
    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          gender,
          career,
          price,
          sports,
          paymentMethods,
          tags,
          title,
          content,
        },
      }
    );
    return res
      .status(200)
      .json({ message: `updated successfully`, updatedPortfolio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

//로그인한 사용자 정보를 검색
app.get("/users", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send({ name: user.name, email: user.email, _id: user._id });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server Error" });
  }
});

app.get("/getNotiCount", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;
  var notRead = 0;
  var notiCount = 0;

  try {
    const getData = await Alarm.find({ _user: String(userId) });

    for (var i = 0; i < getData[0].content.length; i++) {
      notRead = getData[0].content[i].read;
      if (notRead === false) {
        notiCount += 1;
      }
    }
    return res.status(200).json({
      data: notiCount,
      message: `알림 수 가져오기 성공`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getHappinessIndex", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  const defaultValue = 50;

  try {
    const result = await HappinessIndex.findOne({ _user: userId });

    if (result === null) {
      return res.status(200).json({
        data: defaultValue,
        message: `가져올 행복지수가 없습니다.`,
        success: true,
      });
    } else {
      return res.status(200).json({
        data: Number(result.happinessIndex),
        message: `행복지수 가져오기`,
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/* app.get("/updateOrNot", async(req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const teacherId = decodedToken.id;

  const filter = {
    teacherId: teacherId,
    calculated: false,
  };

  console.log("filter ", filter);

  try {
    const getInfo = await Score.find(filter);
    const getTInfo = await TScore.find(filter);

    const updateOrNot = [...getInfo, ...getTInfo];

    console.log("updateOrNot ", updateOrNot);

    if(updateOrNot.length !== 0) {
      return res.status(200).json({
        data: updateOrNot,
        message: '별점 업데이트',
        success: true,
      })
    } else {
      return res.status(200).json({
        data: updateOrNot,
        message: '별점 업데이트 X',
        success: false,
      })
    }
  } catch(error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}); */

/* app.post("/saveHappinessIndex", async(req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  const { happinessIndex } = req.body;
  try {
  if(happinessIndex !== undefined) {
    const existing = await HappinessIndex.findOne({ _user: userId });
    
    console.log("-", typeof(happinessIndex));
    console.log("--", typeof(existing.happinessIndex));
    if(existing) {
      existing.happinessIndex = String(happinessIndex);

      await existing.save();
      //console.log("-", existing.happinessIndex);
    } else {
      //console.log("hello!!");
      const newIndex = new HappinessIndex({
        _user: userId,
        happinessIndex: String(Math.round(happinessIndex * 10) / 10),
      });
      await newIndex.save();
    }

    const changes = await Score.find({ teacherId: userId });
    const tChanges = await TScore.find({ teacherId: userId });
      if(changes) {
        for(const change of changes) {
          if(change.studentId === null) {
            console.log("************* ", change._id, change.stars);
          }
          //console.log(change.teacherId, change.stars, change.calculated);
          if(change.calculated === false) {
            change.calculated = true;
            await change.save();
            //console.log(change.calculated);
          }
        }
      }

      if(tChanges) {
        for(const tChange of tChanges) {
          if(tChange.studentId === null) {
            console.log("************* ", tChange._id, tChange.stars);
          }
          if(tChange.calculated === false) {
            tChange.calculated = true;
            await tChange.save();
          }
        }
      }

    return res.status(200).json({ message: `행복지수 저장 성공` });
}
  } catch(error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}); */

app.post("/nick-change", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  const { nick } = req.body;

  try {
    const userWithSameNick = await User.findOne({ name: nick });
    if (userWithSameNick) {
      return res.status(400).json({ message: "이미 존재하는 닉네임 입니다." });
    }

    // Update user's nick in database
    await User.findByIdAndUpdate(userId, { name: nick });

    res.status(200).json({ message: "닉네임이 변경되었습니다" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 에러 발생" });
  }
});

app.put("/img-change/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const image = req.body.image;
    const user = await User.findByIdAndUpdate(id, { image }, { new: true });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

app.get("/img-change", auth, async (req, res) => {
  try {
    const id = req.user.id;
    console.log(id);

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const image = user.image;
    return res.status(200).json({ image });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});

//로그인한 사용자의 비밀번호를 변경
app.put("/users/change-password/:id", auth, async (req, res) => {
  const id = req.params.id;
  const { password, newPassword, confirmNewPassword } = req.body;

  try {
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(404).send("User not found");

    const isMatch = user.password == password;
    if (!isMatch) return res.status(400).send("Invalid password");

    if (newPassword !== confirmNewPassword) {
      return res.status(400).send("Password do not match");
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .send({ error: "New password must be at least 6 characters long" });
    }

    user.password = newPassword;
    await user.save();

    res.send("Password Update Successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

//회원 탈퇴 시 사용자의 정보 삭제
app.delete("/users/withdraw/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    await User.findOneAndDelete({ _id: id });

    res.send({ message: "Withdraw Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

//일정 정보 저장
app.post("/schedules", auth, async (req, res) => {
  const { date, title, contents } = req.body;
  try {
    const newSchedule = new Schedule({
      title: title,
      date: date,
      contents: contents,
      userId: req.user.id,
    });
    await newSchedule.save();
    return res.status(201).json(newSchedule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/userInfo", async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
});

//저장된 일정 정보 가져오기(로그인된 유저가 자신의 일정만 보이도록)
app.get("/schedules", auth, async (req, res) => {
  try {
    const schedules = await Schedule.find({ userId: req.user.id });
    return res.status(200).json(schedules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

//일정 수정하기
app.put("/schedules/:id", (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const contents = req.body.contents;

  console.log(req.body);
  console.log(id);

  Schedule.findOneAndUpdate({ _id: id }, { title, contents }, { new: true })
    .then((updatedSchedule) => {
      res.send(updatedSchedule);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

//일정 삭제하기
app.delete("/schedules/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);

  Schedule.findOneAndDelete({ _id: id })
    .then((deletedSchedule) => {
      res.send(deletedSchedule);
      console.log(deletedSchedule);

      if (!deletedSchedule) {
        return res.status(404).send();
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

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

/* app.get("/myRanking", async (req, res) => {
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
});*/

// 댓글 작성
app.post("/postTreply/:id", async (req, res) => {
  const { reply, /*  isSecret, */ rwriter, rwriteDate } = req.body;
  const { id } = req.params;

  const post = await TWrite.findOne({ _id: id });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const replycounter = await TReplyCounter.findOneAndUpdate(
    { name: "댓글 수" },
    { $inc: { totalReply: 1 } },
    { new: true, upsert: true }
  );
  const 총댓글수 = replycounter.totalReply + 1;

  const rwriterId = await User.findOne({ name: rwriter });

  if (!replycounter) {
    return res.status(500).json({ message: "Counter not found" });
  }
  try {
    const newReply = new TReply({
      postId: id,
      _id: 총댓글수 + 1,
      rwriter: rwriter,
      _user: rwriterId._id,
      rwriteDate: rwriteDate,
      reply: reply,
      //isSecret : isSecret
    });
    await newReply.save();

    return res.status(200).json({ message: `Reply created successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

// 방 목록 가져오기
app.get("/rooms", async (req, res) => {
  try {
    // DB에서 모든 SelectionInfo 정보를 가져옴
    const selectionTInfoList = await SelectionTInfo.find();
    // 방 제목만 추출하여 배열로 변환
    const roomTitles = selectionTInfoList.map(
      (selectionTInfo) => selectionTInfo.roomTitle
    );
    res.status(200).json(roomTitles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
});

app.get("/selectionTInfo", async (req, res) => {
  try {
    const selectionTInfo = await SelectionTInfo.find();
    res.status(200).json(selectionTInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
});

app.post("/reviews", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;
  const { stars, studentName, writeDate, roomName, teacherName, teacherId } =
    req.body;
  try {
    // 새로운 후기 생성
    const score = new Score({
      stars: stars,
      studentId: userId,
      studentName: studentName,
      writeDate: writeDate,
      roomName: roomName, // 방 이름 저장
      teacherName: teacherName,
      teacherId: teacherId,
    });

    // 후기 저장
    const savedScore = await score.save();

    res.status(201).json(savedScore);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getReview/:id", async (req, res) => {
  const teacherId = req.params.id;

  try {
    const reviews = await TScore.find({ teacherId: teacherId });
    const reviews2 = await Score.find({ teacherId: teacherId });

    const reviewPack = [...reviews, ...reviews2];

    if (reviewPack) {
      return res.status(200).json({
        result: reviewPack,
        message: `ReviewPack 가져오기 성공`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
});

///// 후기 강사모집의 경우
// 후기 작성 요청 처리
/* app.post("/Treviews", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;
  const { stars, studentName, writeDate, roomName, teacherName, teacherId, review } =
    req.body;
  try {
    const savedTScores = [];

    for (let i = 0; i < teacherName.length; i++) {
      // 새로운 후기 생성
      const Tscore = new TScore({
        stars: stars[i],
        studentId: userId,
        studentName: studentName,
        writeDate: writeDate,
        roomName: roomName,
        teacherName: teacherName[i],
        teacherId: teacherId[i],
        review: review,
      });

      // 후기 저장
      const savedTScore = await Tscore.save();
      savedTScores.push(savedTScore);
    }

    res.status(201).json(savedTScores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}); */
///// 후기 강사모집의 경우
app.post("/Treviews", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;
  const {
    stars,
    studentName,
    writeDate,
    roomName,
    teacherName,
    teacherId,
    review,
  } = req.body;
  try {
    // 새로운 후기 생성
    const Tscore = new TScore({
      stars: stars,
      studentId: userId,
      studentName: studentName,
      writeDate: writeDate,
      roomName: roomName,
      teacherName: teacherName,
      teacherId: teacherId,
      review: review,
    });

    // 후기 저장
    const savedTScore = await Tscore.save();

    res.status(201).json(savedTScore);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 방 목록 가져오기
app.get("/Trooms", async (req, res) => {
  try {
    // DB에서 모든 SelectionInfo 정보를 가져옴
    const selectionInfoList = await SelectionInfo.find();
    // 방 제목만 추출하여 배열로 변환
    const TroomTitles = selectionInfoList.map(
      (selectionInfo) => selectionInfo.roomTitle
    );
    res.status(200).json(TroomTitles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
});

app.get("/selectionInfo", async (req, res) => {
  try {
    const selectionInfo = await SelectionInfo.find();
    res.status(200).json(selectionInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 댓글 작성
app.post("/postreply/:id", async (req, res) => {
  const { reply, /*  isSecret, */ rwriter, rwriteDate } = req.body;
  const { id } = req.params;

  const post = await Write.findOne({ _id: id });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const replycounter = await ReplyCounter.findOneAndUpdate(
    { name: "댓글 수" },
    { $inc: { totalReply: 1 } },
    { new: true, upsert: true }
  );
  const 총댓글수 = replycounter.totalReply + 1;

  const rwriterId = await User.findOne({ name: rwriter });

  if (!replycounter) {
    return res.status(500).json({ message: "Counter not found" });
  }
  try {
    const newReply = new Reply({
      postId: id,
      _id: 총댓글수 + 1,
      rwriter: rwriter,
      _user: rwriterId._id,
      rwriteDate: rwriteDate,
      reply: reply,
      //isSecret : isSecret
    });
    await newReply.save();

    return res.status(200).json({ message: `Reply created successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

//ask 대댓글
app.get("/getAR_Reply/:id/:rid", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;
  
  const postRId = req.params.id;
  const selectedARId = req.params.rid;

  try {
    const result = await AR_Reply.find({ postRId : Number(postRId), selectedARId : Number(selectedARId) })
    if (result) {
      const RsameUsers = result.map((reply) => reply._user === userId);

      // 사용자 프로필 이미지 반환
      const profileImgs = await Promise.all(
        result.map(async (Ar_reply) => {
          const user = await User.findOne({ name: Ar_reply.Ar_rwriter });

          if(!user) {
            throw new Error(`User with name "${Ar_reply.Ar_rwriter}" not found`);
          }

          return user.image;
        })
      );

      return res.status(200).json({
        data: result,
        RsameUsers: RsameUsers,
        profileImgs: profileImgs,
        message: ` ${typeof selectedARId}대댓글 가져오기 성공`,
      });
    } 
    /* else {
      return res.status(404).json({ message: "대댓글이 존재하지 않습니다." });
    } */

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/viewReplyRModify", async (req, res) => {
  const { postRId, selectedRId, _id, r_rWriteDate, r_reply/* , isRSecret */ } =
    req.body;

  try {
    const updatedViewReplyRModify = await R_Reply.findOneAndUpdate(
      { postRId, selectedRId, _id },
      {
        $set: { r_rWriteDate, r_reply/* , isRSecret */ },
      },
      { new: true }
    );

      console.log(r_reply);

    return res.status(200).json({
      message: `r_reply ${_id} updated successfully`,
      updatedViewReplyRModify,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// 대댓글 T
app.get("/getTR_Reply/:id/:rid", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  const postRId = req.params.id;
  const selectedRId = req.params.rid;

  try {
    const result = await TR_Reply.find({
      postRId: Number(postRId),
      selectedRId: Number(selectedRId),
    });
    if (result) {
      const RsameUsers = result.map((reply) => reply._user === userId);
      console.log(RsameUsers);

      //let RsameUsers = false;
      //console.log('result[0]: ', result[0].r_rwriter);
      //if (userId === result[0].r_rwriter) RsameUsers = true;
      //console.log(postRId);
      //console.log(selectedRId);

      // 사용자 프로필 이미지 반환
      const profileImgs = await Promise.all(
        result.map(async (r_reply) => {
          const user = await User.findOne({ name: r_reply.r_rwriter });

          if (!user) {
            throw new Error(`User with name "${r_reply.r_rwriter}" not found`);
          }

          return user.image;
        })
      );

      return res.status(200).json({
        data: result,
        RsameUsers: RsameUsers,
        profileImgs: profileImgs,
        message: ` ${typeof selectedRId}대댓글 가져오기 성공`,
      });
    } else {
      return res.status(404).json({ message: "대댓글이 존재하지 않습니다." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/// 대댓글 작성
app.post("/postr_reply/:id/:rid", auth, async (req, res) => {
  const { r_reply, isRSecret, r_rwriteDate, r_rwriter } = req.body;
  const { id, rid } = req.params;
  const userId = req.user.id;

  console.log(rid);

  const post = await Write.findOne({ _id: id });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const reply = await Reply.findOne({ _id: rid });
  if (!reply) {
    return res.status(404).json({ message: "Reply not found" });
  }

  const r_replycounter = await R_ReplyCounter.findOneAndUpdate(
    { name: "대댓글 수" },
    { $inc: { totalR_Reply: 1 } },
    { new: true, upsert: true }
  );
  const 총대댓글수 = r_replycounter.totalR_Reply + 1;

  if (!r_replycounter) {
    return res.status(500).json({ message: "Counter not found" });
  }
  try {
    const newR_Reply = new R_Reply({
      postRId: id,
      selectedRId: rid,
      _id: 총대댓글수 + 1, //댓글번호
      r_rwriter: r_rwriter,
      r_rwriteDate: r_rwriteDate,
      r_reply: r_reply,
      isRSecret: isRSecret,
      _user: userId,
    });
    await newR_Reply.save();
    console.log(isRSecret);
    return res.status(200).json({ message: `Reply created successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

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

    return res
      .status(200)
      .json({ message: `R_Reply ${rrid} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

/// 대댓글 작성 T
app.post("/postTr_reply/:id/:rid", async (req, res) => {
  const { r_reply, /* isRSecret, */ r_rwriteDate, r_rwriter } = req.body;
  const { id, rid } = req.params;

  const post = await TWrite.findOne({ _id: id });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const reply = await TReply.findOne({ _id: rid });
  if (!reply) {
    return res.status(404).json({ message: "Reply not found" });
  }

  const r_replycounter = await TR_ReplyCounter.findOneAndUpdate(
    { name: "대댓글 수" },
    { $inc: { totalR_Reply: 1 } },
    { new: true, upsert: true }
  );
  const 총대댓글수 = r_replycounter.totalR_Reply + 1;

  const r_rwriterId = await User.findOne({ name: r_rwriter });

  if (!r_replycounter) {
    return res.status(500).json({ message: "Counter not found" });
  }
  try {
    const newR_Reply = new TR_Reply({
      postRId: id,
      selectedRId: rid,
      _id: 총대댓글수 + 1, //댓글번호
      r_rwriter: r_rwriter,
      _user: r_rwriterId._id,
      r_rwriteDate: r_rwriteDate,
      r_reply: r_reply,
      //isRSecret : isRSecret
    });
    await newR_Reply.save();

    return res.status(200).json({ message: `Reply created successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

// 대댓글 삭제T
app.delete("/postTr_reply/:id/:rid/:rrid", async (req, res) => {
  const { id, rid, rrid } = req.params;

  const post = await TWrite.findOne({ _id: id });
  if (!post) {
    return res.status(404).json({ message: "TPost not found" });
  }

  const reply = await TReply.findOne({ _id: rid });
  if (!reply) {
    return res.status(404).json({ message: "TReply not found" });
  }

  const r_reply = await TR_Reply.findOne({ _id: rrid });
  if (!r_reply) {
    return res.status(404).json({ message: "TR_Reply not found" });
  }

  try {
    await TR_Reply.deleteOne({ _id: rrid });

    return res
      .status(200)
      .json({ message: `TR_Reply ${rrid} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
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

    return res
      .status(200)
      .json({ message: `AR_Reply ${rrid} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

/* app.get("/view/:id/modify/:selectedRId/:rrid", async (req, res) => {
  const postId = req.params.id;
  const selectedRId = req.params.selectedRId;
  const rrid = req.params.rrid;

  try {
    const result = await R_Reply.find({
      postRId: Number(postId),
      selectedRId: Number(selectedRId),
      _id: Number(rrid),
    });
    console.log(result);

    if (result) {
      return res.status(200).json({
        result: result,
        message: `댓글 id 가져오기 성공`,
      });
    } /* reply */
/*   } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});  */

/// 질문글 대댓글 수정
app.get("/view/:id/modify/:selectedARId/:rrid", async (req, res) => {
  const postRId = req.params.id;
  const selectedARId = req.params.selectedARId;
  const rrid = req.params.rrid;

  try {
    const result = await AR_Reply.find({
      postRId: Number(postRId),
      selectedARId: Number(selectedARId),
      _id: Number(rrid),
    });
    console.log(result);
    if (result) {
      return res.status(200).json({
        result: result,
        message: `댓글 id 가져오기 성공`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/viewReplyARModify", async (req, res) => {
  const { postRId, selectedARId, _id, Ar_rWriteDate, Ar_reply, isARSecret } =
    req.body;

  try {
    const updatedViewReplyARModify = await AR_Reply.findOneAndUpdate(
      { postRId, selectedARId, _id },
      {
        $set: { Ar_rWriteDate, Ar_reply, isARSecret },
      }
    );

    return res.status(200).json({
      message: `r_reply ${_id} updated successfully`,
      updatedViewReplyARModify,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//댓글 수정
app.get("/view/:id/modify/:replyId", async (req, res) => {
  const postId = req.params.id;
  const replyId = req.params.replyId;

  try {
    const result = await Reply.find({
      postId: Number(postId),
      _id: Number(replyId),
    });
    console.log(result);
    if (result) {
      return res.status(200).json({
        result: result,
        message: `댓글 id 가져오기 성공`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/viewReplyModify", async (req, res) => {
  const { postId, _id, rWriteDate, reply, isSecret } = req.body;

  try {
    const updatedViewReplyModify = await Reply.findOneAndUpdate(
      { postId, _id },
      {
        $set: { rWriteDate, reply, isSecret },
      }
    );

    return res.status(200).json({
      message: `reply ${_id} updated successfully`,
      updatedViewReplyModify,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// 댓글삭제
app.delete("/view/:id/reply/:replyId", async (req, res) => {
  const postId = req.params.id;
  const replyId = req.params.replyId;

  try {
    const reply = await Reply.findOne({ postId: postId, _id: replyId });

    if (!reply) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    console.log(reply);

    await Reply.deleteOne({ postId: postId, _id: replyId });

    res.status(200).json({ message: "댓글을 삭제하였습니다." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "댓글삭제 실패" });
  }
});
app.post("/postAr_reply/:id/:rid", auth, async (req, res) => {
  const { Ar_reply, isARSecret, Ar_rwriteDate, Ar_rwriter } = req.body;
  const { id, rid } = req.params;
  const userId = req.user.id;

  console.log(rid);

  const post = await Ask.findOne({ _id: id });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const reply = await AReply.findOne({ _id: rid });
  if (!reply) {
    return res.status(404).json({ message: "Reply not found" });
  }

  const Ar_replycounter = await AR_ReplyCounter.findOneAndUpdate(
    { name: "대댓글 수" },
    { $inc: { totalR_Reply: 1 } },
    { new: true, upsert: true }
  );
  const 총대댓글수 = Ar_replycounter.totalR_Reply + 1;

  if (!Ar_replycounter) {
    return res.status(500).json({ message: "Counter not found" });
  }
  try {
    const newAR_Reply = new AR_Reply({
      postRId: id,
      selectedARId: rid,
      _id: 총대댓글수 + 1, //댓글번호
      Ar_rwriter: Ar_rwriter,
      Ar_rwriteDate: Ar_rwriteDate,
      Ar_reply: Ar_reply,
      isARSecret: isARSecret,
      _user: userId,
    });
    await newAR_Reply.save();
    console.log(isARSecret);
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

// 선생님이 학생모집
app.post("/postTWrite", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  const {
    number,
    period,
    date,
    startTime,
    runningTime,
    estimateAmount,
    tag,
    title,
    content,
    writer,
    writeDate,
  } = req.body;

  const counter = await Counter.findOneAndUpdate(
    { name: "학생 모집 게시물 수" },
    { $inc: { totalWrite: 1 } },
    { new: true, upsert: true }
  );
  const totalWrite = counter.totalWrite + 1;

  if (!counter) {
    return res.status(500).json({ message: "Counter not found" });
  }
  try {
    const newWrite = new TWrite({
      _id: totalWrite + 1,
      _user: userId,
      number: number,
      /* period: period, */
      date: date,
      startTime: startTime,
      runningTime: runningTime,
      estimateAmount: estimateAmount,
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

app.post("/postWrite", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  const {
    number,
    period,
    date,
    startTime,
    runningTime,
    estimateAmount,
    tag,
    title,
    content,
    writer,
    writeDate,
  } = req.body;

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
      /* period: period, */
      date: date,
      startTime: startTime,
      runningTime: runningTime,
      estimateAmount: estimateAmount,
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

/* app.post("/postModify", async (req, res) => {
  const { _id, number, period, date, tag, title, content, recruit } = req.body; */

app.post("/postTModify", async (req, res) => {
  const {
    _id,
    number,
    date,
    startTime,
    runningTime,
    estimateAmount,
    tag,
    title,
    content,
    recruit,
  } = req.body;

  try {
    const updatedWrite = await TWrite.findOneAndUpdate(
      { _id },
      {
        $set: {
          number,
          date,
          startTime,
          runningTime,
          estimateAmount,
          tag,
          title,
          content,
          recruit,
        },
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

app.post("/postModify", async (req, res) => {
  const {
    _id,
    number,
    date,
    startTime,
    runningTime,
    estimateAmount,
    tag,
    title,
    content,
    recruit,
  } = req.body;

  try {
    const updatedWrite = await Write.findOneAndUpdate(
      { _id },
      {
        $set: {
          number,
          date,
          startTime,
          runningTime,
          estimateAmount,
          tag,
          title,
          content,
          recruit,
        },
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

app.get("/getTWrite/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const result = await TWrite.find({ _id: Number(req.params.id) });
    if (result) {
      let sameUser = false;
      if (userId === result[0]._user) sameUser = true;

      let profileImg = null;
      const user = await User.findOne({ _id: result[0]._user });
      if (user.image) {
        profileImg = user.image;
      }
      //console.log(user);
      console.log("작성자는 ", result[0].writer);

      return res.status(200).json({
        result: result,
        sameUser: sameUser,
        profileImg: profileImg,
        message: `id 가져오기 성공`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getTWrite2/:id", async (req, res) => {
  try {
    const result = await TWrite.find({ _id: Number(req.params.id) });

    if (result) {
      let profileImg = null;
      const user = await User.findOne({ _id: result[0]._user });
      if (user.image) {
        profileImg = user.image;
      }

      return res.status(200).json({
        result: result,
        sameUser: false,
        profileImg: profileImg,
        message: `id 가져오기 성공`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
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

      let profileImg = null;
      const user = await User.findOne({ _id: result[0]._user });
      if (user.image) {
        profileImg = user.image;
      }
      //console.log(user);
      console.log("작성자는 ", result[0].writer);

      return res.status(200).json({
        result: result,
        sameUser: sameUser,
        profileImg: profileImg,
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
      let profileImg = null;
      const user = await User.findOne({ _id: result[0]._user });
      if (user.image) {
        profileImg = user.image;
      }

      return res.status(200).json({
        result: result,
        sameUser: false,
        profileImg: profileImg,
        message: `id 가져오기 성공`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.delete("/writeTDelete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Write collection에서 해당 id 값의 document를 삭제
    const result = await TWrite.deleteOne({ _id: id });

    // Counter collection에서 "게시물 수" name 값을 가진 document의 totalWrite 필드값을 -1 해줌
    const counter = await Counter.findOneAndUpdate(
      { name: "학생 모집 게시물 수" },
      { $inc: { totalWrite: -1 } }
    );
    res.status(200).json({ message: "글이 삭제되었습니다.", counter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "글 삭제에 실패하였습니다." });
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

      let profileImg = null;
      const user = await User.findOne({ _id: result[0]._user });

      if (user && user.image) {
        profileImg = user.image;
      }

      return res.status(200).json({
        result: result,
        sameUser: sameUser,
        profileImg: profileImg,
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
      let profileImg = null;
      const user = await User.findOne({ _id: result[0]._user });
      if (user.image) {
        profileImg = user.image;
      }

      return res.status(200).json({
        result: result,
        sameUser: false,
        profileImg: profileImg,
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

app.post("/openStudy", async (req, res) => {
  try {
    const { img, title, pw, hashtag, personNum } = req.body;

    const newOpenStudy = new OpenStudy({
      img: img,
      title: title,
      pw: pw,
      tags: hashtag,
      personNum: personNum,
    });

    console.log("img.size : ", img.size);

    await newOpenStudy.save();
    res.status(200).json({ message: `OpenStudy created successfully` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `err.message` });
  }
});

app.get("/openStudies", async (req, res) => {
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
    if (openStudies.length > 0) {
      return res.status(200).json({
        openStudies: openStudies,
        //totalOpenStudies,
        message: "오픈스터디 목록 가져오기 성공",
        success: true,
        openStudies,
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
});

app.get("/srecruitments", async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;

  try {
    const studies = await TWrite.find()
      .sort({ writeDate: -1 })
      .skip(offset)
      .limit(limit);
    const counter = await TWrite.count();
    const hasMore = counter > page * limit;

    if (studies.length > 0) {
      return res.status(200).json({
        studies: studies,
        message: "학생 모집글 목록 가져오기",
        success: true,
        hasMore: hasMore,
        studies,
      });
    } else {
      return res.status(404).json({
        message: "데이터가 존재하지 않습니다.",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.get("/studies", async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;

  try {
    const studies = await Write.find()
      .sort({ writeDate: -1 })
      .skip(offset)
      .limit(limit);
    const counter = await Write.count();
    const hasMore = counter > page * limit;

    if (studies.length > 0) {
      return res.status(200).json({
        studies: studies,
        message: "스터디 모집글 목록 가져오기",
        success: true,
        hasMore: hasMore,
        studies,
      });
    } else {
      return res.status(404).json({
        message: "데이터가 존재하지 않습니다.",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.get("/myStudies", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;

  try {
    const studies = await Write.find({ _user: userId })
      .sort({ writeDate: -1 })
      .skip(offset)
      .limit(limit);
    const counter = await Write.count();
    const hasMore = counter > page * limit;

    if (studies.length > 0) {
      return res.status(200).json({
        studies: studies,
        message: "스터디 모집글 목록 가져오기",
        success: true,
        hasMore: hasMore,
        studies,
      });
    } else {
      return res.status(204).json({
        message: "데이터가 존재하지 않습니다.",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.get("/myAsks", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;

  try {
    const studies = await Ask.find({ _user: userId })
      .sort({ writeDate: -1 })
      .skip(offset)
      .limit(limit);
    const counter = await Ask.count();
    const hasMore = counter > page * limit;

    if (studies.length > 0) {
      return res.status(200).json({
        studies: studies,
        message: "스터디 모집글 목록 가져오기",
        success: true,
        hasMore: hasMore,
        studies,
      });
    } else {
      return res.status(204).json({
        message: "데이터가 존재하지 않습니다.",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.get("/questions", async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;

  try {
    const questions = await Ask.find()
      .sort({ writeDate: -1 })
      .skip(offset)
      .limit(limit);
    const counter = await Ask.count();
    const hasMore = counter > page * limit;

    if (questions.length > 0) {
      return res.status(200).json({
        questions: questions,
        message: "스터디 모집글 목록 가져오기",
        success: true,
        hasMore: hasMore,
      });
    } else {
      return res.status(404).json({
        message: "데이터가 존재하지 않습니다.",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// openStudy 검색
app.get("/searchOpenStudy", async (req, res) => {
  const option = req.query.selected;
  const value = decodeURIComponent(req.query.value);

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;
  var openStudiesSearch = [];

  try {
    if (option === "title") {
      openStudiesSearch = await OpenStudy.find(
        { title: { $regex: value, $options: "i" } },
        null,
        { skip: offset, limit: limit }
      );
    } else if (option === "tags") {
      openStudiesSearch = await OpenStudy.find(
        { tags: { $regex: value, $options: "i" } },
        null,
        { skip: offset, limit: limit }
      );
    }

    if (openStudiesSearch.length > 0) {
      return res.status(200).json({
        openStudies: openStudiesSearch,
        //totalOpenStudies,
        message: "검색목록 가져오기 성공",
        success: true,
      });
    } else {
      return res.status(200).json({
        openStudies: [],
        message: "검색결과가 없습니다",
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Study게시판 검색
app.get("/searchSRecruitment", async (req, res) => {
  const option = req.query.selected;
  const value = decodeURIComponent(req.query.value);

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;
  var studiesSearch = [];

  try {
    if (option === "title") {
      studiesSearch = await TWrite.find(
        { title: { $regex: value, $options: "i" } },
        null,
        { skip: offset, limit: limit }
      );
    } else if (option === "tags") {
      studiesSearch = await TWrite.find(
        { tag: { $regex: value, $options: "i" } },
        null,
        { skip: offset, limit: limit }
      );
    }

    if (studiesSearch.length > 0) {
      return res.status(200).json({
        studies: studiesSearch,
        message: "검색목록 가져오기 성공",
        success: true,
      });
    } else {
      return res.status(200).json({
        studies: [],
        message: "검색결과가 없습니다",
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Study게시판 검색
app.get("/searchStudy", async (req, res) => {
  const option = req.query.selected;
  const value = decodeURIComponent(req.query.value);

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;
  var studiesSearch = [];

  try {
    if (option === "title") {
      studiesSearch = await Write.find(
        { title: { $regex: value, $options: "i" } },
        null,
        { skip: offset, limit: limit }
      );
    } else if (option === "tags") {
      studiesSearch = await Write.find(
        { tag: { $regex: value, $options: "i" } },
        null,
        { skip: offset, limit: limit }
      );
    }

    if (studiesSearch.length > 0) {
      return res.status(200).json({
        studies: studiesSearch,
        message: "검색목록 가져오기 성공",
        success: true,
      });
    } else {
      return res.status(200).json({
        studies: [],
        message: "검색결과가 없습니다",
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 질문게시판 검색
app.get("/searchQuestion", async (req, res) => {
  const option = req.query.selected;
  const value = decodeURIComponent(req.query.value);

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;
  var questionsSearch = [];

  try {
    if (option === "title") {
      questionsSearch = await Ask.find(
        { title: { $regex: value, $options: "i" } },
        null,
        { skip: offset, limit: limit }
      );
    } else if (option === "tags") {
      questionsSearch = await Ask.find(
        { tag: { $regex: value, $options: "i" } },
        null,
        { skip: offset, limit: limit }
      );
    }

    if (questionsSearch.length > 0) {
      return res.status(200).json({
        questions: questionsSearch,
        message: "검색목록 가져오기 성공",
        success: true,
      });
    } else {
      return res.status(200).json({
        questions: [],
        message: "검색결과가 없습니다",
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.get("/getGood/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const result = await AskGood.findOne({ _id: Number(req.params.id) });
    if (result) {
      let isUser = false;
      for (let i = 0; i < result._users.length; i++) {
        if (userId === result._users[i].user) isUser = true;
      }
      return res.status(200).json({
        good: isUser,
        count: result.goodCount,
        message: `좋아요 리스트 가져오기 성공`,
      });
    } else {
      return res.status(204).json({
        message: `좋아요가 없습니다`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getGood2/:id", async (req, res) => {
  try {
    const result = await AskGood.findOne({ _id: Number(req.params.id) });
    if (result) {
      return res.status(200).json({
        count: result.goodCount,
        message: `좋아요 리스트 가져오기 성공`,
      });
    } else {
      return res.status(204).json({
        message: `좋아요가 없습니다`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/setGood/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const result = await AskGood.findOne({ _id: Number(req.params.id) });

    if (!result) {
      const newDoc = new AskGood({
        _id: Number(req.params.id),
        _users: [{ user: userId, time: new Date() }],
        goodCount: 1,
      });
      await newDoc.save();
      return res.status(201).json({
        goodCount: 1,
        message: `좋아요가 추가되었습니다`,
      });
    } else {
      const index = result._users.findIndex((obj) => obj.user === userId);
      if (index > -1) {
        result._users.splice(index, 1);
        result.goodCount--;
        await result.save();
        return res.status(200).json({
          goodCount: result.goodCount,
          message: `좋아요가 취소되었습니다`,
        });
      } else {
        result._users.push({ user: userId, time: new Date() });
        result.goodCount++;
        await result.save();
        return res.status(200).json({
          goodCount: result.goodCount,
          message: `좋아요가 추가되었습니다`,
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getTGoodPost/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const result = await TPostGood.findOne({ _id: Number(req.params.id) });
    if (result) {
      let isUser = false;
      for (let i = 0; i < result._users.length; i++) {
        if (userId === result._users[i].user) {
          isUser = true;
        }
      }
      return res.status(200).json({
        good: isUser,
        count: result.goodCount,
        message: `좋아요 리스트 가져오기 성공`,
      });
    } else {
      return res.status(204).json({
        message: `좋아요가 없습니다`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getGoodPost/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const result = await PostGood.findOne({ _id: Number(req.params.id) });
    if (result) {
      let isUser = false;
      for (let i = 0; i < result._users.length; i++) {
        if (userId === result._users[i].user) {
          isUser = true;
        }
      }
      return res.status(200).json({
        good: isUser,
        count: result.goodCount,
        message: `좋아요 리스트 가져오기 성공`,
      });
    } else {
      return res.status(204).json({
        message: `좋아요가 없습니다`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getGoodPost2/:id", async (req, res) => {
  try {
    const result = await PostGood.findOne({ _id: Number(req.params.id) });
    if (result) {
      return res.status(200).json({
        count: result.goodCount,
        message: `좋아요 리스트 가져오기 성공`,
      });
    } else {
      return res.status(204).json({
        message: `좋아요가 없습니다`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/setTGoodPost/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const result = await TPostGood.findOne({ _id: Number(req.params.id) });

    if (!result) {
      const newDoc = new TPostGood({
        _id: Number(req.params.id),
        _users: [{ user: userId, time: new Date() }],
        goodCount: 1,
      });
      await newDoc.save();
      return res.status(201).json({
        goodCount: 1,
        message: `좋아요가 추가되었습니다`,
      });
    } else {
      const index = result._users.findIndex((obj) => obj.user === userId);
      if (index > -1) {
        result._users.splice(index, 1);
        result.goodCount--;
        await result.save();
        return res.status(200).json({
          goodCount: result.goodCount,
          message: `좋아요가 취소되었습니다`,
        });
      } else {
        result._users.push({ user: userId, time: new Date() });
        result.goodCount++;
        await result.save();
        return res.status(200).json({
          goodCount: result.goodCount,
          message: `좋아요가 추가되었습니다`,
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/setGoodPost/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const result = await PostGood.findOne({ _id: Number(req.params.id) });

    if (!result) {
      const newDoc = new PostGood({
        _id: Number(req.params.id),
        _users: [{ user: userId, time: new Date() }],
        goodCount: 1,
      });
      await newDoc.save();
      return res.status(201).json({
        goodCount: 1,
        message: `좋아요가 추가되었습니다`,
      });
    } else {
      const index = result._users.findIndex((obj) => obj.user === userId);
      if (index > -1) {
        result._users.splice(index, 1);
        result.goodCount--;
        await result.save();
        return res.status(200).json({
          goodCount: result.goodCount,
          message: `좋아요가 취소되었습니다`,
        });
      } else {
        result._users.push({ user: userId, time: new Date() });
        result.goodCount++;
        await result.save();
        return res.status(200).json({
          goodCount: result.goodCount,
          message: `좋아요가 추가되었습니다`,
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/view", async (req, res) => {
  const { id, postName } = req.body;

  if (postName === "question") {
    try {
      const ask = await Ask.findOneAndUpdate(
        { _id: id },
        { $inc: { views: 1 } }, // views 필드를 1 증가시킴
        { new: true }
      );
      res.json({ message: "조회수 +1 성공" });
    } catch (err) {
      console.log(err);
      res.json({ error: err.message });
    }
  } else if (postName === "study") {
    try {
      const write = await Write.findOneAndUpdate(
        { _id: id },
        { $inc: { views: 1 } }, // views 필드를 1 증가시킴
        { new: true }
      );
      res.json({ message: "조회수 +1 성공" });
    } catch (err) {
      console.log(err);
      res.json({ error: err.message });
    }
  } else if (postName === "srecruitment") {
    try {
      const write = await TWrite.findOneAndUpdate(
        { _id: id },
        { $inc: { views: 1 } }, // views 필드를 1 증가시킴
        { new: true }
      );
      res.json({ message: "조회수 +1 성공" });
    } catch (err) {
      console.log(err);
      res.json({ error: err.message });
    }
  }
});

app.post("/getCommentCount", async (req, res) => {
  const { id, postName } = req.body;

  if (postName === "question") {
    try {
      const write = await Ask.findOne({ _id: id });
      if (write) {
        const writeR = await AReply.find({ postId: id });
        const writeRr = await AR_Reply.find({ postRId: id });

        const rCount = writeR ? writeR.length : 0;
        const rrCount = writeRr ? writeRr.length : 0;
        const wCount = rCount + rrCount;

        return res.status(200).json({
          result: wCount,
          message: `댓글수 가져오기 성공`,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  } else if (postName === "srecruitment") {
    try {
      const write = await TWrite.findOne({ _id: id });
      if (write) {
        const writeR = await TReply.find({ postId: id });
        const writeRr = await TR_Reply.find({ postRId: id });

        const rCount = writeR ? writeR.length : 0;
        const rrCount = writeRr ? writeRr.length : 0;
        const wCount = rCount + rrCount;

        return res.status(200).json({
          result: wCount,
          message: `댓글수 가져오기 성공`,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  } else if (postName === "study") {
    try {
      const write = await Write.findOne({ _id: id });
      if (write) {
        const writeR = await Reply.find({ postId: id });
        const writeRr = await R_Reply.find({ postRId: id });

        const rCount = writeR ? writeR.length : 0;
        const rrCount = writeRr ? writeRr.length : 0;
        const wCount = rCount + rrCount;

        return res.status(200).json({
          result: wCount,
          message: `댓글수 가져오기 성공`,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
});

// 댓글 내용 가져오기
app.get("/tView/:id/modify/:replyId", async (req, res) => {
  const postId = req.params.id;
  const replyId = req.params.replyId;

  try {
    const result = await TReply.find({
      postId: Number(postId),
      _id: Number(replyId),
    });
    console.log(result);
    if (result) {
      return res.status(200).json({
        result: result,
        message: `댓글 id 가져오기 성공`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// 대댓글 내용 가져오기 Ask
app.get("/tView/:id/modify/:selectedARId/:rrid", async (req, res) => {
  const postId = req.params.id;
  const selectedARId = req.params.selectedARId;
  const rrid = req.params.rrid;

  try {
    const result = await TR_Reply.find({
      postRId: Number(postId),
      selectedARId: Number(selectedARId),
      _id: Number(rrid),
    });
    console.log(result);

    if (result) {
      return res.status(200).json({
        result: result,
        message: `댓글 id 가져오기 성공`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/getViewCount", async (req, res) => {
  const { id, postName } = req.body;

  if (postName === "question") {
    try {
      const ask = await Ask.findOne({ _id: id });
      if (ask) {
        return res.status(200).json({
          count: ask.views,
          message: `조회수 가져오기 성공`,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  } else if (postName === "srecruitment") {
    try {
      const write = await TWrite.findOne({ _id: id });
      if (write) {
        return res.status(200).json({
          count: write.views,
          message: `조회수 가져오기 성공`,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  } else if (postName === "study") {
    try {
      const write = await Write.findOne({ _id: id });
      if (write) {
        return res.status(200).json({
          count: write.views,
          message: `조회수 가져오기 성공`,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
});

app.patch("/updateAlarm/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { read } = req.body;

  try {
    // id로 알림을 찾아서 업데이트
    const alarm = await Alarm.findOneAndUpdate(
      { "content._id": id },
      { $set: { "content.$.read": read } },
      { new: true }
    );
    //console.log("here");

    //console.log("읽음표시: ", alarm);

    if (!alarm) {
      return res.status(404).json({ msg: "알림을 찾을 수 없습니다" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("서버 오류");
  }
});

// host와 채택된 사람들에게 방 생성되었다는 알림 //수강생 모집 글
app.post("/selectedTAlarm", async (req, res) => {
  try {
    const { host, selectedStudent, roomTitle } = req.body;

    //const alarms = await Alarm.find({ userName: { $in: selectedStudent } });

    for (const student of selectedStudent) {
      const user = await User.findOne({ name: student });
      const userId = user._id;

      const alarm = await Alarm.findOneAndUpdate(
        { userName: student },
        {
          $push: {
            //userName: student,
            content: {
              $each: [
                {
                  title: "새로운 방이 생성되었습니다.",
                  message: `${roomTitle} 방이 생성되었습니다.`,
                  createdAt: new Date(),
                  _id: new mongoose.mongo.ObjectId(),
                  postCategory: "MyCalendar",
                  role: "student",
                },
              ],
            },
          },
          $setOnInsert: {
            userName: student,
            _user: String(userId),
          },
        },
        { upsert: true, new: true }
      );
      console.log(alarm);
    }

    const hostUser = await User.findOne({ name: host });
    const hostUserId = hostUser._id;

    const hostAlarm = await Alarm.findOneAndUpdate(
      { userName: host },
      {
        $push: {
          //userName: student,
          content: {
            $each: [
              {
                title: "새로운 방이 생성되었습니다.",
                message: `${roomTitle} 방이 생성되었습니다.`,
                createdAt: new Date(),
                _id: new mongoose.mongo.ObjectId(),
                postCategory: "MyCalendar",
              },
            ],
          },
        },
        $setOnInsert: {
          userName: host,
          _user: String(hostUserId),
        },
      },
      { upsert: true, new: true }
    );
    console.log(hostAlarm);

    res.status(200).send("Alarm created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

// host와 채택된 사람들에게 방 생성되었다는 알림 // 강사 모집 글
app.post("/selectedAlarm", async (req, res) => {
  try {
    const { host, selectedStudent, roomTitle } = req.body;

    //const alarms = await Alarm.find({ userName: { $in: selectedStudent } });

    for (const student of selectedStudent) {
      const user = await User.findOne({ name: student });
      const userId = user._id;
      console.log("@@@@: ", userId);
      const alarm = await Alarm.findOneAndUpdate(
        { userName: student },
        {
          $push: {
            //userName: student,
            content: {
              $each: [
                {
                  title: "새로운 방이 생성되었습니다.",
                  message: `${roomTitle} 방이 생성되었습니다.`,
                  createdAt: new Date(),
                  _id: new mongoose.mongo.ObjectId(),
                  postCategory: "MyCalendar",
                },
              ],
            },
          },
          $setOnInsert: {
            userName: student,
            _user: String(userId),
          },
        },
        { upsert: true, new: true }
      );
      console.log(alarm);
    }

    const hostUser = await User.findOne({ name: host });
    const hostUserId = hostUser._id;

    const hostAlarm = await Alarm.findOneAndUpdate(
      { userName: host },
      {
        $push: {
          //userName: student,
          content: {
            $each: [
              {
                title: "새로운 방이 생성되었습니다.",
                message: `${roomTitle} 방이 생성되었습니다.`,
                createdAt: new Date(),
                _id: new mongoose.mongo.ObjectId(),
                role: "student",
                postCategory: "MyCalendar",
              },
            ],
          },
        },
        $setOnInsert: {
          userName: host,
          _user: String(hostUserId),
        },
      },
      { upsert: true, new: true }
    );
    console.log(hostAlarm);

    res.status(200).send("Alarm created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.get("/getAlarm", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const result = await Alarm.find({ _user: String(userId) });

    const notRead = result[0].content.read;
    var notiCount = 0;
    if (notRead === false) {
      notiCount += 1;
    }

    //console.log("userId : ", userId);

    if (result) {
      //console.log("get -", result[0].content);
      const contentArray = result[0].content;
      const reversedArray = contentArray.reverse();

      return res.status(200).json({
        //data: result2,
        data: result,
        notiCount: notiCount,
        message: `알림 가져오기 성공`,
      });
    } else {
      return res.status(404).json({ message: "알림이 존재하지 않습니다." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/users/:id/profileImage", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    const profileImage = user.image;
    res.status(200).json({ profileImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

// 댓글
/* app.get("/getReply/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const result = await Reply.find({ postId: req.params.id})
    const uniqueWriters = [...new Set(result.map(reply => reply.rwriter))];
    
    console.log("uni: ", uniqueWriters);

    const usersId = [];
    for(const writer of uniqueWriters) {
      //console.log("writer: ", writer);
      const user = await User.findOne({ name: writer });
      //console.log("user: ", user);
      if(user) {
        usersId.push(user);
      }
    }

    console.log("usersId: ", usersId);

    if (result) {
      let sameUsers = false;
      //console.log(req.params.postId);
      return res.status(200).json({
        data: result,
        sameUsers: sameUsers,
        user: usersId,
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
}); */

// 대댓글 T
app.get("/getTR_Reply/:id/:rid", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  const postRId = req.params.id;
  const selectedRId = req.params.rid;

  try {
    const result = await TR_Reply.find({
      postRId: Number(postRId),
      selectedRId: Number(selectedRId),
    });
    if (result) {
      const RsameUsers = result.map((reply) => reply._user === userId);
      console.log(RsameUsers);

      //let RsameUsers = false;
      //console.log('result[0]: ', result[0].r_rwriter);
      //if (userId === result[0].r_rwriter) RsameUsers = true;
      //console.log(postRId);
      //console.log(selectedRId);

      // 사용자 프로필 이미지 반환
      const profileImgs = await Promise.all(
        result.map(async (r_reply) => {
          const user = await User.findOne({ name: r_reply.r_rwriter });

          if (!user) {
            throw new Error(`User with name "${r_reply.r_rwriter}" not found`);
          }

          return user.image;
        })
      );

      return res.status(200).json({
        data: result,
        RsameUsers: RsameUsers,
        profileImgs: profileImgs,
        message: ` ${typeof selectedRId}대댓글 가져오기 성공`,
      });
    }
    /* else {
      return res.status(404).json({ message: "대댓글이 존재하지 않습니다." });
    } */
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/// 대댓글 작성 T
app.post("/postTr_reply/:id/:rid", async (req, res) => {
  const { r_reply, /* isRSecret, */ r_rwriteDate, r_rwriter } = req.body;
  const { id, rid } = req.params;

  const post = await TWrite.findOne({ _id: id });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const reply = await TReply.findOne({ _id: rid });
  if (!reply) {
    return res.status(404).json({ message: "Reply not found" });
  }

  const r_replycounter = await TR_ReplyCounter.findOneAndUpdate(
    { name: "대댓글 수" },
    { $inc: { totalR_Reply: 1 } },
    { new: true, upsert: true }
  );
  const 총대댓글수 = r_replycounter.totalR_Reply + 1;

  const r_rwriterId = await User.findOne({ name: r_rwriter });

  if (!r_replycounter) {
    return res.status(500).json({ message: "Counter not found" });
  }
  try {
    const newR_Reply = new TR_Reply({
      postRId: id,
      selectedRId: rid,
      _id: 총대댓글수 + 1, //댓글번호
      r_rwriter: r_rwriter,
      _user: r_rwriterId._id,
      r_rwriteDate: r_rwriteDate,
      r_reply: r_reply,
      //isRSecret : isRSecret
    });
    await newR_Reply.save();

    return res.status(200).json({ message: `Reply created successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

/// 대댓글 작성 T
app.post("/postTr_reply/:id/:rid", async (req, res) => {
  const { r_reply, /* isRSecret, */ r_rwriteDate, r_rwriter } = req.body;
  const { id, rid } = req.params;

  const post = await TWrite.findOne({ _id: id });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const reply = await TReply.findOne({ _id: rid });
  if (!reply) {
    return res.status(404).json({ message: "Reply not found" });
  }

  const r_replycounter = await TR_ReplyCounter.findOneAndUpdate(
    { name: "대댓글 수" },
    { $inc: { totalR_Reply: 1 } },
    { new: true, upsert: true }
  );
  const 총대댓글수 = r_replycounter.totalR_Reply + 1;

  const r_rwriterId = await User.findOne({ name: r_rwriter });

  if (!r_replycounter) {
    return res.status(500).json({ message: "Counter not found" });
  }
  try {
    const newR_Reply = new TR_Reply({
      postRId: id,
      selectedRId: rid,
      _id: 총대댓글수 + 1, //댓글번호
      r_rwriter: r_rwriter,
      _user: r_rwriterId._id,
      r_rwriteDate: r_rwriteDate,
      r_reply: r_reply,
      //isRSecret : isRSecret
    });
    await newR_Reply.save();

    return res.status(200).json({ message: `Reply created successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

app.get("/getTReply/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const result = await TReply.find({ postId: req.params.id });

    if (result) {
      const sameUsers = result.map((reply) => reply._user === userId);

      console.log(sameUsers);

      // 사용자 프로필 이미지 반환
      const profileImgs = await Promise.all(
        result.map(async (reply) => {
          const user = await User.findOne({ name: reply.rwriter });

          if (!user) {
            throw new Error(`User with name "${reply.rwriter}" not found`);
          }

          return user.image;
        })
      );

      return res.status(200).json({
        data: result,
        sameUsers: sameUsers,
        profileImgs: profileImgs,
        message: ` ${typeof req.params.postId}댓글 가져오기 성공`,
      });
    } else {
      return res.status(404).json({ message: "댓글이 존재하지 않습니다." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getReply/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const result = await Reply.find({ postId: req.params.id });

    if (result) {
      const sameUsers = result.map((reply) => reply._user === userId);

      console.log(sameUsers);

      // 사용자 프로필 이미지 반환
      const profileImgs = await Promise.all(
        result.map(async (reply) => {
          const user = await User.findOne({ name: reply.rwriter });

          if (!user) {
            throw new Error(`User with name "${reply.rwriter}" not found`);
          }

          return user.image;
        })
      );

      return res.status(200).json({
        data: result,
        sameUsers: sameUsers,
        profileImgs: profileImgs,
        message: ` ${typeof req.params.postId}댓글 가져오기 성공`,
      });
    } else {
      return res.status(404).json({ message: "댓글이 존재하지 않습니다." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// 댓글 달리면 알림 (글 쓴 사람에게)
app.post("/rAlarm", async (req, res) => {
  try {
    const { rwriter, message, to, postId, postCategory } = req.body;

    const user = await User.findOne({ name: to });
    const userId = user._id;

    const existingAlarm = await Alarm.findOne({
      userName: to,
      "content.title": `${rwriter}님께서 댓글을 작성하였습니다.`,
      "content.message": message,
      "content.postCategory": postCategory,
      "content.location": postId,
    });

    if (existingAlarm) {
      console.log("중복된 알림이 이미 저장되어 있습니다.");
      return;
    }

    const alarm = await Alarm.findOneAndUpdate(
      { userName: to },
      {
        $push: {
          content: {
            $each: [
              {
                title: `${rwriter}님께서 댓글을 작성하였습니다.`,
                message: message,
                createdAt: new Date(),
                postCategory: postCategory,
                location: postId,
                _id: new mongoose.mongo.ObjectId(),
              },
            ],
          },
        },
        $setOnInsert: {
          userName: to,
          _user: String(userId),
        },
      },
      { upsert: true, new: true }
    );
    //console.log(alarm);
  } catch (error) {
    console.error(error);
  }
});

// 대댓글 달리면 알림 (글 쓴 사람, 댓글 작성자에게)
app.post("/rrAlarm", async (req, res) => {
  try {
    const { rrwriter, message, to, postId, postCategory } = req.body;

    const filteredTo = to.filter((person) => person !== "");

    for (const person of filteredTo) {
      const user = await User.findOne({ name: person });
      const userId = user._id;

      const alarm = await Alarm.findOneAndUpdate(
        { userName: person },
        {
          $push: {
            content: {
              $each: [
                {
                  title: `${rrwriter}님께서 대댓글을 작성하였습니다.`,
                  message: message,
                  createdAt: new Date(),
                  postCategory: postCategory,
                  location: postId,
                  _id: new mongoose.mongo.ObjectId(),
                },
              ],
            },
          },
          $setOnInsert: {
            userName: person,
            _user: String(userId),
          },
        },
        { upsert: true, new: true }
      );
    }
  } catch (error) {
    console.error(error);
  }
});

// 대댓글
app.get("/getR_Reply/:id/:rid", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  const postRId = req.params.id;
  const selectedRId = req.params.rid;

  try {
    const result = await R_Reply.find({
      postRId: Number(postRId),
      selectedRId: Number(selectedRId),
    });
    if (result) {
      const RsameUsers = result.map((reply) => reply._user === userId);
      console.log(RsameUsers);

      //let RsameUsers = false;
      //console.log('result[0]: ', result[0].r_rwriter);
      //if (userId === result[0].r_rwriter) RsameUsers = true;
      //console.log(postRId);
      //console.log(selectedRId);

      // 사용자 프로필 이미지 반환
      const profileImgs = await Promise.all(
        result.map(async (r_reply) => {
          const user = await User.findOne({ name: r_reply.r_rwriter });

          if (!user) {
            throw new Error(`User with name "${r_reply.r_rwriter}" not found`);
          }

          return user.image;
        })
      );

      return res.status(200).json({
        data: result,
        RsameUsers: RsameUsers,
        profileImgs: profileImgs,
        message: ` ${typeof selectedRId}대댓글 가져오기 성공`,
      });
    } else {
      return res.status(404).json({ message: "대댓글이 존재하지 않습니다." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// 학생모집글 댓글 작성자
app.get("/getTRWriter/:id/:nickname", async (req, res) => {
  try {
    const treply = await TReply.find({ postId: req.params.id });
    const tr_reply = await TR_Reply.find({ postId: req.params.id });

    const user = await User.findOne({ name: req.params.nickname });

    const writer = await TWrite.findOne({ _id: req.params.id });
    console.log(writer);
    const hostId = await User.findOne({ _id: writer._user });

    const myName = req.params.nickname;
    var result = [];

    console.log("내 이름은 ", myName);

    // 해당 글의 댓글작성자 list
    /* const replyWriterList = reply.map(r => r.writer);
    const rReplyWriterList = r_reply.map(r => r.r_rwriter);
    const rWriters = [...new Set([...replyWriterList, ...rReplyWriterList])]; */

    const rWriters = [
      ...new Set([
        ...treply.map((r) => r.rwriter),
        ...tr_reply.map((r) => r.r_rwriter),
      ]),
    ];

    console.log("나 포함 ", rWriters);

    result = rWriters.filter(
      (rWriter) => rWriter !== myName && !result.includes(rWriter)
    );

    console.log("나 제외 ", result);

    return res.status(200).json({
      hostId: hostId,
      postId: req.params.id,
      data: result,
      message: `댓글 작성자 가져오기 성공`,
    });
  } catch (error) {
    console.log(error);
  }
});

// tView 스크랩 수 가져오기(모집글)
app.get("/getTBookmarkCount/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    const result = await TPostGood.findOne({ _id: Number(postId) });

    if (result) {
      //console.log('result: ', result);
      return res.status(200).json({
        result: result,
        message: `스크랩 수 가져오기 성공`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getSApplicant/:id", async (req, res) => {
  try {
    const applicants = await SApplicant.find({ postId: req.params.id });

    const result = [...applicants.map((r) => r.userName)];

    return res.status(200).json({
      postId: req.params.id,
      data: result,
      message: `학생모집 신청자 가져오기 성공`,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/getTApplicant/:id", async (req, res) => {
  try {
    const applicants = await TApplicant.find({ postId: req.params.id });

    const result = [...applicants.map((r) => r.userName)];

    return res.status(200).json({
      postId: req.params.id,
      data: result,
      message: `강사모집 신청자 가져오기 성공`,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/tApplicantSave", async (req, res) => {
  const { userName, postId } = req.body;

  const userId = await User.findOne({ name: userName });

  try {
    console.log("신청전");

    const newApplicant = new TApplicant({
      userId: userId._id,
      userName: userName,
      postId: postId,
    });
    await newApplicant.save();

    console.log("신청되었습니다.");

    return res.status(200).json({ message: `applicant save successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

app.post("/sApplicantSave", async (req, res) => {
  const { userName, postId } = req.body;

  const userId = await User.findOne({ name: userName });

  try {
    console.log("신청전");

    const newApplicant = new SApplicant({
      userId: userId._id,
      userName: userName,
      postId: postId,
    });
    await newApplicant.save();

    console.log("신청되었습니다.");

    return res.status(200).json({ message: `applicant save successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

// 댓글 작성자
app.get("/getRWriter/:id/:nickname", async (req, res) => {
  try {
    const reply = await Reply.find({ postId: req.params.id });
    const r_reply = await R_Reply.find({ postId: req.params.id });

    const user = await User.findOne({ name: req.params.nickname });

    const myName = req.params.nickname;
    var result = [];

    console.log("내 이름은 ", myName);

    // 해당 글의 댓글작성자 list
    /* const replyWriterList = reply.map(r => r.writer);
    const rReplyWriterList = r_reply.map(r => r.r_rwriter);
    const rWriters = [...new Set([...replyWriterList, ...rReplyWriterList])]; */

    const rWriters = [
      ...new Set([
        ...reply.map((r) => r.rwriter),
        ...r_reply.map((r) => r.r_rwriter),
      ]),
    ];

    console.log("나 포함 ", rWriters);

    result = rWriters.filter(
      (rWriter) => rWriter !== myName && !result.includes(rWriter)
    );

    console.log("나 제외 ", result);

    return res.status(200).json({
      postId: req.params.id,
      data: result,
      message: `댓글 작성자 가져오기 성공`,
    });
  } catch (error) {
    console.log(error);
  }
});

app.put("/likeAreply/:id", auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const reply = await AReply.findById(id);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    const likedByUser = reply.likes.includes(userId);
    if (likedByUser) {
      0;
      // 이미 좋아요한 상태라면 좋아요 취소
      reply.likes.pull(userId);
      reply.likesCount -= 1;
    } else {
      // 좋아요 추가
      reply.likes.push(userId);
      reply.likesCount += 1;
    }

    await reply.save();

    return res.status(200).json({ message: "Like updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.patch("/updateRoomSchedule/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { prepaymentBtn } = req.body;
  console.log(id);

  try {
    //id로 알림을 찾아서 해당하는 roomSchedule 업데이트.
    const alarm = await Alarm.findOne({ "content._id": id });
    const UserName = alarm.userName;

    if (alarm) {
      const content = alarm.content;
      //console.log(content);
      const clickAlarm = content.find((item) => item._id.toString() === id);
      if (clickAlarm) {
        //console.log("@@", clickAlarm);
        //console.log("$$", clickAlarm.message);

        const message = clickAlarm.message;
        /* const roomTitle = message.match(/(\w+)\s+방이 생성되었습니다\./i)[1]; */
        const roomTitle = message.match(/([\p{L}\w]+)\s+방이 생성되었습니다\./iu)[1];

        console.log(roomTitle);

        const roomSchedule = await RoomSchedule.findOneAndUpdate(
          {
            roomTitle: roomTitle,
            userName: UserName,
          },
          { $set: { prepaymentBtn: prepaymentBtn } },
          { new: true }
        );

        //console.log("선금버튼 표시: ", roomSchedule);
        return res.status(200).json({ message: "Update successful" });
      } else {
        console.log("clickAlarm not found");
      }
    } else {
      return res.status(404).json({ message: "Alarm not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 오류");
  }
});

//저장된 roomSchedule에서 해당하는 유저에게 해당하는 정보가 보이도록
app.get("/roomSchedules", auth, async (req, res) => {
  try {
    const roomSchedule = await RoomSchedule.find({ userId: req.user.id });
    res.status(200).json(roomSchedule);
    //console.log(roomSchedule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

//강사모집에서 roomSchedule 추가
app.post("/roomSchedule", async (req, res) => {
  const { host, applicant, roomTitle, startTime, date, runningTime } = req.body;

  try {
    //강사모집에서 host = student
    const hostUser = await User.findOne({ name: host }).exec();
    const newHostSchedule = new RoomSchedule({
      userId: hostUser._id,
      userName: hostUser.name,
      userType: "Student",
      roomTitle: roomTitle,
      runningTime: runningTime,
      startTime: startTime,
      date: date,
      prepaymentBtn: false,
    });
    await newHostSchedule.validate();
    await newHostSchedule.save();

    //강사 모집에서 applicant = teacher
    const applicantUsers = await User.find({ name: { $in: applicant } }).exec();
    for (const applicantUser of applicantUsers) {
      const newApplicantSchedule = new RoomSchedule({
        userId: applicantUser._id,
        userName: applicantUser.name,
        userType: "Teacher",
        roomTitle: roomTitle,
        runningTime: runningTime,
        startTime: startTime,
        date: date,
      });
      await newApplicantSchedule.validate();
      await newApplicantSchedule.save();
    }
    return res
      .status(200)
      .json({ message: `roomSchedule created successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `서버오류` });
  }
});

//학생 모집에서 roomSchedule 추가
app.post("/TRoomSchedule", async (req, res) => {
  const { host, applicant, roomTitle, startTime, date, runningTime } = req.body;

  try {
    //학생모집에서 host = teacher
    const hostUser = await User.findOne({ name: host }).exec();
    const newHostSchedule = new RoomSchedule({
      userId: hostUser._id,
      userName: hostUser.name,
      userType: "Teacher",
      roomTitle: roomTitle,
      runningTime: runningTime,
      startTime: startTime,
      date: date,
    });
    await newHostSchedule.validate();
    await newHostSchedule.save();

    //학생모집에서 applicant = student
    const applicantUsers = await User.find({ name: { $in: applicant } }).exec();
    for (const applicantUser of applicantUsers) {
      const newApplicantSchedule = new RoomSchedule({
        userId: applicantUser._id,
        userName: applicantUser.name,
        userType: "Student",
        roomTitle: roomTitle,
        runningTime: runningTime,
        startTime: startTime,
        date: date,
        prepaymentBtn: false,
      });
      await newApplicantSchedule.validate();
      await newApplicantSchedule.save();
    }

    return res
      .status(200)
      .json({ message: `TRoomSchedule created successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `서버오류` });
  }
});

// 채택정보 (방장이름, 수강생, 방제목, 예상시작시간)
app.post("/selectionTInfo", async (req, res) => {
  const { host, applicant, roomTitle, runningTime, startTime, date } = req.body;

  try {
    const callHost = await User.findOne({ name: host });

    const newSelectionTInfo = new SelectionTInfo({
      hostId: callHost._id,
      host: host,
      applicant: applicant,
      roomTitle: roomTitle,
      runningTime: runningTime,
      startTime: startTime,
      date: date,
    });
    await newSelectionTInfo.save();

    return res.status(200).json({ message: `created successfully` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `서버오류` });
  }
});

// 채택정보 (방장이름, 수강생, 방제목, 예상시작시간)
app.post("/selectionInfo", async (req, res) => {
  const { host, applicant, roomTitle, startTime, date, runningTime } = req.body;

  try {
    const callApplicant = await User.find({ name: { $in: applicant } });
    const applicantId = callApplicant.map((applicant) => applicant._id);

    const newSelectionInfo = new SelectionInfo({
      applicantId: applicantId,
      host: host,
      applicant: applicant,
      roomTitle: roomTitle,
      runningTime: runningTime,
      startTime: startTime,
      date: date,
    });
    await newSelectionInfo.save();
    return res.status(200).json({ message: `created successfully` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `서버오류` });
  }
});

// 질문 댓글
app.get("/getAReply/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const result = await AReply.find({ postId: req.params.id });

    if (result) {
      const sameAUsers = result.map((reply) => reply._user === userId);

      //let sameAUsers = false;
      if (userId === result[0]._user) sameAUsers = true;
      console.log(req.params.postId);
      return res.status(200).json({
        data: result,
        sameAUsers: sameAUsers,
        profileImgs: null,
        message: ` ${typeof req.params.postId}댓글 가져오기 성공`,
      });
    } else {
      return res.status(404).json({ message: "댓글이 존재하지 않습니다." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/get-reviews", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const myRoomSchedules = await RoomSchedule.find({
      userId: userId,
      userType: "Student",
      prepaymentBtn: true,
    }).exec();

    const studentRoomTitles = myRoomSchedules.map(
      (schedule) => schedule.roomTitle
    );
    const currentDateTime = new Date();

    const teacherRoomSchedules = await RoomSchedule.find({
      roomTitle: { $in: studentRoomTitles },
      userType: "Teacher",
      reviewWritten: { $exists: false },
    }).exec();

    const result = []; // 결과를 저장할 배열

    teacherRoomSchedules.forEach((item) => {
      const startTime = item.startTime;
      const date = item.date;
      const runningTime = item.runningTime;

      const startTimeObj = new Date();
      const [hours, minutes] = startTime.split(":");
      startTimeObj.setHours(parseInt(hours));
      startTimeObj.setMinutes(parseInt(minutes));

      const dateObj = new Date(date);

      const combinedDateTime = new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        startTimeObj.getHours(),
        startTimeObj.getMinutes()
      );

      combinedDateTime.setMinutes(
        combinedDateTime.getMinutes() + parseInt(runningTime)
      );

      const targetDateTime = new Date(combinedDateTime);

      if (targetDateTime <= currentDateTime) {
        result.push(item);
      }
    });

    return res.status(200).json({ result: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

app.post("/send-review", async (req, res) => {
  const {
    teacherId,
    sendStar,
    reviewWrittenId,
    reviewContent,
    writerName,
    date,
  } = req.body;

  try {
    let happinessIndexIncrement;

    switch (sendStar) {
      case 5:
        happinessIndexIncrement = 1;
        break;
      case 4:
        happinessIndexIncrement = 0.8;
        break;
      case 3:
        happinessIndexIncrement = 0.6;
        break;
      case 2:
        happinessIndexIncrement = 0.4;
        break;
      case 1:
        happinessIndexIncrement = 0.2;
        break;
      case 0:
        happinessIndexIncrement = -1;
        break;
      default:
        happinessIndexIncrement = 0;
    }

    let updatedHappinessIndex = await HappinessIndex.findOne({
      _user: teacherId,
    });

    if (!updatedHappinessIndex) {
      updatedHappinessIndex = new HappinessIndex({
        _user: teacherId,
        happinessIndex: "50.0", // 초기값을 문자열로 설정
      });
    }

    const parsedHappinessIndex = parseFloat(
      updatedHappinessIndex.happinessIndex
    );
    updatedHappinessIndex.happinessIndex = (
      parsedHappinessIndex + happinessIndexIncrement
    )
      .toFixed(1)
      .toString(); // 계산 후 다시 문자열로 변환
    await updatedHappinessIndex.save();

    await RoomSchedule.findOneAndUpdate(
      { _id: reviewWrittenId },
      { reviewWritten: true }
    );

    const review = {
      star: sendStar,
      writerName: writerName,
      date: date,
      reviewContent: reviewContent,
    };

    const reviewUser = await ReviewContent.findOne({ _user: teacherId });
    if (reviewUser) {
      reviewUser.reviewContents.push(review);
      await reviewUser.save();
    } else {
      const newReviewUser = new ReviewContent({
        _user: teacherId,
        reviewContents: [review],
      });
      await newReviewUser.save();
    }

    return res.status(200).json({
      message: `Happiness Index for user ${teacherId} updated successfully`,
      updatedHappinessIndex,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getMyReview", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    let reviews = await ReviewContent.findOne({
      _user: userId,
    });
    if (reviews) {
      return res.status(200).json({
        reviews: reviews,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/getTargetReview", async (req, res) => {
  const { targetUser } = req.body;

  console.log(targetUser);
  try {
    let reviews = await ReviewContent.findOne({ _user: targetUser });

    // targetUser를 사용하여 happinessIndex에서 관련 정보를 찾음
    let happinessIndex = await HappinessIndex.findOne({ _user: targetUser });

    if (reviews) {
      console.log(happinessIndex);
      return res.status(200).json({
        reviews,
        happinessIndex,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
/* 
app.get("/getAlarm", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const result = await Alarm.find({ _user: String(userId) });

    console.log("userId : ", userId);

    if (result) {
      console.log(result);

      return res.status(200).json({
        data: result,
        message: `알림 가져오기 성공`,
      });
    }
    /* else {
      return res.status(404).json({ message: "대댓글이 존재하지 않습니다." });
    } */
/*   } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});  */

app.post("/postAreply/:id", async (req, res) => {
  const { Areply, likes,  Arwriter, ArwriteDate } = req.body;
  const { id } = req.params;

  const post = await Ask.findOne({ _id: id });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const Areplycounter = await AReplyCounter.findOneAndUpdate(
    { name: "댓글 수" },
    { $inc: { totalReply: 1 } },
    { new: true, upsert: true }
  );
  const 총댓글수 = Areplycounter.totalReply + 1;

  const ArwriterId = await User.findOne({ name: Arwriter });

  if (!Areplycounter) {
    return res.status(500).json({ message: "Counter not found" });
  }
  try {
    const newAReply = new AReply({
      postId: id,
      _id: 총댓글수 + 1,
      Arwriter: Arwriter,
      _user: ArwriterId._id,
      ArwriteDate: ArwriteDate,
      Areply: Areply,
      likes : likes,
    });
    await newAReply.save();

    return res.status(200).json({ message: `Reply created successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

// 대댓글 T
app.get("/getTR_Reply/:id/:rid", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  const postRId = req.params.id;
  const selectedRId = req.params.rid;

  try {
    const result = await TR_Reply.find({
      postRId: Number(postRId),
      selectedRId: Number(selectedRId),
    });
    if (result) {
      const RsameUsers = result.map((reply) => reply._user === userId);
      console.log(RsameUsers);

      //let RsameUsers = false;
      //console.log('result[0]: ', result[0].r_rwriter);
      //if (userId === result[0].r_rwriter) RsameUsers = true;
      //console.log(postRId);
      //console.log(selectedRId);

      // 사용자 프로필 이미지 반환
      const profileImgs = await Promise.all(
        result.map(async (r_reply) => {
          const user = await User.findOne({ name: r_reply.r_rwriter });

          if (!user) {
            throw new Error(`User with name "${r_reply.r_rwriter}" not found`);
          }

          return user.image;
        })
      );

      return res.status(200).json({
        data: result,
        RsameUsers: RsameUsers,
        profileImgs: profileImgs,
        message: ` ${typeof selectedRId}대댓글 가져오기 성공`,
      });
    }
    /* else {
      return res.status(404).json({ message: "대댓글이 존재하지 않습니다." });
    } */
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// 대댓글
app.get("/getR_Reply/:id/:rid", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  const postRId = req.params.id;
  const selectedRId = req.params.rid;

  try {
    const result = await R_Reply.find({
      postRId: Number(postRId),
      selectedRId: Number(selectedRId),
    });
    if (result) {
      const RsameUsers = result.map((reply) => reply._user === userId);
      console.log(RsameUsers);

      //let RsameUsers = false;
      //console.log('result[0]: ', result[0].r_rwriter);
      //if (userId === result[0].r_rwriter) RsameUsers = true;
      //console.log(postRId);
      //console.log(selectedRId);

      // 사용자 프로필 이미지 반환
      const profileImgs = await Promise.all(
        result.map(async (r_reply) => {
          const user = await User.findOne({ name: r_reply.r_rwriter });

          if (!user) {
            throw new Error(`User with name "${r_reply.r_rwriter}" not found`);
          }

          return user.image;
        })
      );

      return res.status(200).json({
        data: result,
        RsameUsers: RsameUsers,
        profileImgs: profileImgs,
        message: ` ${typeof selectedRId}대댓글 가져오기 성공`,
      });
    } else {
      return res.status(404).json({ message: "대댓글이 존재하지 않습니다." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/// 대댓글 작성 T
app.post("/postTr_reply/:id/:rid", async (req, res) => {
  const { r_reply, /* isRSecret, */ r_rwriteDate, r_rwriter } = req.body;
  const { id, rid } = req.params;

  const post = await TWrite.findOne({ _id: id });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const reply = await TReply.findOne({ _id: rid });
  if (!reply) {
    return res.status(404).json({ message: "Reply not found" });
  }

  const r_replycounter = await TR_ReplyCounter.findOneAndUpdate(
    { name: "대댓글 수" },
    { $inc: { totalR_Reply: 1 } },
    { new: true, upsert: true }
  );
  const 총대댓글수 = r_replycounter.totalR_Reply + 1;

  const r_rwriterId = await User.findOne({ name: r_rwriter });

  if (!r_replycounter) {
    return res.status(500).json({ message: "Counter not found" });
  }
  try {
    const newR_Reply = new TR_Reply({
      postRId: id,
      selectedRId: rid,
      _id: 총대댓글수 + 1, //댓글번호
      r_rwriter: r_rwriter,
      _user: r_rwriterId._id,
      r_rwriteDate: r_rwriteDate,
      r_reply: r_reply,
      //isRSecret : isRSecret
    });
    await newR_Reply.save();

    return res.status(200).json({ message: `Reply created successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

/// 대댓글 작성
app.post("/postr_reply/:id/:rid", async (req, res) => {
  const { r_reply, /* isRSecret, */ r_rwriteDate, r_rwriter } = req.body;
  const { id, rid } = req.params;

  const post = await Write.findOne({ _id: id });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const reply = await Reply.findOne({ _id: rid });
  if (!reply) {
    return res.status(404).json({ message: "Reply not found" });
  }

  const r_replycounter = await R_ReplyCounter.findOneAndUpdate(
    { name: "대댓글 수" },
    { $inc: { totalR_Reply: 1 } },
    { new: true, upsert: true }
  );
  const 총대댓글수 = r_replycounter.totalR_Reply + 1;

  const r_rwriterId = await User.findOne({ name: r_rwriter });

  if (!r_replycounter) {
    return res.status(500).json({ message: "Counter not found" });
  }
  try {
    const newR_Reply = new R_Reply({
      postRId: id,
      selectedRId: rid,
      _id: 총대댓글수 + 1, //댓글번호
      r_rwriter: r_rwriter,
      _user: r_rwriterId._id,
      r_rwriteDate: r_rwriteDate,
      r_reply: r_reply,
      //isRSecret : isRSecret
    });
    await newR_Reply.save();

    return res.status(200).json({ message: `Reply created successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});



app.post("/viewTReplyRModify", async (req, res) => {
  const { postRId, selectedRId, _id, r_rWriteDate, r_reply /* , isRSecret */ } =
    req.body;

  console.log(postRId + selectedRId + _id + r_rWriteDate + r_reply);
  try {
    const updatedViewReplyRModify = await TR_Reply.findOneAndUpdate(
      { postRId, selectedRId, _id },
      {
        $set: { r_rWriteDate, r_reply /* , isRSecret */ },
      }
    );

    return res.status(200).json({
      message: `r_reply ${_id} updated successfully`,
      updatedViewReplyRModify,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.post("/viewReplyRModify", async (req, res) => {
  const { postRId, selectedRId, _id, r_rWriteDate, r_reply /* , isRSecret */ } =
    req.body;

  console.log(postRId + selectedRId + _id + r_rWriteDate + r_reply);
  try {
    const updatedViewReplyRModify = await R_Reply.findOneAndUpdate(
      { postRId, selectedRId, _id },
      {
        $set: { r_rWriteDate, r_reply /* , isRSecret */ },
      }
    );

    return res.status(200).json({
      message: `r_reply ${_id} updated successfully`,
      updatedViewReplyRModify,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

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

    return res
      .status(200)
      .json({ message: `R_Reply ${rrid} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

// 대댓글 내용 가져오기 Ask
app.get("/tView/:id/modify/:selectedARId/:rrid", async (req, res) => {
  const postId = req.params.id;
  const selectedARId = req.params.selectedARId;
  const rrid = req.params.rrid;

  try {
    const result = await TR_Reply.find({
      postRId: Number(postId),
      selectedARId: Number(selectedARId),
      _id: Number(rrid),
    });
    console.log(result);

    if (result) {
      return res.status(200).json({
        result: result,
        message: `댓글 id 가져오기 성공`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.delete("/tView/:id/reply/:replyId", async (req, res) => {
  const postId = req.params.id;
  const replyId = req.params.replyId;

  try {
    const reply = await TReply.findOne({ postId: postId, _id: replyId });

    if (!reply) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    console.log(reply);

    await TReply.deleteOne({ postId: postId, _id: replyId });

    res.status(200).json({ message: "댓글을 삭제하였습니다." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "댓글삭제 실패" });
  }
});

app.delete("/postTr_reply/:id/:rid/:rrid", async (req, res) => {
  const { id, rid, rrid } = req.params;

  const post = await TWrite.findOne({ _id: id });
  if (!post) {
    return res.status(404).json({ message: "TPost not found" });
  }

  const reply = await TReply.findOne({ _id: rid });
  if (!reply) {
    return res.status(404).json({ message: "TReply not found" });
  }

  const r_reply = await TR_Reply.findOne({ _id: rrid });
  if (!r_reply) {
    return res.status(404).json({ message: "TR_Reply not found" });
  }

  try {
    await TR_Reply.deleteOne({ _id: rrid });

    return res
      .status(200)
      .json({ message: `TR_Reply ${rrid} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

app.get("/header-profile", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const user = await User.findOne({ _id: userId });
    if (user.image) {
      return res.status(200).json({ image: user.image });
    } else {
      return res.status(204).json({
        message: `이미지가 없습니다.`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// view 스크랩 수 가져오기(모집글)
app.get("/getBookmarkCount/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    const result = await PostGood.findOne({ _id: Number(postId) });

    if (result) {
      //console.log('result: ', result);
      return res.status(200).json({
        result: result,
        message: `스크랩 수 가져오기 성공`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// tView 스크랩 수 가져오기(모집글)
/* app.get("/getTBookmarkCount/:id", async(req, res) => {
  const postId = req.params.id; */

app.get("/users/:id/profileImage", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

app.put("/likeAreply/:id", auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const reply = await AReply.findById(id);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    const likedByUser = reply.likes.includes(userId);
    if (likedByUser) {
      // 이미 좋아요한 상태라면 좋아요 취소
      reply.likes.pull(userId);
      reply.likesCount -= 1;
    } else {
      // 좋아요 추가
      reply.likes.push(userId);
      reply.likesCount += 1;
    }

    await reply.save();

    return res.status(200).json({ message: "Like updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/myLikedPost", auth, async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;

  const userId = req.user.id;

  console.log(userId);

  try {
    const studyLiked = await PostGood.find({ "_users.user": userId });

    console.log(studyLiked);

    const studyLikedIds = studyLiked.map((post) => post._id);
    console.log(studyLikedIds);

    const likedPosts = await Write.find({ _id: { $in: studyLiked } })
      .skip(offset)
      .limit(limit);
    console.log(likedPosts);

    if (studyLiked.length > 0) {
      return res.status(200).json({
        likePosts: likedPosts,
        success: true,
      });
    } else {
      return res.status(400).json({
        message: "데이터가 존재하지 않습니다.",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// askView 스크랩 수 가져오기(모집글)
app.get("/getAskBookmarkCount/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    const result = await AskGood.findOne({ _id: Number(postId) });

    if (result) {
      //console.log('result: ', result);
      return res.status(200).json({
        result: result,
        message: `스크랩 수 가져오기 성공`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getMyHappiness", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const result = await HappinessIndex.findOne({ _user: userId });

    if (result) {
      //console.log('result: ', result);
      return res.status(200).json({
        happiness: result.happinessIndex,
        message: `스크랩 수 가져오기 성공`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* app.get("/getARGood2/:clickedAReplyId", async (req, res) => { */
app.get("/myLikedQuestion", auth, async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;

  const userId = req.user.id;

  console.log(userId);

  try {
    const questionLiked = await AskGood.find({ "_users.user": userId });

    console.log(questionLiked);

    const questionLikedIds = questionLiked.map((question) => question._id);
    console.log(questionLikedIds);

    const likedQuestions = await Ask.find({ _id: { $in: questionLiked } })
      .skip(offset)
      .limit(limit);
    console.log(likedQuestions);

    if (questionLiked.length > 0) {
      return res.status(200).json({
        likeQuestions: likedQuestions,
        success: true,
      });
    } else {
      return res.status(400).json({
        message: "데이터가 존재하지 않습니다.",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//댓글 좋아요
app.get("/getARGood/:clickedAReplyId", async (req, res) => {
  try {
    //const id = req.params.clickedAReplyId;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, mysecretkey);
    const userId = decodedToken.id;

    /*const reply = await AReply.findOne({ _id: Number(req.params.id) });
    if (!reply) {
      return res.status(404).json({ message: `댓글이 없습니다` });
    }*/

    const result = await AskARGood.findOne({ _id: req.params.clickedAReplyId });
    if (!result) {
      return res.status(404).json({ message: `좋아요가 없습니다` });
    }

    console.log("get: ", result.ARgoodCount);

    const isUser = result._users.some((user) => user.user === userId);
    return res.status(200).json({
      isARGood: isUser,
      ARgoodCount: result.ARgoodCount,
      message: `좋아요 리스트 가져오기 성공`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getGood2/:id", async (req, res) => {
  try {
    const result = await AskGood.findOne({ _id: Number(req.params.id) });
    if (result) {
      return res.status(200).json({
        count: result.goodCount,
        message: `좋아요 리스트 가져오기 성공`,
      });
    } else {
      return res.status(204).json({
        message: `좋아요가 없습니다`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/setGood/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const result = await AskGood.findOne({ _id: Number(req.params.id) });

    if (!result) {
      const newDoc = new AskGood({
        _id: Number(req.params.id),
        _users: [{ user: userId, time: new Date() }],
        goodCount: 1,
      });
      await newDoc.save();
      return res.status(201).json({
        goodCount: 1,
        message: `좋아요가 추가되었습니다`,
      });
    }
    const index = result._users.findIndex((obj) => obj.user === userId);
    if (index > -1) {
      result._users.splice(index, 1);
      result.ARgoodCount--;
      //console.log("sub: ", result.ARgoodCount);
      await result.save();
      return res.status(200).json({
        ARgoodCount: result.ARgoodCount,
        message: `좋아요가 취소되었습니다`,
      });
    } else {
      result._users.push({ user: userId, time: new Date() });
      result.ARgoodCount++;
      //console.log("add: ", result.ARgoodCount);
      await result.save();
      return res.status(200).json({
        ARgoodCount: result.ARgoodCount,
        message: `좋아요가 추가되었습니다`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.get("/header-profile", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;

  try {
    const user = await User.findOne({ _id: userId });
    if (user.image) {
      return res.status(200).json({ image: user.image });
    } else {
      return res.status(204).json({
        message: `이미지가 없습니다.`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
//recommend 서버코드

app.get("/recommend", async (req, res) => {
  try {
    const topHappinessDocs = await HappinessIndex.find()
      .sort({ happinessIndex: -1 })
      .limit(3);

    if (topHappinessDocs) {
      const result = [];
      for (let i = 0; i < topHappinessDocs.length; i++) {
        const happiness = topHappinessDocs[i].happinessIndex;
        const userId = topHappinessDocs[i]._user;

        let name = null;
        let profileImage = null;

        try {
          const user = await User.findById(userId);
          if (user) {
            name = user.name;
            profileImage = user.image || null;
          }

          // portfolio에서 userId가 userId인 문서 가져오기
          const portfolio = await Portfolio.findOne({ userId });

          result.push({
            happiness,
            name,
            profileImage,
            userId,
            portfolio: portfolio || [],
          });
        } catch (error) {
          console.log(error);
        }
      }
      return res.status(200).json({
        topHappiness: result,
        message: "상위 행복 지수 문서 가져오기 성공",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
/* 
app.get("/search", async (req, res) => {
  const option = decodeURIComponent(req.query.selected);
  const value = decodeURIComponent(req.query.value);

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;
  var openStudiesSearch = [];

  try {
    if (option === "title") {
      openStudiesSearch = await OpenStudy.find({ title: value }, null, {
        skip: offset,
        limit: limit,
      });
    } else if (option === "tags") {
      openStudiesSearch = await OpenStudy.find(
        { tags: { $in: [value] } },
        null,
        { skip: offset, limit: limit }
      );
    }

    if (openStudiesSearch.length > 0) {
      return res.status(200).json({
        good: isUser,
        count: result.goodCount,
        message: `좋아요 리스트 가져오기 성공`,
      });
    } else {
      return res.status(204).json({
        message: `좋아요가 없습니다`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}); */

app.get("/view/:id/modify/:selectedARId/:rrid", async (req, res) => {
  const postRId = req.params.id;
  const selectedARId = req.params.selectedARId;
  const rrid = req.params.rrid;

  try {
    const result = await AR_Reply.find({
      postRId: Number(postRId),
      selectedARId: Number(selectedARId),
      _id: Number(rrid),
    });
    console.log(result);
    if (result) {
      return res.status(200).json({
        result: result,
        message: `댓글 id 가져오기 성공`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.delete("/postAr_reply/:id/:rid/:rrid", async (req, res) => {
  const { id, rid, rrid } = req.params;

  const post = await Ask.findOne({ _id: id });
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

    return res
      .status(200)
      .json({ message: `AR_Reply ${rrid} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

//질문글 대댓글 삭제
app.delete("/postAr_reply/:id/:rid/:rrid", async (req, res) => {
  const { id, rid, rrid } = req.params;

  const post = await Ask.findOne({ _id: id });
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

    return res
      .status(200)
      .json({ message: `AR_Reply ${rrid} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});

/// 질문글 대댓글 수정
app.get("/askview/:id/modify/:selectedARId/:rrid", async (req, res) => {
  const postRId = req.params.id;
  const selectedARId = req.params.selectedARId;
  const rrid = req.params.rrid;

  try {
    const result = await AR_Reply.find({
      postRId: Number(postRId),
      selectedARId: Number(selectedARId),
      _id: Number(rrid),
    });
    console.log(result);
    if (result) {
      return res.status(200).json({
        result: result,
        message: `댓글 id 가져오기 성공`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/askviewReplyARModify", async (req, res) => {
  const { postRId, selectedARId, _id, Ar_rWriteDate, Ar_reply, isARSecret } =
    req.body;

  try {
    const updatedaskViewReplyARModify = await AR_Reply.findOneAndUpdate(
      { postRId, selectedARId, _id },
      {
        $set: { Ar_rWriteDate, Ar_reply, isARSecret },
      }
    );

    return res.status(200).json({
      message: `Ar_reply ${_id} updated successfully`,
      updatedaskViewReplyARModify,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* app.get("/getTApplicant/:id", async (req, res) => {
  try {
    const applicants = await TApplicant.find({ postId: req.params.id });

    const result = [...applicants.map((r) => r.userName)];

    return res.status(200).json({
      postId: req.params.id,
      data: result,
      message: `강사모집 신청자 가져오기 성공`,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/tApplicantSave", async (req, res) => {
  const { userName, postId } = req.body;

  const userId = await User.findOne({ name: userName });

  try {
    const newApplicant = new TApplicant({
      userId: userId._id,
      userName: userName,
      postId: postId,
    });
    await newApplicant.save();

    return res.status(200).json({ message: `applicant save successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `서버오류` });
  }
});
 */
app.post("/get-time", async (req, res) => {
  const { roomTitle } = req.body;

  try {
    const result = await RoomSchedule.findOne({ roomTitle: roomTitle });
    if (result) {
      const startDateTime = new Date(`${result.date}T${result.startTime}:00`);

      // 현재 시간을 가져옵니다.
      const currentDateTime = new Date();

      // 남은 시간을 계산합니다.
      const remainingTime =
        startDateTime.getTime() +
        parseInt(result.runningTime) * 60000 -
        currentDateTime.getTime();

      // 시간과 분으로 변환합니다.
      const hours = Math.floor(remainingTime / 3600000);
      const minutes = Math.floor((remainingTime % 3600000) / 60000);

      return res.status(200).json({
        hour: hours,
        minute: minutes,
        message: `시간 가져오기 성공`,
      });
    } else {
      return res.status(404).json({ message: "글이 존재하지 않습니다." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/change-time", async (req, res) => {
  const { hour, minute, roomTitle } = req.body;

  try {
    const result = await RoomSchedule.find({ roomTitle: roomTitle });
    if (result.length > 0) {
      for (const item of result) {
        const startDateTime = new Date(`${item.date}T${item.startTime}:00`);
        const currentDateTime = new Date();

        // 경과 시간을 밀리초로 계산합니다.
        const elapsedTimeInMillis =
          currentDateTime.getTime() - startDateTime.getTime();

        // 경과 시간을 분으로 변환합니다.
        const elapsedTimeInMinutes = Math.floor(elapsedTimeInMillis / 60000);

        // runningTime을 hour과 minute으로 계산합니다.
        const newRunningTime =
          parseInt(hour) * 60 + parseInt(minute) + 1 + elapsedTimeInMinutes;

        // runningTime을 업데이트합니다.
        item.runningTime = String(newRunningTime);
        await item.save();
      }

      return res
        .status(200)
        .json({ message: "runningTime updated successfully" });
    } else {
      return res.status(404).json({
        message: "해당 roomTitle의 데이터를 찾을 수 없습니다.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/get-reviews", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const myRoomSchedules = await RoomSchedule.find({
      userId: userId,
      userType: "Student",
      prepaymentBtn: true,
    }).exec();

    const studentRoomTitles = myRoomSchedules.map(
      (schedule) => schedule.roomTitle
    );
    const currentDateTime = new Date();

    const teacherRoomSchedules = await RoomSchedule.find({
      roomTitle: { $in: studentRoomTitles },
      userType: "Teacher",
      reviewWritten: { $exists: false },
    }).exec();

    const result = []; // 결과를 저장할 배열

    teacherRoomSchedules.forEach((item) => {
      const startTime = item.startTime;
      const date = item.date;
      const runningTime = item.runningTime;

      const startTimeObj = new Date();
      const [hours, minutes] = startTime.split(":");
      startTimeObj.setHours(parseInt(hours));
      startTimeObj.setMinutes(parseInt(minutes));

      const dateObj = new Date(date);

      const combinedDateTime = new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        startTimeObj.getHours(),
        startTimeObj.getMinutes()
      );

      combinedDateTime.setMinutes(
        combinedDateTime.getMinutes() + parseInt(runningTime)
      );

      const targetDateTime = new Date(combinedDateTime);

      if (targetDateTime <= currentDateTime) {
        result.push(item);
      }
    });

    return res.status(200).json({ result: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

app.post("/send-review", async (req, res) => {
  const {
    teacherId,
    sendStar,
    reviewWrittenId,
    reviewContent,
    writerName,
    date,
  } = req.body;

  try {
    let happinessIndexIncrement;

    switch (sendStar) {
      case 5:
        happinessIndexIncrement = 1;
        break;
      case 4:
        happinessIndexIncrement = 0.8;
        break;
      case 3:
        happinessIndexIncrement = 0.6;
        break;
      case 2:
        happinessIndexIncrement = 0.4;
        break;
      case 1:
        happinessIndexIncrement = 0.2;
        break;
      case 0:
        happinessIndexIncrement = -1;
        break;
      default:
        happinessIndexIncrement = 0;
    }

    let updatedHappinessIndex = await HappinessIndex.findOne({
      _user: teacherId,
    });

    if (!updatedHappinessIndex) {
      updatedHappinessIndex = new HappinessIndex({
        _user: teacherId,
        happinessIndex: "50.0", // 초기값을 문자열로 설정
      });
    }

    const parsedHappinessIndex = parseFloat(
      updatedHappinessIndex.happinessIndex
    );
    updatedHappinessIndex.happinessIndex = (
      parsedHappinessIndex + happinessIndexIncrement
    )
      .toFixed(1)
      .toString(); // 계산 후 다시 문자열로 변환
    await updatedHappinessIndex.save();

    await RoomSchedule.findOneAndUpdate(
      { _id: reviewWrittenId },
      { reviewWritten: true }
    );

    const review = {
      star: sendStar,
      writerName: writerName,
      date: date,
      reviewContent: reviewContent,
    };

    const reviewUser = await ReviewContent.findOne({ _user: teacherId });
    if (reviewUser) {
      reviewUser.reviewContents.push(review);
      await reviewUser.save();
    } else {
      const newReviewUser = new ReviewContent({
        _user: teacherId,
        reviewContents: [review],
      });
      await newReviewUser.save();
    }

    return res.status(200).json({
      message: `Happiness Index for user ${teacherId} updated successfully`,
      updatedHappinessIndex,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getMyReview", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    let reviews = await ReviewContent.findOne({
      _user: userId,
    });
    if (reviews) {
      return res.status(200).json({
        reviews: reviews,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/getTargetReview", async (req, res) => {
  const { targetUser } = req.body;

  console.log(targetUser);
  try {
    let reviews = await ReviewContent.findOne({
      _user: targetUser,
    });
    if (reviews) {
      return res.status(200).json({
        reviews: reviews,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/upload", upload.single("file"), (req, res) => {
  // (7)
  res.status(200).json(req.file);
});

app.get("/", (req, res) => {
  res.send("hello world!");
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
    if (openStudies.length > 0) {
      return res.status(200).json({
        openStudies: openStudies,
        //totalOpenStudies,
        message: "오픈스터디 목록 가져오기 성공",
        success: true,
        openStudies,
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
});

app.get("/studies", async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;

  try {
    const studies = await Write.find()
      .sort({ writeDate: -1 })
      .skip(offset)
      .limit(limit);
    const counter = await Write.count();
    const hasMore = counter > page * limit;

    if (studies.length > 0) {
      return res.status(200).json({
        studies: studies,
        message: "스터디 모집글 목록 가져오기",
        success: true,
        hasMore: hasMore,
        studies,
      });
    } else {
      return res.status(404).json({
        message: "데이터가 존재하지 않습니다.",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.get("/myStudies", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;

  try {
    const studies = await Write.find({ _user: userId })
      .sort({ writeDate: -1 })
      .skip(offset)
      .limit(limit);
    const counter = await Write.count();
    const hasMore = counter > page * limit;

    if (studies.length > 0) {
      return res.status(200).json({
        studies: studies,
        message: "스터디 모집글 목록 가져오기",
        success: true,
        hasMore: hasMore,
        studies,
      });
    } else {
      return res.status(204).json({
        message: "데이터가 존재하지 않습니다.",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.get("/myAsks", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;

  try {
    const studies = await Ask.find({ _user: userId })
      .sort({ writeDate: -1 })
      .skip(offset)
      .limit(limit);
    const counter = await Ask.count();
    const hasMore = counter > page * limit;

    if (studies.length > 0) {
      return res.status(200).json({
        studies: studies,
        message: "스터디 모집글 목록 가져오기",
        success: true,
        hasMore: hasMore,
        studies,
      });
    } else {
      return res.status(204).json({
        message: "데이터가 존재하지 않습니다.",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.get("/questions", async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;

  try {
    const questions = await Ask.find()
      .sort({ writeDate: -1 })
      .skip(offset)
      .limit(limit);
    const counter = await Ask.count();
    const hasMore = counter > page * limit;

    if (questions.length > 0) {
      return res.status(200).json({
        questions: questions,
        message: "스터디 모집글 목록 가져오기",
        success: true,
        hasMore: hasMore,
      });
    } else {
      return res.status(404).json({
        message: "데이터가 존재하지 않습니다.",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// openStudy 검색
app.get("/searchOpenStudy", async (req, res) => {
  const option = req.query.selected;
  const value = decodeURIComponent(req.query.value);

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;
  var openStudiesSearch = [];

  try {
    if (option === "title") {
      openStudiesSearch = await OpenStudy.find(
        { title: { $regex: value, $options: "i" } },
        null,
        { skip: offset, limit: limit }
      );
    } else if (option === "tags") {
      openStudiesSearch = await OpenStudy.find(
        { tags: { $regex: value, $options: "i" } },
        null,
        { skip: offset, limit: limit }
      );
    }

    if (openStudiesSearch.length > 0) {
      return res.status(200).json({
        openStudies: openStudiesSearch,
        //totalOpenStudies,
        message: "검색목록 가져오기 성공",
        success: true,
      });
    } else {
      return res.status(200).json({
        openStudies: [],
        message: "검색결과가 없습니다",
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Study게시판 검색
app.get("/searchStudy", async (req, res) => {
  const option = req.query.selected;
  const value = decodeURIComponent(req.query.value);

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;
  var studiesSearch = [];

  try {
    if (option === "title") {
      studiesSearch = await Write.find(
        { title: { $regex: value, $options: "i" } },
        null,
        { skip: offset, limit: limit }
      );
    } else if (option === "tags") {
      studiesSearch = await Write.find(
        { tag: { $regex: value, $options: "i" } },
        null,
        { skip: offset, limit: limit }
      );
    }

    if (studiesSearch.length > 0) {
      return res.status(200).json({
        studies: studiesSearch,
        message: "검색목록 가져오기 성공",
        success: true,
      });
    } else {
      return res.status(200).json({
        studies: [],
        message: "검색결과가 없습니다",
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 질문게시판 검색
app.get("/searchQuestion", async (req, res) => {
  const option = req.query.selected;
  const value = decodeURIComponent(req.query.value);

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;
  var questionsSearch = [];

  try {
    if (option === "title") {
      questionsSearch = await Ask.find(
        { title: { $regex: value, $options: "i" } },
        null,
        { skip: offset, limit: limit }
      );
    } else if (option === "tags") {
      questionsSearch = await Ask.find(
        { tag: { $regex: value, $options: "i" } },
        null,
        { skip: offset, limit: limit }
      );
    }

    if (questionsSearch.length > 0) {
      return res.status(200).json({
        questions: questionsSearch,
        message: "검색목록 가져오기 성공",
        success: true,
      });
    } else {
      return res.status(200).json({
        questions: [],
        message: "검색결과가 없습니다",
        success: true,
      });
    }
  } catch (error) {
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
    if (option === "title") {
      openStudiesSearch = await OpenStudy.find({ title: value }, null, {
        skip: offset,
        limit: limit,
      });
    } else if (option === "tags") {
      openStudiesSearch = await OpenStudy.find(
        { tags: { $in: [value] } },
        null,
        { skip: offset, limit: limit }
      );
    }

    if (openStudiesSearch.length > 0) {
      return res.status(200).json({
        openStudies: openStudiesSearch,
        //totalOpenStudies,
        message: "검색목록 가져오기 성공",
        success: true,
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
});

app.get("/myLikedPost", auth, async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;

  const userId = req.user.id;

  console.log(userId);

  try {
    const studyLiked = await PostGood.find({ "_users.user": userId });

    console.log(studyLiked);

    const studyLikedIds = studyLiked.map((post) => post._id);
    console.log(studyLikedIds);

    const likedPosts = await Write.find({ _id: { $in: studyLiked } })
      .skip(offset)
      .limit(limit);
    console.log(likedPosts);

    if (studyLiked.length > 0) {
      return res.status(200).json({
        likePosts: likedPosts,
        success: true,
      });
    } else {
      return res.status(400).json({
        message: "데이터가 존재하지 않습니다.",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/myLikedTPost", auth, async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;

  const userId = req.user.id;

  console.log(userId);

  try {
    const sRecruitmentLiked = await TPostGood.find({ "_users.user": userId });

    console.log(sRecruitmentLiked);

    const studyLikedIds = sRecruitmentLiked.map((post) => post._id);
    console.log(studyLikedIds);

    const likedPosts = await TWrite.find({ _id: { $in: sRecruitmentLiked } })
      .skip(offset)
      .limit(limit);
    console.log(likedPosts);

    if (sRecruitmentLiked.length > 0) {
      return res.status(200).json({
        likePosts: likedPosts,
        success: true,
      });
    } else {
      return res.status(400).json({
        message: "데이터가 존재하지 않습니다.",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/myLikedQuestion", auth, async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;

  const userId = req.user.id;

  console.log(userId);

  try {
    const questionLiked = await AskGood.find({ "_users.user": userId });

    console.log(questionLiked);

    const questionLikedIds = questionLiked.map((question) => question._id);
    console.log(questionLikedIds);

    const likedQuestions = await Ask.find({ _id: { $in: questionLiked } })
      .skip(offset)
      .limit(limit);
    console.log(likedQuestions);

    if (questionLiked.length > 0) {
      return res.status(200).json({
        likeQuestions: likedQuestions,
        success: true,
      });
    } else {
      return res.status(400).json({
        message: "데이터가 존재하지 않습니다.",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getGood/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const result = await AskGood.findOne({ _id: Number(req.params.id) });
    if (result) {
      let isUser = false;
      for (let i = 0; i < result._users.length; i++) {
        if (userId === result._users[i].user) isUser = true;
      }
      return res.status(200).json({
        good: isUser,
        count: result.goodCount,
        message: `좋아요 리스트 가져오기 성공`,
      });
    } else {
      return res.status(204).json({
        message: `좋아요가 없습니다`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getGood2/:id", async (req, res) => {
  try {
    const result = await AskGood.findOne({ _id: Number(req.params.id) });
    if (result) {
      return res.status(200).json({
        count: result.goodCount,
        message: `좋아요 리스트 가져오기 성공`,
      });
    } else {
      return res.status(204).json({
        message: `좋아요가 없습니다`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/setGood/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const result = await AskGood.findOne({ _id: Number(req.params.id) });

    if (!result) {
      const newDoc = new AskGood({
        _id: Number(req.params.id),
        _users: [{ user: userId, time: new Date() }],
        goodCount: 1,
      });
      await newDoc.save();
      return res.status(201).json({
        goodCount: 1,
        message: `좋아요가 추가되었습니다`,
      });
    } else {
      const index = result._users.findIndex((obj) => obj.user === userId);
      if (index > -1) {
        result._users.splice(index, 1);
        result.goodCount--;
        await result.save();
        return res.status(200).json({
          goodCount: result.goodCount,
          message: `좋아요가 취소되었습니다`,
        });
      } else {
        result._users.push({ user: userId, time: new Date() });
        result.goodCount++;
        await result.save();
        return res.status(200).json({
          goodCount: result.goodCount,
          message: `좋아요가 추가되었습니다`,
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getGoodPost/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const result = await PostGood.findOne({ _id: Number(req.params.id) });
    if (result) {
      let isUser = false;
      for (let i = 0; i < result._users.length; i++) {
        if (userId === result._users[i].user) {
          isUser = true;
        }
      }
      return res.status(200).json({
        good: isUser,
        count: result.goodCount,
        message: `좋아요 리스트 가져오기 성공`,
      });
    } else {
      return res.status(204).json({
        message: `좋아요가 없습니다`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getGoodPost2/:id", async (req, res) => {
  try {
    const result = await PostGood.findOne({ _id: Number(req.params.id) });
    if (result) {
      return res.status(200).json({
        count: result.goodCount,
        message: `좋아요 리스트 가져오기 성공`,
      });
    } else {
      return res.status(204).json({
        message: `좋아요가 없습니다`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/setGoodPost/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const result = await PostGood.findOne({ _id: Number(req.params.id) });

    if (!result) {
      const newDoc = new PostGood({
        _id: Number(req.params.id),
        _users: [{ user: userId, time: new Date() }],
        goodCount: 1,
      });
      await newDoc.save();
      return res.status(201).json({
        goodCount: 1,
        message: `좋아요가 추가되었습니다`,
      });
    } else {
      const index = result._users.findIndex((obj) => obj.user === userId);
      if (index > -1) {
        result._users.splice(index, 1);
        result.goodCount--;
        await result.save();
        return res.status(200).json({
          goodCount: result.goodCount,
          message: `좋아요가 취소되었습니다`,
        });
      } else {
        result._users.push({ user: userId, time: new Date() });
        result.goodCount++;
        await result.save();
        return res.status(200).json({
          goodCount: result.goodCount,
          message: `좋아요가 추가되었습니다`,
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/view", async (req, res) => {
  const { id, postName } = req.body;

  if (postName === "question") {
    try {
      const ask = await Ask.findOneAndUpdate(
        { _id: id },
        { $inc: { views: 1 } }, // views 필드를 1 증가시킴
        { new: true }
      );
      res.json({ message: "조회수 +1 성공" });
    } catch (err) {
      console.log(err);
      res.json({ error: err.message });
    }
  } else if (postName === "study") {
    try {
      const write = await Write.findOneAndUpdate(
        { _id: id },
        { $inc: { views: 1 } }, // views 필드를 1 증가시킴
        { new: true }
      );
      res.json({ message: "조회수 +1 성공" });
    } catch (err) {
      console.log(err);
      res.json({ error: err.message });
    }
  }
});

app.post("/getViewCount", async (req, res) => {
  const { id, postName } = req.body;

  if (postName === "question") {
    try {
      const ask = await Ask.findOne({ _id: id });
      if (ask) {
        return res.status(200).json({
          count: ask.views,
          message: `조회수 가져오기 성공`,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  } else if (postName === "study") {
    try {
      const write = await Write.findOne({ _id: id });
      if (write) {
        return res.status(200).json({
          count: write.views,
          message: `조회수 가져오기 성공`,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
});

app.get("/header-profile", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, mysecretkey);
  const userId = decodedToken.id;

  try {
    const user = await User.findOne({ _id: userId });
    if (user.image) {
      return res.status(200).json({ image: user.image });
    } else {
      return res.status(204).json({
        message: `이미지가 없습니다.`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/meetingClose", async (req, res) => {
  try {
    const roomTitle = req.body.roomTitle;

    const result = await RoomSchedule.find({ roomTitle: roomTitle });
    if (result.length > 0) {
      for (const item of result) {
        const startDateTime = new Date(`${item.date}T${item.startTime}:00`);
        const currentDateTime = new Date();

        // 경과 시간을 밀리초로 계산합니다.
        const elapsedTimeInMillis =
          currentDateTime.getTime() - startDateTime.getTime();

        // 경과 시간을 분으로 변환합니다.
        const elapsedTimeInMinutes = Math.floor(elapsedTimeInMillis / 60000);

        // runningTime을 업데이트합니다.
        item.runningTime = String(elapsedTimeInMinutes);
        await item.save();
      }
      return res.status(200).json({ message: "camClose updated successfully" });
    } else {
      return res.status(404).json({
        message: "해당 roomTitle의 데이터를 찾을 수 없습니다.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/upload", upload.single("file"), (req, res) => {
  // (7)
  res.status(200).json(req.file);
});

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.listen(8080, () => {
  console.log("서버가 시작되었습니다.");
  // delete require.cache["axios"];
  // console.log(require.cache);
});

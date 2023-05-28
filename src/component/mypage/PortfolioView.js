import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import { useParams } from "react-router-dom";
import axios from 'axios';
import Header from "../main/Header";
import userStore from "../../store/user.store";
import './PortfolioView.css';
import ProfileSideBar from './ProfileSideBar';
import { FcCancel } from "react-icons/fc";

function PortfolioView() {
    
    const [portfolio, setPortfolio] = useState([]);
    const token = localStorage.getItem('token');
    const user = userStore;
    const [contents, setContents] = useState();
    const [isRegistered, setIsRegistered] = useState(false);
    const { writerId } = useParams();
    const [review, setReview] = useState([]);
    //const [student, setStudent] = useState([""]);
    //const [writeDate, setWriteDate] = useState([""]);

    console.log(writerId);
    
    useEffect(() => {
        const fetchPortfolio = async () => {
            if(writerId){
                try{
                    const res = await axios.get(`http://localhost:8080/portfolio/${writerId}`);
                    const portfolio = res.data;
                    if(portfolio.length !== 0){
                        setPortfolio(res.data);
                        setIsRegistered(true);
                    }else{
                        setIsRegistered(false);
                    }
                    console.log(res.data);
                }catch(err){
                    console.error(err);
                }
            }    
        };

        const getReview = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/getReview/${writerId}`, {
                    headers : {Authorization: `Bearer ${token}`}
                });
                if (res.data !== undefined) {
                    //console.log("!!!!!: ", res.data.result);
                    /* setStudent(res.data.result.studentName);
                    setWriteDate(res.data.result.writeDate); */

                    console.log(res.data.result[33].teacherId, writerId);
                    if(writerId) {
                        for (var i = 0; i < res.data.result.length; i++) {
                            //setReview(res.data.result[i]);
    
                            const formattedDate = new Date(res.data.result[i].writeDate).toLocaleDateString('ko-KR');
                            res.data.result[i].writeDate = formattedDate;
    
                            const studentName = res.data.result[i].studentName;
                            const maskedName = studentName.charAt(0) + "*".repeat(studentName.length - 1);
                            res.data.result[i].studentName = maskedName;
                          }
                        setReview(res.data.result);
    
                        review.map((item, index) => (
                            console.log(item.review)
                        ));
                    }
                    
                }
            } catch(error) {
                console.log(error);
            }
        };


        fetchPortfolio();
        getReview();
    }, [writerId, token]);

    useEffect(() => {
        if (portfolio[0]?.content !== undefined){
            const contentString = JSON.stringify(portfolio[0]?.content);
            const cleanedString = contentString.replace(/undefined/g, "");
            const parsedContent = JSON.parse(cleanedString);
            const contents = parsedContent.content;
            setContents(contents);
        }
        
    }, [portfolio]);

    console.log(contents);

    if(isRegistered === false){
        return(
            <div className='Registered'>
                <Header/>
                <ProfileSideBar/>
                <p className='_registered'> <FcCancel size={28}/>볼 수 있는 포트폴리오가 없습니다.</p>
            </div>
        )
    }


    return (
        <div>
            <Header/>
            <ProfileSideBar/>
            <div className='viewContent'>
                <div className='view_title'>
                    <div className='viewTitle'>제목 {portfolio[0]?.title}</div>
                </div>
                <div className='view_contents'>
                    <div className='viewContents' dangerouslySetInnerHTML={{__html: contents}}/>
                </div>
            </div>
            <div className='reviewContent'>
                <div className='review'>후기</div>
            </div>
            <div className='review_contents'>
            {review.map((item, index) => (
                        item.review !== undefined ? 
                        (
                            <div className='reviewContents'>
                            <div key={index}>
                                <div>{item.studentName}</div>
                                <div>{item.writeDate}</div>
                                <div>{item.review}</div>
                            </div>
                            </div>
                        ) : null
                        
                    ))}
            </div>
        </div>
    )



}

export default PortfolioView;
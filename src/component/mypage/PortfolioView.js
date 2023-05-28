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
        fetchPortfolio();
    }, [writerId]);

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
        </div>
    )



}

export default PortfolioView;
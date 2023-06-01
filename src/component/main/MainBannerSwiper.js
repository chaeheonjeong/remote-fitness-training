import React, { useState } from "react";
import { Link } from "react-router-dom";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import {BsArrowRightCircle} from "react-icons/bs";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./MainBannerSwiper.css";

// import required modules
import { Parallax, Pagination, Navigation, Autoplay } from "swiper";

function MainBannerSwiper() {

  return (
    <>
      <Swiper
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
          "--swiper-navigation-size": "30px"
        }}
        speed={600}
        parallax={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{delay:2000}}
        navigation={true}
        modules={[Parallax, Pagination, Navigation, Autoplay]}
        className="mySwiper"
      >
        <div
          slot="container-start"
          className="parallax-bg"
          style={{
            "background-image":
            "url(https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80)",
          }}
          data-swiper-parallax="-23%"
        ></div>
        <SwiperSlide>
          <div className="title" data-swiper-parallax="-300">
          </div>
          <div className="subtitle" data-swiper-parallax="-200">
            강사모집
          </div>
          <div className="text" data-swiper-parallax="-100">
            <p>
                강사 모집글을 올리고  <br/>
                원하는 강사와 1:1 화상 강의를 해보세요
            </p>
          </div>
          <div className="Tbutton" data-swiper-parallx="-100">
          <Link to="/Recruitment"
            style={{ textDecoration: "none", display: 'flex', alignItems: 'center'}}
            >
                <BsArrowRightCircle style={{ marginRight: '5px' }}/>바로가기
            </Link>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="title" data-swiper-parallax="-300">
          </div>
          <div className="subtitle" data-swiper-parallax="-200">
            학생모집
          </div>
          <div className="text" data-swiper-parallax="-100">
            <p>
                학생 모집글을 올리고 <br/>
                즐거운 운동을 가르쳐 줄 수강생들을 모집해 보세요   
            </p>
          </div>
          <div className="Tbutton" data-swiper-parallx="-100">
            <Link to="/detailsRecruitment"
            style={{ textDecoration: "none", display: 'flex', alignItems: 'center'}}
            >
                <BsArrowRightCircle style={{ marginRight: '5px' }}/>바로가기
            </Link>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="title" data-swiper-parallax="-300">
          </div>
          <div className="subtitle" data-swiper-parallax="-200">
            Q&A
          </div>
          <div className="text" data-swiper-parallax="-100">
            <p>
                Q&A에 글을 쓰고<br/>
                평소에 궁금했던 운동에 대한 궁금증을 풀어보세요
            </p>
          </div>
          <div className="Tbutton" data-swiper-parallx="-100">
          <Link to="/detailQuestion"
            style={{ textDecoration: "none", display: 'flex', alignItems: 'center'}}
            >
                <BsArrowRightCircle style={{ marginRight: '5px' }}/>바로가기
            </Link>
          </div>
        </SwiperSlide>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
      </Swiper>
    </>
  );
}

export default MainBannerSwiper;
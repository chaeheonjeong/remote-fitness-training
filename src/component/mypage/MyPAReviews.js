import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MyPAReviews = () => {
    const [have, setHave] = useState(false);
    const [portfolio, setPortfolio] = useState([]);
    const [reviews, setReviews] = useState([]);

    const { name } = useParams();

    const getPortfolio = () => {
        axios
            .get(`http://localhost:8080/getPortfolio/${name}`)
            .then((response) => {
                
                if(response.status === 200) {
                    if(response.data.result.length !== 0) {
                        setHave(true);
                        //setPortfolio(response.data.result);
                    }
                }
            })
    }
    useEffect(() => {
        getPortfolio();
    }, []);

    return(
        <>
            {
                have === true ? (
                    

                    // 포트폴리오 내용 있을 경우
                    <></>
                ) : (
                    // 포트폴리오 내용 없을 경우
                    <div>
                        아직 포트폴리오를 작성하지 않으셨습니다.
                    </div>
                )
            }
        </>
    );
};

export default MyPAReviews;
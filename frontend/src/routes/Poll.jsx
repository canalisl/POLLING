import styles from "./Poll.module.css";
import Footer from "../components/layout/Footer";
import Newnav from "../components/layout/NewNav";
import produce from "../assets/produce.PNG";
import Countdown from "react-countdown";
import CandList from "../components/poll/CandList";
import VotePaper from "../components/poll/VotePaper";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Poll() {
  const params = useParams();
  // console.log("파라미터", params);
  const [itemDetail, setItemDetail] = useState({});
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [cand, setCand] = useState([]);
  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(`https://j6a304.p.ssafy.io/api/polls/${params.pollnum}`)
      .then((res) => {
        console.log(res);
        setItemDetail((prev) => {
          return { ...prev, ...res.data };
        });
        setStart(res.data.startDate);
        setEnd(res.data.endDate);
        setCand(res.data.candidates);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, []);

  // 후보들 득표 순으로 정렬하기
  // itemDetail.data.candidates.sort(
  //   (a, b) => b.votesTotalCount - a.votesTotalCount
  // );
  const startYMD = start.slice(0, 10).replaceAll("-", ".");
  const endYMD = end.slice(0, 10).replaceAll("-", ".");

  const endDay = new Date(2022, 3, 30, 23, 59, 0, 0);
  const renderCounter = ({ days, hours, minutes, seconds }) => (
    <div className={styles.timer}>
      투표 종료까지 남은 시간
      <br /> {days} DAYS | {hours}시간 : {minutes}분 : {seconds}초
    </div>
  );

  return (
    <>
      <Newnav />
      <div className={styles.poll_container}>
        <div className={styles.pl_left}>
          <div className={styles.left_title}>Selected Poll</div>
          <div className={styles.poll_Info}>
            <Countdown date={endDay} renderer={renderCounter} />
            <img
              src={itemDetail.thumbnail}
              alt="fox"
              className={styles.pollImg}
            />
            {/* <VotePaper cand={cand} /> */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <figcaption>
                <span style={{ fontSize: "1vw" }}>
                  {startYMD} ~ {endYMD}
                </span>
                <br />
                <span>{itemDetail.title}</span>
                <br />
              </figcaption>
              <div>{itemDetail.content}</div>
            </div>
          </div>
        </div>
        <div className={styles.pl_right}>
          <CandList cand={cand} />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Poll;

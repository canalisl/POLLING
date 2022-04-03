import NewNav from "../components/layout/NewNav.jsx"
import styles from "./Candidate.module.css";
import Button from '@mui/material/Button';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Comment from "../components/comment/Comment"
import mark from "../assets/mark_slim.png"
import crown from "../assets/crown.png"
import tx from "../assets/tx.png"
import axios from "axios";
import Modal from '@mui/material/Modal';
import Swal from "sweetalert2";
import x from "../assets/x.png";
import stamp from "../assets/stamp.png";



function Candidate() {

    const navigate = useNavigate();
    const params = useParams();

    const [candi_name, setCandi_name] = useState("")
    const [profile, setProfile] = useState("")
    const [profile_image, setProfile_image] = useState("" )
    const [photo1, setPhoto1] = useState("")
    const [photo2, setPhoto2] = useState("")
    const [photo3, setPhoto3] = useState("")
    const [voteCount, setVoteCount] = useState(0)
    const [commentdata, setCommentdata] = useState([])
    const [renderCount, setRenderCount] = useState(0)
    const [modalOpen, setmodalOpen] = useState(false);
    const [picked, setPicked] = useState(false);
    const [modalOpen2, setmodalOpen2] = useState(false);

    const pollOpen = sessionStorage.getItem("open")
    const polltitle = sessionStorage.getItem("poll")
    
    useEffect(()=>{
        window.scrollTo(0,0);
    }, [])

    useEffect(()=>{
        axios.get(`https://j6a304.p.ssafy.io/api/polls/candidates/${params.id}`)
        .then((res) => {  
            console.log(res)
            setProfile_image(res.data.thumbnail)
            setPhoto1(res.data.imagePath1)
            setPhoto2(res.data.imagePath2)
            setPhoto3(res.data.imagePath3)
            setCandi_name(res.data.name)
            setProfile(res.data.profile)
            setVoteCount(res.data.voteTotalCount)
            setCommentdata(res.data.comments)
        })
        .catch(error => {
            console.log(error.response)
        });  
    }, [renderCount]);

    function changePhoto1(){
        setProfile_image(photo1)
        setPhoto1(profile_image)
    }

    function changePhoto2(){
        setProfile_image(photo2)
        setPhoto2(profile_image)
    }
    
    function changePhoto3(){
        setProfile_image(photo3)
        setPhoto3(profile_image)
    }

    function gotoList(){
        navigate(`/poll/${params.pollnum}`)
    }


    function renderCheck(){
        setRenderCount((renderCount)=>(renderCount+1))
    }

    function handleOpen(){
        setmodalOpen(true);
    }

    function handleClose(){
        setmodalOpen(false);
        setPicked(false);
    }
    
    function handlePicked(){
        if (picked){
            setPicked(false);
        } else{
            setPicked(true);
        }
    }

    function handlepoll(){
        if (picked){

            // 블록체인 투표 하는 부분
            Swal.fire({
                title: '투표가 완료되었습니다.',
                icon: 'success'                        
            })
            handleClose();
        } else {
            Swal.fire({
                title: '투표 도장을 찍어주세요.',
                icon: 'error'                        
            })
        }
    }

    function handleOpen2(){
        setmodalOpen2(true);
    }

    function handleClose2(){
        setmodalOpen2(false);
    }


    return (

        <>
            <NewNav />
            <div className={styles.container}>
                <img id={styles.crown} src={crown} alt="crown" />
                <img id={styles.tx} src={tx} alt="tx" />
                <span id={styles.name}>{candi_name}</span>
                <p id={styles.profile}>
                    {profile}
                </p>
                <img id={styles.profile_image} src={profile_image} alt="profile_image" />
                <p id={styles.nowrank}> 현재 순위: 1위 </p>
                {pollOpen === "true" && 
                <p id={styles.nowpoll}> <img id={styles.mark} src={mark} alt={mark}/>               
                현재 투표수: {voteCount}표 </p> }
                {pollOpen === "false" && 
                <p id={styles.nowpoll}> <img id={styles.mark} src={mark} alt={mark}/>               
                현재 투표수:???표 </p> }                        

                <Button id={styles.poll_button} onClick={handleOpen} variant="contained">투표하기</Button>
                <Modal open={modalOpen} onClose={handleClose}>
                    <div id={styles.poll_paper}>
                        <div id={styles.poll_paper2}>
                            <img onClick={handleClose} id={styles.x_button} src={x} alt="x" />
                             <p id={styles.poll_title}>{polltitle}</p>
                             <p id={styles.paper_image}>
                                <img id={styles.paper_image} src={profile_image} alt='profile'></img>
                                {candi_name}
                             </p>
                             <p id={styles.stamp_box} onClick={handlePicked}>
                                {picked? <img id={styles.stamp} src={mark} alt="mark2"/> : null}
                             </p>
                             <p id={styles.paper_button}>
                                <Button onClick={handlepoll} id={styles.paper_button2} variant="contained"> 투표하기</Button>
                             </p>
                             <p id={styles.stamp_box2}>
                                <img id={styles.stamp2} src={stamp} alt='stamp' />
                             </p>
                             <p id={styles.paper_text}>해당 투표는 하루에 한 번만 가능합니다. </p>
                             <p id={styles.paper_text2}>투표관리관 </p>
                             </div>
                    </div>
                </Modal>

                <Button id={styles.con_button} onClick={handleOpen2} variant="contained">투표내역</Button>
                <Modal open={modalOpen2} onClose={handleClose2}>
                    <div  id={styles.tran_box}>
                            거래내역
                    </div> 
                </Modal>



                <Button id={styles.back_button} onClick={gotoList} variant="contained">참가자 목록</Button>
                <div id={styles.photobox}>
                    {photo1? <img id={styles.photo1} 
                    onClick={changePhoto1}
                    src={photo1} alt="photo1" />: null }
                    {photo2? <img id={styles.photo2} 
                    onClick={changePhoto2}
                    src={photo2} alt="photo2" />: null }
                    {photo3? <img id={styles.photo3} 
                    onClick={changePhoto3}
                    src={photo3} alt="photo3" />: null }
                </div>

                <Comment candiId={params.id} data={commentdata} renderCheck={renderCheck}></Comment>
                <Button id={styles.list_button} onClick={gotoList} variant="contained">리스트로 돌아가기</Button>
            </div>

        </>
    );
}

export default Candidate;
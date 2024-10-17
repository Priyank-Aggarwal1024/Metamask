import { useNavigate } from 'react-router-dom';
import back from '../images/back.svg'
function BackHome() {
    const navigate = useNavigate();
    return (
        <>
            <div className="pl-4 text-start bg-[#000] w-full">
                <img src={back} alt="Back" onClick={() => navigate("/")} />
            </div>
        </>
    );
}

export default BackHome;
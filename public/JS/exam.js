alert("Exam Timer is set for 15 seconds only, so as User can see the auto-submission functionality!")

let total_seconds=15;
let c_min=parseInt(total_seconds/60);
let c_sec=parseInt(total_seconds%60);

function checkTime(){
    document.getElementById("timer").innerHTML='Time Left : <br/>'+c_min+' Minutes '+c_sec+' Seconds';

    if(total_seconds<=0){
        document.getElementById("quiz").click();
    }else{
        total_seconds--;
        c_min=parseInt(total_seconds/60);
        c_sec=parseInt(total_seconds%60);
        setTimeout("checkTime()",1000);
    }
}

setTimeout("checkTime()",100);
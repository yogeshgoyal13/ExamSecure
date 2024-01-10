let numberOfQuestions = 0;

document.querySelector(".addNewQuestion").addEventListener("click", function(){
    numberOfQuestions++;

    let question_div = document.createElement("div");
    question_div.classList.add('form-group');

    let questionId = "question" + numberOfQuestions;
    let option1Id = questionId + "_option1";
    let option2Id = questionId + "_option2";
    let option3Id = questionId + "_option3";
    let option4Id = questionId + "_option4";
    let correctAnswerId = questionId + "_ca";
    
    question_div.innerHTML = 
    "<label class='boldText' for='" + questionId + "'>Question " + numberOfQuestions +"</label><br>"
    +
    "<textarea name='" + questionId + "' id='" + questionId + "' cols='200' rows='3' class='greyArea' required placeholder='Enter Question Description'></textarea><br>"
    +
    "<label for='" + option1Id + "'>A</label><br>"
    +
    "<textarea name='" + option1Id + "' id='" + option1Id + "' cols='200' rows='2' required placeholder='Option A'></textarea><br>"
    +
    "<label for='" + option2Id + "'>B</label><br>"
    +
    "<textarea name='" + option2Id + "' id='" + option2Id + "' cols='200' rows='2' required placeholder='Option B'></textarea><br>"
    +
    "<label for='" + option3Id + "'>C</label><br>"
    +
    "<textarea name='" + option3Id + "' id='" + option3Id + "' cols='200' rows='2' required placeholder='Option C'></textarea><br>"
    +
    "<label for='" + option4Id + "'>D</label><br>"
    +
    "<textarea name='" + option4Id + "' id='" + option4Id + "' cols='200' rows='2' required placeholder='Option D'></textarea><br>"
    +
    "<label for='" + correctAnswerId + "'>Correct Option</label><br>"
    +
    "<input type='text' class='co' name='" + correctAnswerId + "' id='" + correctAnswerId + "' required placeholder='Correct Option in UpperCase e.g. A'>" + "<hr/>";

    document.querySelector(".examForm").insertBefore(question_div, document.querySelector(".storeExam"));
    // document.querySelector("body").appendChild(question_div);
});
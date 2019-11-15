/*****************************************************
 * @subpackage survey
 * @package friendfinder
 * 
 * ===============[ TABLE OF CONTENTS ]===============
 * 0. Globals
 * 1. Functions
 *   1.1 generateRandomNumber()
 *   1.2 shuffle_array()
 *   1.3 runEffect()
 *   1.4 AlertMessage()
 *  
 * 2. Query Data
 *   2.1 questionsQuery()
 * 
 * 3. Document Ready
 *****************************************************/
/* ===============[ 0. GLOBALS ]======================*/

/* ===============[ 1. FUNCTIONS ]====================*/
/**
 * 1.1 generateRandomNumber
 * @param {int} min 
 * @param {max} max 
 */
function generateRandomNumber(min = 0, max = 10) {
  return Math.floor(Math.random() * Math.floor(+max - +min)) + +min;
}

/**
 * 1.2 shuffle_array
 * @param {array} some_array
 * @return {array} some_array - returns the shuffled version. 
 */
function shuffle_array(some_array){
  return some_array.sort( () => Math.random() - 0.5);
}

/**
 * 1.3 runEffect
 * Runs an effect on the given element. 
 * NOTE: this function depends on the following script links,
 * <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
 * <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"></script>
 * 
 * @param {element} element 
 * @param {integer} duration_seconds 
 * @param {string}  selectedEffect 
 */
function runEffect(element, duration_seconds=2, selectedEffect="pulsate") {
  // Most effect types need no options passed by default
  var options = {};
  
  // some effects have required parameters
  if ( selectedEffect === "scale" ) {
    options = { percent: 50 };
  } else if ( selectedEffect === "transfer" ) {
    options = { to: "#button", className: "ui-effects-transfer" };
  } else if ( selectedEffect === "size" ) {
    options = { to: { width: 200, height: 60 } };
  }
  
  // Run the effect
  element.effect( selectedEffect, options, ( (duration_seconds * 1000)/4 ), setTimeout(function(){
    element.removeAttr( "style" ).hide().fadeIn();
  }, duration_seconds * 1000));
} // END runEffect()


/**
 * 1.4 AlertMessage()
 * @param {string} message - Message to go in the alert box
 * @param {string} addThisClass - defaults to empty string. Can be info, danger, or success. 
 */
function AlertMessage(message="", addThisClass="info"){
  var alertElement = $("<div>").addClass("col-12 alert").attr("id","alert_message");
  
  // RESET Alert Message
  if(message === ""){
    $("#main-section .first-row").empty();
    return;
    
  }else if (addThisClass === "info"){ 
    // Default alert
    addThisClass = "alert-info";
    
  }else if (addThisClass === "danger"){
    addThisClass = "alert-danger";
    
  }else if (addThisClass === "success"){
    addThisClass = "alert-success";
  }
  
  // IF same alert message keeps getting spammed then add ! and change color red
  if( $("#alert-messages").html() !== undefined && $("#alert-messages").html() === message ){
    message += "!";
    addThisClass = "alert-danger";
  }
  
  // Add the new class
  alertElement.addClass(addThisClass);
  
  // Display the alert message
  alertElement.html(message);
  $("#main-section .first-row").html(alertElement);
  return;
} // END gameAlert()

/* ===============[ 2. Query Data ]====================*/
/**
 * 2.1 questionsQuery()
 */
function questionsQuery(){
  $.ajax({ url: "/api/questions", method: "GET" })
    .then(function(questionsData) {
      console.log(questionsData);

      for (var i=0; i < questionsData.length; i++ ){
        var question = $("<li>").text(questionsData[i].question).addClass("list-group-item question");
        
        var hearts_rating = $("<div>").addClass("hearts");
        hearts_rating.starrr();

        hearts_rating = $("<li>").addClass("list-group-item answer_block").html(hearts_rating);

        var questionNumber =  (i+1);
        var q_counter = $("<h3>").text("Question " + questionNumber + " of " + questionsData.length);
        q_counter = $("<li>").addClass("list-group-item question_counter").attr("data-start",i).attr("data-end",(questionsData.length-1)).html(q_counter);
        //q_counter = (questionsData[i].subtopic !== "") ? q_counter.append($("<small>").text("Topics: " + questionsData[i].topic + ", " + questionsData[i].subtopic)) : q_counter.append($("<small>").text("Topic: " + questionsData[i].topic));

        question = $("<ul>").addClass("list-group text-left").append(question);
        question.prepend(q_counter);
        question.append(hearts_rating);

        $(".question_answers").append(question);
      }

    });
};


/**===============[ 3. Document Ready ]==================== 
 * NOTE: $(function(){ === $(document).ready(function() {
 * it's the shorthand version of document ready. 
 *********************************************************/
$(function(){
  questionsQuery();
  $(document).tooltip();
}); // END $(document).ready(function() { 
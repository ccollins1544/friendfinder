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
function AlertMessage(message="", addThisClass="info", appendAfterElement){
  $('#alert_message').remove();

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

  if(appendAfterElement === undefined){
    appendAfterElement = $("#main-section");
  }

  appendAfterElement.append(alertElement);
  return;
} // END gameAlert()

/* ===============[ 2. Query Data ]====================*/
/**
 * 2.1 questionsQuery()
 */
function questionsQuery(){
  $.ajax({ url: "/api/questions", method: "GET" })
    .then(function(questionsData) {

      var AllQuestionsBlock = $("<ol>").addClass("list-group text-left");
      for (var i=0; i < questionsData.length; i++ ){
        var question = $("<li>")
          .addClass("list-group-item question")
          .attr("data-start",i).attr("data-end",(questionsData.length-1))
          .text(questionsData[i].question);

        var questionNumber = $("<span>")
          .addClass("font-weight-bold")
          .text(i+1 + ". ");

        question.prepend(questionNumber);
        
        var hearts_rating = $("<div>")
          .addClass("hearts")
          .attr("data-question-number",i+1);
        hearts_rating.starrr();

        var AnswerBlock = $("<div>")
          .addClass("list-group-item answer_block")
          .html(hearts_rating);

        var hiddenInput = $("<input>")
          .attr("type","hidden").attr("id","question_" + (i+1)).attr("name","question_" + (i+1))
          .val(0);
        
        question.append(AnswerBlock);
        question.append(hiddenInput);

        AllQuestionsBlock.append(question);
      }

      var checkIcon = $("<i>").addClass("fas fa-check");
      var submit_button = $("<button>")
        .attr("type","submit")
        .addClass("btn btn-primary")
        .html("Submit ")
        .append(checkIcon);

      $(".question_answers").append(AllQuestionsBlock, submit_button);
    });
};


/**===============[ 3. Document Ready ]==================== 
 * NOTE: $(function(){ === $(document).ready(function() {
 * it's the shorthand version of document ready. 
 *********************************************************/
$(function(){
  questionsQuery();
  $(document).tooltip();
  $('#MatchModal').modal({ show: false});

  $('.question_answers').on('starrr:change', '.hearts', function(e, heart_rating){
    e.preventDefault();
    var question_number = $(this).data('question-number');
    var form_input = $("#question_" + question_number);
    form_input.val(heart_rating);
  });

  // Change Info Button
  $('#change_info').on('click', function(event){
    event.preventDefault();
    $('#friend_form > span').hide();
    $('#friend_form > h2.accent_text').hide();

    $('#friend_form > label').show();
    $('#friend_form > input').show();
    $('#update_info').show();

    $("#friend_form").data("ready","0"); // not ready 
    $(this).hide();
  });

  // Friend Form
  $('#friend_form').on('submit', function(event){
    event.preventDefault();

    var isValid = true;
    var formArray = $('#friend_form').serializeArray();
    var formData = {};

    for (var i in formArray) {
      var KEY = "";
      var VALUE = "";
  
      for (var key in formArray[i]) {
        // console.log(key+" => "+formArray[i][key]);
  
        if (key == "name") {
          KEY = formArray[i][key];
  
        } else if (key == "value") {
          VALUE = formArray[i][key];
        }
  
      }

      formData[KEY] = VALUE.trim();

      // prevent empty entries into database
      if (formData[KEY] === "" || formData[KEY] === "0") {
        isValid = false;
      }
    }

    $("#friend_name").text(formData['friend_name']);
    $("#friend_image").attr("alt",formData['friend_name']);
    $("#friend_image").attr("src",formData['friend_image']);

    $('#friend_form > span').show();
    $('#friend_form > h2.accent_text').show();
    $('#change_info').show();

    $('#friend_form > label').hide();
    $('#friend_form > input').hide();
    $('#update_info').hide();

    if(isValid){
      $('#friend_form').data("ready","1"); // ready
      $('#alert_message').remove();
    }else{
      $('#friend_form').data("ready","0"); // not ready
      AlertMessage("You're missing something. Please double check that you have a valid URL and your name above", "danger", $("#friend_form"));
    }

    console.log(isValid);
    console.log(formData);
  });

  // Compatibility Form
  $('#compatibility_form').on('submit', function(event){
    event.preventDefault();

    var unansweredQuestion = 0;
    var formArray = $('#compatibility_form').serializeArray();
    var formData = {}; 

    for (var i in formArray) {
      var KEY = "";
      var VALUE = "";
  
      for (var key in formArray[i]) {
        // console.log(key+" => "+formArray[i][key]);
  
        if (key == "name") {
          KEY = formArray[i][key];
  
        } else if (key == "value") {
          VALUE = formArray[i][key];
        }
  
      }

      formData[KEY] = VALUE.trim();

      // prevent empty entries into database
      if ((formData[KEY] === "" || formData[KEY] === "0") && unansweredQuestion == 0 ) {
        unansweredQuestion = (+i + +1);
      }
    }

    console.log(unansweredQuestion);
    console.log(formData);
    
    if( $('#friend_form').data("ready") == 0 ){ // not ready 
      AlertMessage("You're missing something. Please double check that you have a valid URL and your name above", "danger", $("#compatibility_form"));
      return; 

    } else if(unansweredQuestion != 0 ){ // Missed a question
      AlertMessage("You're missing question " + unansweredQuestion, "danger", $("#compatibility_form"));
      return; 

    } else { // ready!
      $('#alert_message').remove();
    }

    $('#MatchModal').modal('show');
  });


}); // END $(document).ready(function() { 
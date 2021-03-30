(function() {
    var questions = [{
      type: "input",
      question: "How old are you?",
    }, {
      type: "radio",
      question: "What’s your current employment status?",
      choices: ["   Employed at a company", "   Self-employed", "   Business owner"],
    }, {
      type: "radio",
      question: "How many employees does your business have?",
      choices: ["   None/a few",  "   ~10-25", "   ~30-50", "   50+"],
    }, {
      type: "radio",
      question: "How long have you been in this position?",
      choices: ["   Recently began (<1 year)", "   1-3 years", "   3-9 years", "   10+ years"]
    }, {
      type: "input",
      question: "What is your modified adjusted gross income? (pre-tax income)",
    }, {
      type: "radio",
      question: "What is your current retirement plan?",
      choices: ["   401(k)", "   Traditional IRA", "   Roth IRA", "   SIMPLE IRA", "   SEP(SEP-IRA)", "   Other", "   I don’t currently have a retirement plan"],
    }, {
      type: "radio",
      question: "Does your employer offer a company match on your 401(k)?",
      choices: ["   Yes", "   No"],
    }, {
      type: "radio",
      question: "Do you think your tax rate will be higher or lower when you retire?",
      choices: ["   Higher", "   Lower", "   I don’t know"],
    }
  ];
    
    var questionCounter = 0; //Tracks question number
    var selections = []; //Array containing user choices
    var quiz = $('#quiz'); //Quiz div object
    
    // Display initial question
    displayNext();

    // Click handler for the 'next' button
    $('#next').on('click', function (e) {
      e.preventDefault();
      
      // Suspend click listener during fade animation
      if(quiz.is(':animated')) {        
        return false;
      }
      choose();
      if ((questionCounter === 5 && selections[5] !== 0) || (questionCounter === 1 && selections[1] !== 2)) {
        questionCounter++;
      }
      questionCounter++;
      displayNext();
    });
    
    // Click handler for the 'prev' button
    $('#prev').on('click', function (e) {
      e.preventDefault();
      
      if(quiz.is(':animated')) {
        return false;
      }
      choose();
      questionCounter--;
      displayNext();
    });
    
    // Click handler for the 'Start Over' button
    $('#start').on('click', function (e) {
      e.preventDefault();
      
      if(quiz.is(':animated')) {
        return false;
      }
      questionCounter = 0;
      selections = [];
      displayNext();
    });
    
    // Animates buttons on hover
    $('.button').on('mouseenter', function () {
      $(this).addClass('active');
    });
    $('.button').on('mouseleave', function () {
      $(this).removeClass('active');
    });
    
    // Creates and returns the div that contains the questions and 
    // the answer selections
    function createQuestionElement(index) {
      var qElement = $('<div>', {
        id: 'question'
      });
      
      var header = $('<h2>Question ' + (index + 1) + ':</h2>');
      qElement.append(header);
      
      var question = $('<p>').append(questions[index].question);
      qElement.append(question);
      
      if (questions[index].type === 'radio') {
        var radioButtons = createRadios(index);
        qElement.append(radioButtons);
      } else {
        var inputField = $('<input type="text" id="text" size="20">');
        qElement.append(inputField);
      }
      return qElement;
    }
    
    // Creates a list of the answer choices as radio inputs
    function createRadios(index) {
      var radioList = $('<ul>');
      var input = '';
      for (var i = 0; i < questions[index].choices.length; i++) {
        input = '<input type="radio" name="answer" value=' + i + ' />';
        input += questions[index].choices[i] + "<br/>";
        radioList.append(input);
      }
      return radioList;
    }
    
    // Reads the user selection and pushes the value to an array
    function choose() {
      if (questions[questionCounter].type === 'input') {
        selections[questionCounter] = +document.getElementById("text").value;
      } else {
        selections[questionCounter] = +$("input[name='answer']:checked").val();
      }
      console.log(selections[questionCounter]);
    }
    
    // Displays next requested element
    function displayNext() {
      quiz.fadeOut(function() {
        $('#question').remove();
        if(questionCounter < questions.length){
          var nextQuestion = createQuestionElement(questionCounter);
          quiz.append(nextQuestion).fadeIn();
          if (!(isNaN(selections[questionCounter]))) {
            $('input[value='+selections[questionCounter]+']').prop('checked', true);
          }
          if(questionCounter === 1){
            $('#prev').show();
            $('#talk').hide();
          } else if(questionCounter === 0){
            $('#prev').hide();
            $('#next').show();
            $('#talk').hide();
          }
        } else {
          var scoreElem = displayScore();
          quiz.append(scoreElem).fadeIn();
          $('#next').hide();
          $('#prev').hide();
          $('#start').show();
          $('#talk').show();
        }
      });
    }
    
    // Computes score and returns a paragraph element to be displayed
    function displayScore() {
      var score = $('<div id="question">');
      
      if (selections[1] === 2) {
        if (selections[2] === 0){
          score.append('<p style="font-size:20px"><b>Suggestion:</b></p> <p style="font-size:16px">For your small business, you should set up a <b>SEP IRA</b> for you and your employees.</p>'
          + '<p style="font-size:20px"><b>Benefits</b>:</p>' 
          + '<ul style="font-size:16px"><li>A SEP IRA is easy to set up and manage, and doesn’t require too much paperwork with the IRS.</li>'
          + '<li>It offers you a much higher annual contribution limit than a traditional IRA (almost 10 times as much!) and contributions are also tax-deductible for you AND your employees.</li>'
          + '<li>Business isn’t doing so well? Have no fear, a SEP IRA doesn’t require you to contribute every year.</li></ul>');
        } else if (selections[2] === 2){
          score.append('<p style="font-size:20px"><b>Suggestion</b>:</p> <p style="font-size:16px">For your business, you should set up a <b>SIMPLE IRA</b> for you and your employees. For yourself, consider contributing to your own <b>Roth IRA</b>.</p>'
          + '<p style="font-size:20px"><b>Benefits</b>:</p>' 
          + '<ul style="font-size:16px"><li>A SIMPLE IRA is easy to set up and manage, and allows employees to own their own accounts.</li>'
          + '<li>As compared to your current SEP IRA, a SIMPLE IRA takes the burden of contribution off of you, allowing employees to contribute a portion of their salary to their accounts.</li>'
          + '<li>Your current contributions to a SIMPLE IRA are tax-deductible!</li>'
          + '<li>Based on your income and its projected growth, you should save your money in a Roth IRA to take advantage of your relatively lower tax rate now, before you go up a tax bracket. This way, when you retire, only the portion of money in your SIMPLE IRA will be taxed.</li></ul>');
        } 
      } else if (selections[1] === 0){
        score.append('<p style="font-size:20px"><b>Suggestion</b>:</p> <p style="font-size:16px">You should contribute to both your company-sponsored <b>401(k)</b> and your own <b>Roth IRA</b>.</p>'
        + '<p style="font-size:20px"><b>Benefits</b>:</p>' 
        + '<ul style="font-size:16px"><li>Your employer offers a company match on your 401(k), so take advantage of the free money! Contribute enough money to the account to get the maximum match.</li>'
        + '<li>When you contribute to a Roth IRA now, you will still pay taxes on that money...but when you take it out during retirement in the future, your withdrawals will be tax-free!</li>'
        + '<li>As a young employee whose salary still has room to grow, take advantage of your lower tax rate now with a Roth IRA so you can avoid paying higher taxes when you withdraw your money later on.</li></ul>');
      } else {
        score.append('</p>');
      }
      score.append('</div>');
      return score;
    }
  })();
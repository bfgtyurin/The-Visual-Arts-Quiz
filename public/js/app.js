'use strict';

$(document).ready(function() {

  var App = {

    init: function() {
      this.imageApiPath = '/images-api/';
      this.fetchImages(function(data) {
        this.images = data;
        this.quizTitle.append(' (' + this.images.length + ')');
      }.bind(this));

      this.userInput = 0;
      this.cacheElements();
      this.bindEvents();
    },
    fetchImages: function(done) {
      $.get(this.imageApiPath, function(data) {
        done(data);
      });
    },
    cacheElements: function() {
      this.quizImage = $('.quiz-image');
      this.buttonPrev = $('.button-prev');
      this.buttonNext = $('.button-next');
      this.answerField = $('.answer-field');
      this.buttonShow = $('.show-button');
      this.buttonNo = $('.no-button');
      this.buttonYes = $('.yes-button');
      this.buttonStart = $('.button-start');
      this.progressDiv = $('.progress');
      this.progressBar = $('.progress-bar');
      this.quizTitle = $('.quiz-title');
      this.quizSelect = $('.quiz-select');
    },
    bindEvents: function() {
      this.buttonStart.on('click', this.initQuiz.bind(this));
      this.buttonYes.on('click', this.showQuestion.bind(this, true));
      this.buttonNo.on('click', this.showQuestion.bind(this, false));
      this.buttonShow.on('click', this.showAnswer.bind(this));
    },

    // was return by View

    createGallery: function(i) {
      var current = 0;
      var limit = i;

      return {
        getPrevious: function() {
          if (current === 0) {
            return current;
          } else {
            current--;
            updateProgressBar(current);
            return current;
          }
        },
        getNext: function() {
          return ++current;
        }
      }
    },

    initQuiz: function() {
      this.setQuizSize();
      this.setInitialValues();
      this.updateMainView(0);
      this.prepareContent();
    },
    setQuizSize: function() {
      var size = +this.quizSelect.val();
      this.size = size ? size : this.images.length;
    },
    setInitialValues: function() {
      this.userInput = 0;
      this.gallery = this.createGallery(this.size);
      this.images = this.shuffle(this.images);
    },

    showQuestion: function(answer) {
      this.disableAnswerContent();
      if (answer) this.userInput++;
      var index = this.gallery.getNext();
      if (index !== this.size) {
        this.updateMainView(index);
      } else {
        this.createResultsView();
      }
    },

    showAnswer: function() {
      this.enableAnswerContent();
    },

    // was inside View

    getImage: function(index) {
        return this.images[index];
    },

    updateMainView: function(index) {
      var image = this.images[index];
      var imgHref = image.href;
      var imgText = image.text;

      this.renderMainView(imgHref, imgText);
      this.updateProgressBar(index);
    },

    renderMainView: function(imgHref, imgText) {
      this.quizImage.attr('src', imgHref);
      this.answerField.text(imgText);
    },

    updateProgressBar: function(index) {
      var percent = this.calculatePercent(index, this.size - 1);
      this.renderProgressBar(percent);
    },

    calculatePercent: function(a, b) {
      return Math.floor((a / b) * 100);
    },

    renderProgressBar: function(percent) {
      this.progressBar.attr('style', 'width: ' + percent + '%');
      this.progressBar.text(percent + ' %');
    },

    createResultsView: function() {
      this.renderResults();
      this.initElements();
    },

    renderResults: function() {
      this.answerField.text('You are right ' + this.userInput + ' times out of  ' + this.size);
    },

    // was inside View

    initElements: function() {
      this.answerField.removeClass('invisible');
      this.quizImage.addClass('invisible');
      this.buttonStart.removeClass('hidden');
      this.buttonShow.addClass('hidden');
      this.buttonNo.addClass('hidden');
      this.buttonYes.addClass('hidden');
      this.progressDiv.addClass('invisible');
      this.quizSelect.removeClass('invisible');
    },

    prepareContent: function() {
      this.answerField.addClass('invisible');
      this.quizImage.removeClass('invisible');
      this.buttonStart.addClass('hidden');
      this.progressDiv.removeClass('invisible');
      this.quizSelect.addClass('invisible');
      this.buttonShow.removeClass('hidden');
    },

    enableAnswerContent: function() {
      this.answerField.removeClass('invisible');
      this.buttonNo.removeClass('hidden');
      this.buttonYes.removeClass('hidden');
      this.buttonShow.addClass('hidden');
    },

    disableAnswerContent: function() {
      this.answerField.addClass('invisible');
      this.buttonNo.addClass('hidden');
      this.buttonYes.addClass('hidden');
      this.buttonShow.removeClass('hidden');
    },

    shuffle: function(array) {
      var currentIndex = array.length;
      var randomIndex;
      var tempValue;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        tempValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = tempValue;
      }

      return array;
    }
  };

  App.init();

});

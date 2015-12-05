'use strict';

$(document).ready(function() {

  var App = {

    init: function() {
      this.imageApiPath = '/images-api/';
      this.fetchImages(function(data) {
        this.fetchedData = data;
        this.quizTitle.append(' (' + this.fetchedData.length + ')');
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
      this.buttonShow = $('.show-button');
      this.buttonNo = $('.no-button');
      this.buttonYes = $('.yes-button');
      this.buttonStart = $('.button-start');
      this.progressDiv = $('.mdl-progress');
      this.progressBar = $('.mdl-js-progress');
      this.quizTitle = $('.quiz-title');
      this.quizSelect = $('.quiz-select');
      this.carousel = $('.carousel');
      this.$list = $('.carousel ul');
      this.progressBarPercent = 0;
    },
    bindEvents: function() {
      this.buttonStart.on('click', this.initQuiz.bind(this));
      this.buttonYes.on('click', this.showQuestion.bind(this, true));
      this.buttonNo.on('click', this.showQuestion.bind(this, false));
      this.buttonShow.on('click', this.showAnswer.bind(this));
      this.progressBar.on('progressbar-updated', this.renderProgressBar);
    },

    // was return by View

    createGallery: function(i) {
      var current = 0;
      var limit = i;

      return {
        getPrevious: function() {
          if (!current) {
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

      this.initCarousel();

      this.updateMainView(0);

      this.prepareContent();
    },
    setQuizSize: function() {
      var size = +this.quizSelect.val();
      this.size = size ? size : this.fetchedData.length;

    },
    setInitialValues: function() {
      this.userInput = 0;
      this.gallery = this.createGallery(this.size);
      this.fetchedData = this.shuffle(this.fetchedData);
      this.images = this.fetchedData.slice(0, this.size);
    },

    initCarousel: function() {
          var $list = this.$list.detach();
          $list.empty();

          this.images.forEach(function(image) {
            var li = this.createListElementWithImage(image);
            $list.append(li);
          }, this);

          $list.appendTo(this.carousel);
    },

    createListElementWithImage: function(image) {
      var li = $('<li>').attr('class', 'hidden');
      var mdl_card = $('<div>').attr('class', 'mdl-card mdl-shadow--2dp centered');
      var mdl_card_title = $('<div>').attr('class', 'mdl-card__title');
      var titleText = $('<p>').text(image.text).attr('class', 'answer-field invisible');
      var figure = $('<figure>').attr('class', 'mdl-card__media');
      var img = $('<img>').attr('src', image.href);

      li.append(mdl_card);
      mdl_card.append(mdl_card_title);
      mdl_card_title.append(titleText);
      mdl_card.append(figure);
      figure.append(img);

      return li;
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
      this.changeImage(index);
      this.updateProgressBar(index);
    },

    changeImage: function(index) {
      if (!index) {
        this.carousel.find('li.hidden').eq(index).removeClass('hidden');
      } else {
        this.carousel.find('li').eq(index - 1).addClass('hidden');
        this.carousel.find('li').eq(index).removeClass('hidden');
      }
    },

    updateProgressBar: function(index) {
      var percent = this.calculatePercent(index, this.size - 1);
      this.progressBarPercent = percent;
      this.progressBar.trigger('progressbar-updated');
    },

    calculatePercent: function(a, b) {
      return Math.floor((a / b) * 100);
    },

    renderProgressBar: function() {
      this.MaterialProgress.setProgress(App.progressBarPercent);
    },

    createResultsView: function() {
      this.renderResults();
      this.initElements();
    },

    renderResults: function() {
      this.$list.find('.answer-field').text('You are right ' + this.userInput + ' times out of  ' + this.size);
    },

    // was inside View

    initElements: function() {
      this.$list.find('.answer-field').removeClass('invisible');
      this.quizImage.addClass('invisible');
      this.buttonStart.removeClass('hidden');
      this.buttonShow.addClass('hidden');
      this.buttonNo.addClass('hidden');
      this.buttonYes.addClass('hidden');
      this.progressDiv.addClass('invisible');
      this.quizSelect.removeClass('invisible');
    },

    prepareContent: function() {
      this.$list.find('.answer-field').addClass('invisible');
      this.buttonStart.addClass('hidden');
      this.progressDiv.removeClass('invisible');
      this.quizSelect.addClass('invisible');
      this.buttonShow.removeClass('hidden');
    },

    enableAnswerContent: function() {
      this.$list.find('.answer-field').removeClass('invisible');
      this.buttonNo.removeClass('hidden');
      this.buttonYes.removeClass('hidden');
      this.buttonShow.addClass('hidden');
    },

    disableAnswerContent: function() {
      this.$list.find('.answer-field').addClass('invisible');
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

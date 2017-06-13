// ==UserScript==
// @name         Youtrack clean detailed expanded list
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://*.myjetbrains.com/youtrack/issues*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  var styles = " \
  .clean-detailed-expanded-list .issueContainer .description {\
    white-space: pre-wrap;\
  }\
  "

  var $searchInput = $('.searchQueryText')
  var $projectSelect = $('.selectProject input')

  $('<style>').appendTo('head').html(styles)

  // $('.jt-menu').append('<li class="expanded-detailLevelLink"><a href="javascript:void(0)">Expanded view</a></li>')
  //
  var $button = $("<button  id=\"expanded-detailLevelLink\" class=\"jt-button ring-btn  btn_wide\">\n" +
    "<span class=\"sb-toolbar-ico custom-full font-icon icon-full\"></span>\n" +
    "</button>")

  $('.issues-toolbar_r .ring-btn-group').first().append($button)


  $('#expanded-detailLevelLink').click(function (e) {
    getList(function () {
      $('body').addClass('clean-detailed-expanded-list')
    })
  })

  function getList (callback) {

    var currentProject = $projectSelect.val().match(/\((.*)\)$/)[1]

    var filter = $searchInput.val() || '#' + currentProject + ' order by: updated'
    var after = 0
    var parameters = document.location.search.match(/p=(\d+)/)
    if (parameters && parameters[1]) {
      after = parameters[1]
    }

    $.ajax({
      dataType: 'json',
      type: 'get',
      url: document.location.origin + '/youtrack/rest/issue',
      data: {
        filter: filter,
        max: 100,
        after: after
      },
      success: function (data) {
        var issues = data.issue

        var $issues = $('.issueContainer')

        issues.forEach(function (issue) {
          var $issue = $issues.filter('[iid="' + issue.entityId + '"]')
          if (!$issue.length) { return }


          var description = issue.field.filter(function (field) {
            return field.name === 'description'
          })[0]

          if (!description) { return }

          $issue.find('.description').html(description.value)
        })

        callback()
      }


    })
  }



  window.getList = getList;


})();

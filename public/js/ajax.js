$(document).ready(function() {
  $('.delete-button').on('click', function(e){
    e.preventDefault();

    var deleteButton = $(this);
    var deleteId = deleteButton.attr('id');

    $.ajax({
      method: 'DELETE',
      url: '/profile/game/' + deleteId
    }).done(function(data){
      window.location = "/profile";
    });
  });

  $('.update-button').on('submit', function(e){
    e.preventDefault();

    var updateButton = $(this);
    var updateId = updateButton.attr('id');
    var updateData = updateButton.serialize();

    $.ajax({
      method: 'PUT',
      url: 'profile/game' + updateId,
      data: updateData //pass in data from post here
    }).done(function(data){
      window.location = "/profile";
    });
  });
});

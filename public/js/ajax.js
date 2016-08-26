$(document).ready(function() {
  $('.delete-button').on('click', function(e){
    e.preventDefault();

    var deleteButton = $(this);
    var deleteId = deleteButton.attr('id');

    $.ajax({
      method: 'DELETE',
      url: '/profile/game/' + deleteId
    }).done(function(data){
      window.location = "/profile/" + data.id;
    });
  });

  $('.update-button').on('click', function(e){
    e.preventDefault();
    var updateButton = $(this);
    var updateId = updateButton.attr('id');
    var input = $(this).siblings();
    console.log(input);
    var inputData = input[0].value;
    var dataObj = {
      review: inputData
    };
    console.log(inputData);
    $.ajax({
      method: 'PUT',
      url: '/profile/game/' + updateId,
      data: dataObj //pass in data from post here
    }).done(function(data){
      window.location = "/profile/" + data.id;
    });
  });
});

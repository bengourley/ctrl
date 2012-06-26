$(function($) {

  var $titleControl = $('input[name=title]')
    , $slugControl = $('input[name=slug]')
    , $bodyControl = $('textarea[name=body]')
    , $typeControl = $('select[name=type]')
    ;

  function toUrl(value) {
    return value
      .toLowerCase()
      .replace(/[\[\]\.',{}!@£$%\^&*()_=+~`;:\|<>?\/"]/g, '')
      .replace(/(\-+|\s+)/g, '-');
  }

  function onTitleBlur(event) {
    $slugControl.val(toUrl($titleControl.val()));
  }

  $titleControl.blur(onTitleBlur);

  switch ($typeControl.val()) {
    case 'Markdown':
      break;
    case 'HTML':
      $bodyControl.redactor({
        path: '/js/redactor'
      });
      break;
  }

  $typeControl.on('change', function() {
    var body = $bodyControl.val();

    switch ($(this).val()) {
      case 'Markdown':
        window.confirmDialog({
          message: 'Switching to Markdown will make the field plain ' +
                   'text. Do you want to remove the HTML formatting?',
          confirm: function () {
            $bodyControl.destroyEditor();
            $bodyControl.val($('<div>').html(body).text());
          },
          deny: function () {
            $bodyControl.destroyEditor();
          },
          confirmVerb: 'Remove HTML tags',
          denyVerb: 'Keep HTML tags'
        });
        break;
      case 'HTML':
        $bodyControl.redactor({
          path: '/js/redactor'
        });
        break;
    }
  });
});
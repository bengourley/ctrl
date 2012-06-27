module('assetItemModel', function (module) {

  function assetItemModel(data) {

    var model = {
      data: data,
      preview: 'http://dummyimage.com/100'
    };

    if ((/^image\//).test(data.type)) {
      model.preview = '/asset/' + data._id;
    }

    model.del = function (success, error) {
      $.ajax({
        type: 'DELETE',
        url: '/admin/asset/api/' + data._id,
        dataType: 'json',
        success: success,
        error: error
      });
    };

    model.save = function (success, error) {

      $.ajax({
        type: 'PUT',
        url: '/admin/asset/api/' + data._id,
        dataType: 'json',
        data: model.data,
        success: success,
        error: error
      });
    };

    return model;

  }

  module.exports = assetItemModel;

});
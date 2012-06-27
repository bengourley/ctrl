module('assetListView', function (module) {

  var assetItemTemplate = $('#asset-list-item-template').html()
    , assetItemModel = require('assetItemModel');

  var assetListView = function (el, notify) {

    var assets = {};

    function renderAsset(model) {

      var asset = $(_.template(assetItemTemplate, model.data));

      asset.find('button.delete').on('click', function (e) {

        function makeDeleteRequest() {
          model.del(function (data) {
            if (data.success) {
              notify('item(s) deleted successfully');
              asset.remove();
            } else {
              notify('item delete(s) failed');
            }
          }, function () {
            notify('item delete(s) failed');
          });
        }

        window.confirmDialog({
          message: 'Are you sure you want to delete this asset? Any ' +
                    'links to it will break.',
          confirm: makeDeleteRequest,
          confirmVerb: 'Delete asset',
          denyVerb: 'Don\'t delete',
          danger: true
        });

      });

      asset.find('.editable').each(function () {

        var field = $(this)
          , input = $('<input/>').hide()
          , data = field.find('.data')
          , placeholder = $('<span/>').hide();

        field
          .append(input)
          .append(placeholder);

        field.on('edit', function () {
          data.hide();
          input.val(data.text());
          input.show();
          input.focus();
          placeholder.hide();

          function blur() {
            field.trigger('cancel');
            input.off('blur', blur);
            input.off('keyup', keyup);
          }

          function keyup(e) {
            if (e.keyCode === 13) {
              field.trigger('save');
              input.off('blur', blur);
              input.off('keyup', keyup);
            } else if (e.keyCode === 27) {
              field.trigger('cancel');
              input.off('blur', blur);
              input.off('keyup', keyup);
            }
          }

          input.on('blur', blur);
          input.on('keyup', keyup);

        });

        field.on('save', function () {
          data.text(input.val());
          data.show();
          input.hide();
          if (data.text() === '') {
            placeholder
              .text('Click to add a ' + field.attr('data-field-name'))
              .show();
          } else {
            model.data[field.attr('data-field-name')] = data.text();
            model.save(function (data) {
              if (data.success) {
                notify('item(s) updated successfully');
              } else {
                notify('item update(s) failed');
              }
            }, function () {
              notify('item update(s) failed');
            });
          }
        });

        field.on('cancel', function () {
          data.show();
          input.hide();
          if (data.text() === '') {
            placeholder
              .text('Click to add a ' + field.attr('data-field-name'))
              .show();
          }
        });

        field.bind('click', function () {
          field.trigger('edit');
        });

        field.trigger('cancel');

      });

      return asset;

    }

    assets.init = function() {

      function populate(data) {
        $.each(data, function () {
          var model = assetItemModel(this);
          el.append(renderAsset(model));
        });
      }

      $.ajax({
        url: '/admin/asset/api/list',
        dataType: 'json',
        success: populate
      });

    };

    assets.add = function (a) {
      el.prepend(renderAsset(assetItemModel(a)));
    };

    return assets;

  }

  module.exports = assetListView;

});
var httpErrorHandler = require('../../lib/httpErrorHandler');

function createRoutes(app, properties, serviceLocator, viewPath) {

  var assetModel = serviceLocator.assetModel;

  app.get('/asset/:id', function (req, res, next) {

    assetModel.read(req.params.id, function (err, result) {

      if (err) {
        next(err);
      } else if (!result) {
        next(new httpErrorHandler.NotFound());
      } else {
        serviceLocator.uploadDelegate.get(result, function(err, data) {
          if (err) {
            next(err);
          } else {
            res.header('Content-Type', result.type);
            res.end(data);
          }
        });
      }

    });

  });

}

module.exports.createRoutes = createRoutes;
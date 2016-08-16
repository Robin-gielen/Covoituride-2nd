var temp = req.body.searchMethod;
if (temp == 'username') {
  utilisateur.find({ username: new RegExp(req.body.searchTerm, "i")}, function(err, foundRiders) {
    if (err) {
      res.render('searchRiders.pug', {error: 'No riders found - Please try again a bit later'});
    }
    else if(foundRiders[0] == undefined) {
      res.render('searchRiders.pug', {error: 'No riders found with this information'})
    }
    else {
      res.render('foundRiders.pug', {riders: foundRiders})
    }
  });
}
else if (temp == 'firstName') {
  utilisateur.find({ firstName: new RegExp(req.body.searchTerm, "i")}, function(err, foundRiders) {
    if (err) {
      res.render('searchRiders.pug', {error: 'No riders found - Please try again a bit later'});
    }
    else if(foundRiders[0] == undefined) {
      res.render('searchRiders.pug', {error: 'No riders found with this information'})
    }
    else {
      res.render('foundRiders.pug', {riders: foundRiders})
    }
  });
}
else if (temp == 'lastName') {
  utilisateur.find({ lastName: new RegExp(req.body.searchTerm, "i")}, function(err, foundRiders) {
    if (err) {
      res.render('searchRiders.pug', {error: 'No riders found - Please try again a bit later'});
    }
    else if(foundRiders[0] == undefined) {
      res.render('searchRiders.pug', {error: 'No riders found with this information'})
    }
    else {
      res.render('foundRiders.pug', {riders: foundRiders})
    }
  });
}
else {
  res.render('searchRiders.pug', {error: 'No riders found for those infos'})
}

const fs = require('fs');

fs.readFile('SalesTaxJson.json', (err, data) => {
  if (err) throw err;
  let rows = JSON.parse(data);

  var result = rows.reduce(function(map, obj) {
    if (!map[obj.Zip5]) {
      map[obj.Zip5] = { id: obj.Zip5, lowest: obj.CombinedTax };

    }
    map[obj.Zip5][obj.Zip4] = obj.CombinedTax;

    if (map[obj.Zip5].lowest < obj.CombinedTax) {
      map[obj.Zip5].lowest = obj.CombinedTax;
    }

    return map;
  }, {});



  fs.writeFile('salesTaxLookup.json', JSON.stringify(result), function writeJSON(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('done!');
    }
  });
});

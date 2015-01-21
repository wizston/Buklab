app.factory('bookFactory', ['$firebase', 'FIREBASE_URI', 'FIREBASE_URI_CLIENTS', function ($firebase, FIREBASE_URI, FIREBASE_URI_CLIENTS) {
    var ref = new Firebase(FIREBASE_URI);
    var client_ref = new Firebase(FIREBASE_URI_CLIENTS);
    var sync = $firebase(ref);
    var sync_client = $firebase(client_ref);
    // download the data into a (psuedo read-only), sorted array
    // all server changes are applied in realtime
    var books = sync.$asArray();

    var sync_clientt = sync_client.$asArray();

    var getAllBooks = function () {
            return books;
    };

    var getTotalCategory = function (cat) {
        var count = 0;
        var allBooks = books;
        jQuery.each(allBooks, function (Category, CategoryData) {
            if (CategoryData.Category == cat) {
                count++;
            }
        });
        return count;
    }
    var addNew = function (item,item2) {

        var myUser = client_ref.child(escapeIpAddress(item2));
        myUser.set(item);

    };
    var setRating = function (NewRate, nodeName) {

        var newRating = ref.child(nodeName);
        newRating.update({ "Rating": NewRate });


    };
    var getBookRatings = function () {
        return sync_clientt;
    };

    var getRate = function (ids) {

        var rate = 0;
        client_ref.child(ids).child("rating").on("value", function (userRate) {
            rate = userRate.val();
            if(rate == 0 || rate == null)
            {
                rate = 0;
            }
            
        });
        return rate;
    }
        



    function escapeIpAddress(ip) {
        if (!ip) return false

        ip = ip.toLowerCase();
        ip = ip.replace(/\./g, ',');
        return ip;
    }
    return {
        getAllBooks: getAllBooks,
        addNew: addNew,
        getBookRatings: getBookRatings,
        getRate: getRate,
        escapeIpAddress: escapeIpAddress,
        setRating: setRating,
        getTotalCategory: getTotalCategory
    }
}]);


paypal.Buttons({
        createOrder: function (data, actions) {
            return '7649298556612402Y'
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                window.location.href = "approve.html";
            });
        },
        onError: function (err) {
            console.log('Something went wrong', err);
        }
    }).render('#paypal-button-container'); // Display payment options on your web page

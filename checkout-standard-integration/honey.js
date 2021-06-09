(() => {
    console.log("Honey extension simulator initialized");

    let createOrderClone;
    let onApproveClone;
    console.log('paypal', paypal);


    paypal.Buttons.instances[0].clone({
        decorate: (props) => {
            createOrderClone = props.createOrder;
            onApproveClone = props.onApprove;
        },
        createOrder: createOrderClone,
        onApprove: onApproveClone
    }).render('#honey-container');





    function discoverPayPalFrame() {
        return new Promise((resolve, reject) => {
            let timeoutId = null;
            const subscriptions = [];

            // this would be the domain the paypal iframe is loaded from
            const origin = "http://localhost:8081";

            // we would define the supported messages/args etc
            const message = {
                meta: { invoke: "paypal:ping" },
            };

            console.log(
                `Discovering PayPal Frame from [${window.frames.length}] available frames`
            );

            timeoutId = setTimeout(() => {
                timeoutExceeded = true;
                reject(new Error("PayPal frame not discovered; timeout"));
            }, 500);

            for (let i = 0; i < window.frames.length; i++) {
                const target = frames[i];
                const subscription = subscribe({
                    validate: (event) => {
                        if (event.origin != origin) {
                            console.log(event.origin);
                            return false;
                        }

                        if (
                            event.data &&
                            event.data.meta &&
                            event.data.meta.invoke != `${message.meta.invoke}`
                        ) {
                            return false;
                        }

                        return true;
                    },

                    callback: (event) => {
                        clearTimeout(timeoutId);
                        timeoutId = null;
                        subscriptions.forEach((x) => x.dispose());
                        resolve(event.source);
                    },
                });

                subscriptions.push(subscription);
                send({
                    target: target,
                    message: message,
                    origin: origin,
                });
            }
        });
    }
    //
    // discoverPayPalFrame()
    //     .then((target) => {
    //         console.log("Frame is able to communicate through:", target.postMessage);
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     })

})();

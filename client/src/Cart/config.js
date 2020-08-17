export function getConfig(handleReturnNonce) {
  // Initialize the payment form elements
  return {
    //TODO: Replace with your sandbox application ID
    applicationId: process.env.REACT_APP_APPLICATION_ID,
    inputClass: 'sq-input',
    autoBuild: false,
    // Customize the CSS for SqPaymentForm iframe elements
    inputStyles: [
      {
        fontSize: '16px',
        lineHeight: '24px',
        padding: '16px',
        placeholderColor: '#a0a0a0',
        backgroundColor: 'transparent'
      }
    ],
    // Initialize the credit card placeholders
    cardNumber: {
      elementId: 'sq-card-number',
      placeholder: 'Card Number'
    },
    cvv: {
      elementId: 'sq-cvv',
      placeholder: 'CVV'
    },
    expirationDate: {
      elementId: 'sq-expiration-date',
      placeholder: 'MM/YY'
    },
    postalCode: {
      elementId: 'sq-postal-code',
      placeholder: 'Postal'
    },
    // SqPaymentForm callback functions
    callbacks: {
      /*
       * callback function: cardNonceResponseReceived
       * Triggered when: SqPaymentForm completes a card nonce request
       */
      cardNonceResponseReceived: function(errors, nonce, cardData) {
        const errorList = document.getElementById('errors');
        if (errors) {
          let error_html = '';
          for (var i = 0; i < errors.length; i++) {
            error_html += '<li> ' + errors[i].message + ' </li>';
          }
          errorList.innerHTML = error_html;
          errorList.style.display = 'inline-block';
          // Log errors from nonce generation to the browser developer console.
          //   console.error('Encountered errors:');
          //   errors.forEach(function(error) {
          //     console.error('  ' + error.message);
          //   });
          //   alert('Encountered errors, check browser developer console for more details');

          return;
        }
        errorList.style.display = 'none';
        errorList.innerHTML = '';

        alert(`The generated nonce is:\n${nonce}`);

        handleReturnNonce(nonce);
        return;
        // TODO this needs to be a server call.
        // fetch('http://localhost:4000/process-payment', {
        //   method: 'POST',
        //   headers: {
        //     Accept: 'application/json',
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({
        //     nonce: nonce
        //   })
        // })
        //   .catch(err => {
        //     alert('Network error: ' + err);
        //   })
        //   .then(response => {
        //     if (!response.ok) {
        //       return response.text().then(errorInfo => Promise.reject(errorInfo));
        //     }
        //     return response.text();
        //   })
        //   .then(data => {
        //     console.log(JSON.stringify(data));
        //     alert(
        //       'Payment complete successfully!\nCheck browser developer console form more details'
        //     );

        //     handleCompletePayment(true);
        //   })
        //   .catch(err => {
        //     console.error(err);
        //     alert('Payment failed to complete!\nCheck browser developer console form more details');

        //     handleCompletePayment(false);
        //   });
      }
    }
  };
}

export default getConfig;

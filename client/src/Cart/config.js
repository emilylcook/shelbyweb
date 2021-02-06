export function getConfig(handleReturnNonce) {
  // Initialize the payment form elements
  return {
    //TODO: Replace with your sandbox application ID
    applicationId: process.env.REACT_APP_SQUARE_APPLICATION_ID,
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

        handleReturnNonce(nonce);
        return;
      }
    }
  };
}

export default getConfig;

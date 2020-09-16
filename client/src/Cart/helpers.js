import axios from 'axios';

const parseString = require('xml2js').parseString;

export const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}/;

export const shippingAddressFields = [
  {
    label: 'First Name',
    key: 'shippingFirstName',
    name: 'firstName',
    required: true,
    xs: 12,
    sm: 6
  },
  {
    label: 'Last Name',
    key: 'shippingLastName',
    name: 'lastName',
    required: true,
    xs: 12,
    sm: 6
  },
  {
    label: 'Address Line 1',
    key: 'shippingStreetAddress',
    name: 'address',
    required: true,
    xs: 12,
    sm: 12
  },
  {
    label: 'Address Line 2',
    key: 'shippingStreetAddress2',
    name: 'address2',
    xs: 12,
    sm: 6
  },
  {
    label: 'City',
    key: 'shippingCity',
    name: 'city',
    required: true,
    xs: 12,
    sm: 6
  },
  {
    label: 'Postal Code',
    key: 'shippingPostal',
    name: 'postal',
    required: true,
    xs: 12,
    sm: 6
  },
  {
    label: 'State',
    key: 'shippingState',
    name: 'state',
    required: true,
    xs: 12,
    sm: 6
  }
];

export const billingAddressFields = [
  {
    label: 'First Name',
    key: 'billingFirstName',
    required: true,
    xs: 12,
    sm: 6
  },
  {
    label: 'Last Name',
    key: 'billingLastName',
    required: true,
    xs: 12,
    sm: 6
  },
  {
    label: 'Address Line 1',
    key: 'billingStreetAddress',
    required: true,
    xs: 12,
    sm: 12
  },
  {
    label: 'Address Line 2',
    key: 'billingStreetAddress2',
    xs: 12,
    sm: 6
  },
  {
    label: 'City',
    key: 'billingCity',
    required: true,
    xs: 12,
    sm: 6
  },
  {
    label: 'Postal Code',
    key: 'billingPostal',
    required: true,
    xs: 12,
    sm: 6
  },
  {
    label: 'State',
    key: 'billingState',
    required: true,
    xs: 12,
    sm: 6
  }
];

const taxCalculation = {
  98021: 0.05,
  98122: 0.023
};

const USER_ID = '948EMILY3213';

export const calculateShippingCosts = async (formFields, items) => {
  const { shippingPostal } = formFields;

  let totalShipping = 0;
  const SELLER_ORIGIN = '98122';

  let packagesXml = '';
  items.forEach(item => {
    if (!item.shippingDetails) {
      throw Error('Shipping details not provided on item');
    }

    const { pounds, ounces, width, length, height, girth } = item?.shippingDetails;
    const { price, id } = item;

    packagesXml = `${packagesXml}
    <Package ID="${id}">
      <Service>Priority</Service>
      <ZipOrigination>${SELLER_ORIGIN}</ZipOrigination>
      <ZipDestination>${shippingPostal}</ZipDestination>
      <Pounds>${pounds}</Pounds>
      <Ounces>${ounces}</Ounces>
      <Container></Container>
      <Width>${width || ''}</Width>
      <Length>${length || ''}</Length>
      <Height>${height || ''}</Height>
      <Girth>${girth || ''}</Girth>
      <Value>${price}</Value>
      <Machinable>TRUE</Machinable>
    </Package>
    `;
  });

  // const value = 1524;
  const XML = `<RateV4Request USERID="${USER_ID}">
  <Revision>2</Revision>
   ${packagesXml}
  </RateV4Request>`;

  // TODO could do package 1-item in the same request
  // 155 = tracking
  // 108 = signature
  const getUrl = `http://secure.shippingapis.com/ShippingAPI.dll?API=RateV4&XML=${encodeURI(XML)}`;

  const TRACKING_SERVICE = 155;
  const SIGNATURE_SERVICE = 108;
  const INSURANCE_SERVICE = 125;

  console.log('GET SHIPPING');
  await axios
    .post(getUrl)
    .then(result => {
      parseString(result.data, function(err, result) {
        result.RateV4Response.Package.forEach(pack => {
          try {
            const postage = pack.Postage[0];
            let shipping = postage.Rate[0];

            const specialServices = postage.SpecialServices[0].SpecialService.reduce(
              (arr, service) => {
                arr[service.ServiceID] = service.Price[0];
                return arr;
              },
              {}
            );

            totalShipping +=
              parseInt(shipping) +
              parseInt(specialServices[INSURANCE_SERVICE]) +
              parseInt(specialServices[SIGNATURE_SERVICE]) +
              parseInt(specialServices[TRACKING_SERVICE]);
          } catch (e) {
            totalShipping += 100000;
            console.log('Error - setting max shipping', e);
          }
        });
      });
    })
    .catch(err => {
      // Do something
      totalShipping += 100000;
      console.log('USPS err', err);
    });

  console.log('donetotalShipping', totalShipping);
  return totalShipping;
};

export const validateAddress = async formFields => {
  const {
    shippingStreetAddress,
    shippingStreetAddress2,
    shippingPostal,
    shippingCity,
    shippingState
  } = formFields;

  const address2 = shippingStreetAddress2 ? shippingStreetAddress2.trim().replaceAll('#', '') : '';
  const XML = `<AddressValidateRequest USERID="948EMILY3213">
      <Revision>1</Revision>
      <Address ID="0">
        <Address1>${shippingStreetAddress}</Address1>
        <Address2>${address2}</Address2>
        <City>${shippingCity}</City>
        <State>${shippingState}</State>
        <Zip5>${shippingPostal}</Zip5>
        <Zip4 />
      </Address>
    </AddressValidateRequest>`;

  const getUrl = `http://secure.shippingapis.com/ShippingAPI.dll?API=Verify&XML=${encodeURI(XML)}`;

  let address = null;
  let error = false;
  await axios
    .post(getUrl)
    .then(result => {
      parseString(result.data, function(err, response) {
        if (response.Error) {
          address = false;
          error = response.Error[0].Description;
          return false;
        }

        if (response?.AddressValidateResponse?.Address[0].Error) {
          address = false;
          error = response?.AddressValidateResponse?.Address[0].Error[0].Description;
          return false;
        }

        if (response?.AddressValidateResponse?.Address[0]?.Zip4[0]) {
          // get USPS address
          const recommendedAddress = response?.AddressValidateResponse?.Address[0];
          address = {
            address1: recommendedAddress.Address2[0],
            address2: recommendedAddress.Address1 ? recommendedAddress.Address1[0] : null,
            city: recommendedAddress.City[0],
            state: recommendedAddress.State[0],
            zip5: recommendedAddress.Zip5[0],
            zip4: recommendedAddress.Zip4[0]
          };
        }
      });
    })
    .catch(err => {
      // Do something
      console.log('USPS validate address err', err);
    });

  return { address, error };
};

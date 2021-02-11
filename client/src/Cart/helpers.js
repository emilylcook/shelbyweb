import axios from 'axios';
import config from '../config';

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

const USER_ID = config.USPS_USER_ID;

export const calculateShippingCosts = async (formFields, items) => {
  const { shippingPostal, shippingCountry = 'UnitedStates' } = formFields;

  console.log(shippingCountry);

  let totalShipping = 0;
  const SELLER_ORIGIN = '98122';

  let shippingPostalToUse = shippingPostal;

  let packagesXml = '';

  const shippingInternational = shippingCountry !== 'UnitedStates';

  items.forEach(item => {
    if (!item.shippingDetails) {
      throw Error('Shipping details not provided on item');
    }

    const { pounds, ounces, width, length, height, girth } = item?.shippingDetails;
    const { price, id } = item;

    const twoWeeks = new Date(Date.now() + 12096e5);
    const year = twoWeeks.getFullYear();

    const month =
      twoWeeks.getMonth() + 1 < 10 ? `0${twoWeeks.getMonth() + 1}` : twoWeeks.getMonth() + 1;

    const day = twoWeeks.getDay() < 10 ? `0${twoWeeks.getDay()}` : twoWeeks.getDay();
    const acceptanceDate = `${year}-${month}-${day}T13:15:00-06:00`;

    if (shippingInternational) {
      packagesXml = `${packagesXml}
      <Package ID="${id}">
        <Pounds>${pounds}</Pounds>
        <Ounces>${ounces}</Ounces>
        <Machinable>True</Machinable>
        <MailType>Package</MailType>
        <ValueOfContents>${price}</ValueOfContents>
        <Country>Canada</Country> 
        <Width>${width || ''}</Width>
        <Length>${length || ''}</Length>
        <Height>${height || ''}</Height>
        <Girth>${girth || ''}</Girth>
        <OriginZip>${SELLER_ORIGIN}</OriginZip>
        <CommercialFlag>N</CommercialFlag>
        <AcceptanceDateTime>${acceptanceDate}</AcceptanceDateTime>
        <DestinationPostalCode>${shippingPostalToUse}</DestinationPostalCode>
      </Package>
      `;
    } else {
      shippingPostalToUse = shippingPostal.slice(0, 5);

      packagesXml = `${packagesXml}
      <Package ID="${id}">
        <Service>Priority</Service>
        <ZipOrigination>${SELLER_ORIGIN}</ZipOrigination>
        <ZipDestination>${shippingPostalToUse}</ZipDestination>
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
    }
  });

  const XML = shippingInternational
    ? `<IntlRateV2Request USERID="${USER_ID}">
  <Revision>2</Revision>
  ${packagesXml}
  </IntlRateV2Request>`
    : `<RateV4Request USERID="${USER_ID}">
   <Revision>2</Revision>
    ${packagesXml}
   </RateV4Request>`;

  const getUrl = shippingInternational
    ? `http://secure.shippingapis.com/ShippingAPI.dll?API=IntlRateV2&XML=${encodeURI(XML)}`
    : `https://secure.shippingapis.com/ShippingAPI.dll?API=RateV4&XML=${encodeURI(XML)}`;

  const TRACKING_SERVICE = 155;
  const SIGNATURE_SERVICE = 108;
  const INSURANCE_SERVICE = 125;

  await axios
    .post(getUrl)
    .then(result => {
      parseString(result.data, function(err, result) {
        if (result.IntlRateV2Response) {
          result.IntlRateV2Response.Package.forEach(pack => {
            try {
              const serviceToUse = pack?.Service.find(x => {
                return x.SvcDescription[0].startsWith('Priority Mail International');
              });

              const postage = serviceToUse.Postage[0];
              const extraService = serviceToUse.ExtraServices[0].ExtraService.find(
                s => s.ServiceID[0] === '108'
              );

              const insurance = extraService.Price[0];

              totalShipping += parseInt(postage) + parseInt(insurance);
            } catch (e) {
              console.log(e);
            }
          });
        } else {
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
              totalShipping = 100000;
              console.log('Error - setting max shipping', e);
            }
          });
        }
      });
    })
    .catch(err => {
      // Do something
      totalShipping = 100000;
      console.log('USPS err', err);
    });

  return totalShipping;
};

export const validateAddress = async formFields => {
  const {
    shippingStreetAddress,
    shippingStreetAddress2,
    shippingPostal,
    shippingCity,
    shippingState,
    shippingCountry
  } = formFields;

  const shippingInternational = shippingCountry !== 'UnitedStates';

  if (shippingInternational) {
    return { address: null, error: false };
  }

  const zip = shippingPostal.split('-');
  const zip5 = zip ? zip[0] : shippingPostal;

  const address1 = shippingStreetAddress.trim().replaceAll('#', '');
  const address2 = shippingStreetAddress2 ? shippingStreetAddress2.trim().replaceAll('#', '') : '';

  const XML = `<AddressValidateRequest USERID="${USER_ID}">
      <Revision>1</Revision>
      <Address ID="0">
        <Address1>${address1}</Address1>
        <Address2>${address2}</Address2>
        <City>${shippingCity}</City>
        <State>${shippingState}</State>
        <Zip5>${zip5}</Zip5>
        <Zip4 />
      </Address>
    </AddressValidateRequest>`;

  const getUrl = `https://secure.shippingapis.com/ShippingAPI.dll?API=Verify&XML=${encodeURI(XML)}`;

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
